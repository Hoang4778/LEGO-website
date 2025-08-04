const btnMinusQuantity = document.querySelector(".minus-quantity")
const btnPlusQuantity = document.querySelector(".plus-quantity")
const quantityCount = document.querySelector(".quantity-count")
const btnAddToCart = document.querySelector(".btn-add-to-cart")
const btnBuyNow = document.querySelector(".btn-buy-now")

if (btnMinusQuantity && btnPlusQuantity && quantityCount && btnAddToCart && btnBuyNow) {
    const cartStorage = localStorage.getItem("cartItems")
    if (cartStorage) {
        const cartListItems = JSON.parse(cartStorage)

        if (Array.isArray(cartListItems)) {
            for (let i = 0; i < cartListItems.length; i++) {
                if (cartListItems[i].id == quantityCount.dataset.productId) {
                    quantityCount.value = cartListItems[i].quantity
                }
            }
        }
    }

    const currentQuantity = parseInt(quantityCount.value)
    if (currentQuantity == 1) {
        btnMinusQuantity.disabled = true
    } else if (currentQuantity == 10) {
        btnPlusQuantity.disabled = true
    }

    btnMinusQuantity.onclick = () => {
        const currentQuantity = parseInt(quantityCount.value)
        if (currentQuantity == 2) {
            btnMinusQuantity.disabled = true
        } else if (currentQuantity == 10) {
            btnPlusQuantity.disabled = false
        } else {
            btnPlusQuantity.disabled = false
            btnMinusQuantity.disabled = false
        }
        quantityCount.value = currentQuantity - 1
    }

    btnPlusQuantity.onclick = () => {
        const currentQuantity = parseInt(quantityCount.value)
        if (currentQuantity == 1) {
            btnMinusQuantity.disabled = false
        } else if (currentQuantity == 9) {
            btnPlusQuantity.disabled = true
        } else {
            btnPlusQuantity.disabled = false
            btnMinusQuantity.disabled = false
        }
        quantityCount.value = currentQuantity + 1
    }

    quantityCount.onblur = () => {
        quantityCount.value = Math.floor(quantityCount.value)
        if (quantityCount.value < 1 || isNaN(quantityCount.value)) {
            quantityCount.value = 1
            btnMinusQuantity.disabled = true
        } else if (quantityCount.value > 10) {
            quantityCount.value = 10
            btnPlusQuantity.disabled = true
        } else {
            btnMinusQuantity.disabled = false
            btnPlusQuantity.disabled = false
        }
    }

    btnAddToCart.onclick = () => {
        const currentQuantity = parseInt(quantityCount.value)
        const cartItems = localStorage.getItem("cartItems")

        if (cartItems) {
            let cartAmount = 0
            const itemList = JSON.parse(cartItems)

            if (Array.isArray(itemList)) {
                let isItemExisted = false
                itemList.forEach(item => {
                    if (item.id == btnAddToCart.dataset.productId) {
                        item.quantity = currentQuantity
                        isItemExisted = true
                    }

                    cartAmount += item.quantity
                })

                if (!isItemExisted) {
                    const newItem = {
                        id: btnAddToCart.dataset.productId,
                        title: btnAddToCart.dataset.productTitle,
                        price: btnAddToCart.dataset.productPrice,
                        quantity: currentQuantity,
                        imageURL: btnAddToCart.dataset.productImageUrl,
                        handle: btnAddToCart.dataset.productHandle
                    }

                    itemList.push(newItem)
                    cartAmount += currentQuantity
                }
                localStorage.setItem("cartItems", JSON.stringify(itemList))
            } else {
                const newItemList = []
                const newItem = {
                    id: btnAddToCart.dataset.productId,
                    title: btnAddToCart.dataset.productTitle,
                    price: btnAddToCart.dataset.productPrice,
                    quantity: currentQuantity,
                    imageURL: btnAddToCart.dataset.productImageUrl,
                    handle: btnAddToCart.dataset.productHandle
                }
                newItemList.push(newItem)
                localStorage.setItem("cartItems", JSON.stringify(newItemList))
                cartAmount = currentQuantity
            }

            const itemQuantities = document.querySelectorAll(".item-quantity")
            itemQuantities.forEach(item => {
                item.textContent = currentQuantity
            })

            window.location.pathname = "/cart"
        } else {
            const newItemList = []
            const newItem = {
                id: btnAddToCart.dataset.productId,
                title: btnAddToCart.dataset.productTitle,
                price: btnAddToCart.dataset.productPrice,
                quantity: currentQuantity,
                imageURL: btnAddToCart.dataset.productImageUrl,
                handle: btnAddToCart.dataset.productHandle
            }
            newItemList.push(newItem)
            localStorage.setItem("cartItems", JSON.stringify(newItemList))

            const itemQuantities = document.querySelectorAll(".item-quantity")
            itemQuantities.forEach(item => {
                item.textContent = currentQuantity
            })

            window.location.pathname = "/cart"
        }
    }

    btnBuyNow.onclick = () => {
        btnBuyNow.disabled = true
        btnBuyNow.style.cursor = "not-allowed"

        const buyNowItems = [{
            id: btnBuyNow.dataset.productId,
            title: btnBuyNow.dataset.productTitle,
            price: btnBuyNow.dataset.productPrice,
            quantity: currentQuantity,
            imageURL: btnBuyNow.dataset.productImageUrl,
            handle: btnAddToCart.dataset.productHandle
        }]
        localStorage.setItem("buyNowItems", JSON.stringify(buyNowItems))

        const loginToken = localStorage.getItem("loginToken")
        if (loginToken) {
            window.location.pathname = "/checkout"
        } else {
            window.location.pathname = "/login"
        }
    }
}
