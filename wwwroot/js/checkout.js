import { hexToString } from "./stringConverter.js"

const tokenLogin = localStorage.getItem("loginToken")
const buyNowItems = localStorage.getItem("buyNowItems")

if (tokenLogin && buyNowItems) {
    const rawLoginInfo = hexToString(tokenLogin)
    const loginInfo = JSON.parse(rawLoginInfo)
    const itemsList = JSON.parse(buyNowItems)

    if (loginInfo.id && Array.isArray(itemsList) && itemsList.length > 0) {
        const orderSummary = document.querySelector(".order-summary")
        const shippingInfo = document.querySelector(".shipping-info")
        const paymentMethod = document.querySelector(".payment-method")
        const orderItems = document.querySelector(".order-items")
        const checkoutLoading = document.querySelector(".checkout-loading")
        const checkoutWrapper = document.querySelector(".checkout-wrapper")

        if (orderSummary && shippingInfo && paymentMethod && orderItems && checkoutLoading && checkoutWrapper) {
            shippingInfo.setAttribute("data-customer-id", loginInfo.id)
            shippingInfo.innerHTML = `
            <h2>Delivery</h2>
            <div class="shipping-info-inner">
            <div class="form-item">
            <label for="email">Email</label>
            <input name="email" id="email" type="email" placeholder="Email" value="${loginInfo.email ?? ""}" class="email" maxlength="100" />
            <p class="email-error"></p>
            </div>
            <div class="form-item">
            <label for="phone-number">Phone number</label>
            <input name="phoneNumber" id="phone-number" type="text" placeholder="Phone number" value="${loginInfo.phoneNumber ?? ""}" maxlength="10" class="phone-number"/>
            <p class="phone-number-error"></p>
            </div>
            <div class="form-item">
            <label for="address">Shipping address</label>
            <input name="address" id="address" type="text" placeholder="Address" value="${loginInfo.address ?? ""}" class="address" maxlength="200" />
            <p class="address-error"></p>
            </div>
            <div class="form-item">
            <label for="city">City</label>
            <input name="city" id="city" value="${loginInfo.city ?? ""}" class="city" type="text" placeholder="City" maxlength="50"/>
            <p class="city-error"></p>
            </div>
            <div class="form-item">
            <label for="state">State</label>
            <input name="state" id="state" value="${loginInfo.state ?? ""}" class="state" type="text" placeholder="State" maxlength="50"/>
            <p class="state-error"></p>
            </div>
            <div class="form-item">
            <label for="country">Country</label>
            <input name="country" id="country" value="${loginInfo.country ?? ""}" class="country" type="text" placeholder="Country" maxlength="50"/>
            <p class="country-error"></p>
            </div>
            </div>
            `

            paymentMethod.innerHTML = `
            <h2>Payment</h2>
            <div class="payment-method-inner">
            <div class="form-item">
            <input name="card-number" class="card-number" type="text" id="card-number" placeholder="Card number" maxlength="19" />
            <p class="card-number-error"></p>
            </div>
            <div class="form-item">
            <input name="card-name" class="card-name" type="text" id="card-name" placeholder="Card name" maxlength="100" />
            <p class="card-name-error"></p>
            </div>
            <div class="form-item">
            <input name="expiration-date" class="expiration-date" type="text" id="expiration-date" placeholder="MM/YY" maxlength="5" />
            <p class="expiration-date-error"></p>
            </div>
            <div class="form-item">
            <input name="card-cvv" class="card-cvv" type="password" id="card-cvv" placeholder="CVV" maxlength="3" />
            <p class="card-cvv-error"></p>
            </div>
            </div>
            `

            itemsList.forEach(item => {
                const orderItem = document.createElement("div")
                orderItem.classList.add("order-item")
                orderItem.setAttribute("data-item-id", item.id)
                orderItem.setAttribute("data-item-quantity", item.quantity)
                orderItem.innerHTML = `
                <img src="${item.imageURL}" width="100" height="100" alt="${item.title}" loading="lazy" />
                <div class="item-info">
                <p>${item.title} x <span class="checkout-item-quantity"> ${item.quantity}</span></p>
                <p class="checkout-item-price">$${item.price}</p>
                </div>
                `
                orderItems.appendChild(orderItem)
            })

            const rawSubtotal = itemsList.reduce((accumulator, currentValue) => accumulator + (parseInt(currentValue.quantity) * parseFloat(currentValue.price)), 0)
            const subtotal = Math.round(rawSubtotal * 100) / 100
            const shippingFee = Math.round((subtotal * 0.05) * 100) / 100
            const tax = Math.round((subtotal * 0.1) * 100) / 100
            const total = Math.round((shippingFee + tax + subtotal) * 100) / 100

            orderSummary.innerHTML = `
            <div class="order-info-pcs">
            <p>Subtotal:</p><p class="subtotal">$${subtotal}</p>
            </div>
            <div class="order-info-pcs">
            <p>Shipping fee:</p><p class="shipping-fee">$${shippingFee}</p>
            </div>
            <div class="order-info-pcs">
            <p>Tax:</p><p class="tax">$${tax}</p>
            </div>
            <div class="order-info-pcs">
            <p>Total:</p><p class="total">${total}</p>
            </div>
            `

            checkoutLoading.classList.add("stop-loading")
            checkoutWrapper.classList.add("active")
        }
    }
} else {
    const checkoutLoading = document.querySelector(".checkout-loading")
    const errorMessage = document.querySelector(".error-message")
    if (checkoutLoading && errorMessage) {
        checkoutLoading.classList.add("stop-loading")
        errorMessage.innerHTML  = `Well, it seems that you have not decided which items to buy yet. Please go to the <a href="/cart">Cart page</a> first.`
    }
}