const cartItemsCounts = document.querySelectorAll(".item-quantity")

const cartItems = localStorage.getItem("cartItems")
if (cartItems) {
    let cartCount = 0
    const cartList = JSON.parse(cartItems)

    if (Array.isArray(cartList)) {
        cartList.forEach(item => {
            cartCount += item.quantity
        })
    }

    cartItemsCounts.forEach(count => {
        count.textContent = cartCount
    })
}