const cartStorage = localStorage.getItem("cartItems")

if (cartStorage) {
    const listItems = JSON.parse(cartStorage)

    if (Array.isArray(listItems)) {
        if (listItems.length == 0) {
            const cartList = document.querySelector(".cart-items")
            const cartLoading = document.querySelector(".cart-loading")
            const cartWrapper = document.querySelector(".cart-wrapper")

            if (cartLoading && cartList && cartWrapper) {
                cartLoading.classList.add("stop-loading")
                cartWrapper.classList.add("empty-status")
                cartList.innerHTML = `<p class="cart-empty">...is empty</p>`
            }
        } else {
            const cartList = document.querySelector(".cart-items")
            const cartLoading = document.querySelector(".cart-loading")
            const subtotalWrapper = document.querySelector(".subtotal-wrapper")

            if (cartList && cartLoading && subtotalWrapper) {
                let totalAmount = 0
                listItems.forEach(item => {
                    totalAmount += (parseFloat(item.price) ?? 0) * (parseInt(item.quantity) ?? 0)
                    const itemEl = document.createElement("div")
                    itemEl.classList.add("list-item")
                    itemEl.innerHTML = `<div class="info-image">
                <img src="${item.imageURL}" width="150" height="150" alt="${item.title}" loading="lazy" class="cart-image" />
                <div class="item-info">
                <a href="/products/${item.handle}"><h3>${item.title}</h3></a>
                <p>$${item.price}</p>
                </div>
                </div>
                <div class="item-amount">
                <div class="quantity-adjust">
                <button class="btn-remove-item" data-product-id="${item.id}">
                <img src="/assets/icon/trash-can.svg" width="20" height="20" alt="Remove item" loading="lazy" class="remove-item-icon" />
                </button>
				<div class="chosen-quantity">
					<button class="minus-quantity" data-product-price="${item.price}" data-product-id="${item.id}">-</button>
					<input class="quantity-count" name="quantityCount" type="number" min="1" max="10" value="${item.quantity}" step="1" />
					<button class="plus-quantity" data-product-price="${item.price}" data-product-id="${item.id}">+</button>
				</div>
                </div>
                <p>$<span class="item-total">${(parseFloat(item.price) ?? 0) * (parseInt(item.quantity) ?? 0)}</span></p>
                </div>
                `
                    cartList.appendChild(itemEl)
                })

                subtotalWrapper.innerHTML = `
            <p><b>Subtotal:</b> $<span class="subtotal">${Math.round(totalAmount * 100) / 100}</span></p>
            <p class="tax-note">Tax and shipping fee will be applied at checkout</p>
            <button class="btn-primary btn-checkout">Check out</button>
            `

                cartLoading.classList.add("stop-loading")
            }
        }
    } else {
        const cartList = document.querySelector(".cart-items")
        const cartLoading = document.querySelector(".cart-loading")
        const cartWrapper = document.querySelector(".cart-wrapper")

        if (cartLoading && cartList && cartWrapper) {
            cartLoading.classList.add("stop-loading")
            cartWrapper.classList.add("empty-status")
            cartList.innerHTML = `<p class="cart-empty">There was an error fetching the product items. Please try again later.</p>`
        }
    }
} else {
    const cartList = document.querySelector(".cart-items")
    const cartLoading = document.querySelector(".cart-loading")
    const cartWrapper = document.querySelector(".cart-wrapper")

    if (cartLoading && cartList && cartWrapper) {
        cartLoading.classList.add("stop-loading")
        cartWrapper.classList.add("empty-status")
        cartList.innerHTML = `<p class="cart-empty">...is empty</p>`
    }
}