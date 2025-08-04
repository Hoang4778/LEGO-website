const cartItemList = localStorage.getItem("cartItems")

if (cartItemList) {
    const itemList = JSON.parse(cartItemList)

    if (Array.isArray(itemList)) {
        const btnCheckout = document.querySelector(".btn-checkout")
        const itemQuantity = document.querySelector(".item-quantity")
        const subtotal = document.querySelector(".subtotal")
        const btnMinusQuantities = document.querySelectorAll(".minus-quantity")
        const btnPlusQuantities = document.querySelectorAll(".plus-quantity")
        const quantityCounts = document.querySelectorAll(".quantity-count")
        const btnRemoveItems = document.querySelectorAll(".btn-remove-item")
        const itemTotals = document.querySelectorAll(".item-total")

        if (itemQuantity && subtotal && btnCheckout) {
            quantityCounts.forEach((count, idx) => {
                const currentQuantity = parseInt(count.value)

                if (currentQuantity == 1) {
                    btnMinusQuantities[idx].disabled = true
                } else if (currentQuantity == 10) {
                    btnPlusQuantities[idx].disabled = true
                }

                btnMinusQuantities[idx].onclick = () => {
                    const currentQuantity = parseInt(count.value)

                    if (currentQuantity == 2) {
                        btnMinusQuantities[idx].disabled = true
                    } else if (currentQuantity == 10) {
                        btnPlusQuantities[idx].disabled = false
                    } else {
                        btnMinusQuantities[idx].disabled = false
                        btnPlusQuantities[idx].disabled = false
                    }
                    count.value = currentQuantity - 1

                    for (let i = 0; i < itemList.length; i++) {
                        if (itemList[i].id == btnMinusQuantities[idx].dataset.productId) {
                            itemList[i].quantity = parseInt(count.value)
                        }
                    }

                    let itemCount = 0
                    quantityCounts.forEach(count => {
                        itemCount += parseInt(count.value)
                    })
                    itemQuantity.textContent = itemCount

                    const rawItemTotal = (parseInt(count.value) ?? 0) * (parseFloat(btnMinusQuantities[idx].dataset.productPrice) ?? 0)
                    itemTotals[idx].textContent = Math.round(rawItemTotal * 100) / 100

                    let newSubtotal = 0
                    itemTotals.forEach(total => {
                        newSubtotal += parseFloat(total.textContent)
                    })
                    subtotal.textContent = Math.round(newSubtotal * 100) / 100
                }

                btnPlusQuantities[idx].onclick = () => {
                    const currentQuantity = parseInt(count.value)

                    if (currentQuantity == 1) {
                        btnMinusQuantities[idx].disabled = false
                    } else if (currentQuantity == 9) {
                        btnPlusQuantities[idx].disabled = true
                    } else {
                        btnMinusQuantities[idx].disabled = false
                        btnPlusQuantities[idx].disabled = false
                    }
                    count.value = currentQuantity + 1

                    for (let i = 0; i < itemList.length; i++) {
                        if (itemList[i].id == btnMinusQuantities[idx].dataset.productId) {
                            itemList[i].quantity = parseInt(count.value)
                        }
                    }

                    let itemCount = 0
                    quantityCounts.forEach(count => {
                        itemCount += parseInt(count.value)
                    })
                    itemQuantity.textContent = itemCount

                    const rawItemTotal = (parseInt(count.value) ?? 0) * (parseFloat(btnMinusQuantities[idx].dataset.productPrice) ?? 0)
                    itemTotals[idx].textContent = Math.round(rawItemTotal * 100) / 100

                    let newSubtotal = 0
                    itemTotals.forEach(total => {
                        newSubtotal += parseFloat(total.textContent)
                    })
                    subtotal.textContent = Math.round(newSubtotal * 100) / 100
                }

                count.onblur = () => {
                    count.value = Math.floor(count.value)
                    if (count.value < 1 || isNaN(count.value)) {
                        count.value = 1
                        btnMinusQuantities[idx].disabled = true
                    } else if (count.value > 10) {
                        count.value = 10
                        btnPlusQuantities[idx].disabled = true
                    } else {
                        btnMinusQuantities[idx].disabled = false
                        btnPlusQuantities[idx].disabled = false
                    }

                    for (let i = 0; i < itemList.length; i++) {
                        if (itemList[i].id == btnMinusQuantities[idx].dataset.productId) {
                            itemList[i].quantity = parseInt(count.value)
                        }
                    }

                    let itemCount = 0
                    quantityCounts.forEach(count => {
                        itemCount += parseInt(count.value)
                    })
                    itemQuantity.textContent = itemCount

                    const rawItemTotal = (parseInt(count.value) ?? 0) * (parseFloat(btnMinusQuantities[idx].dataset.productPrice) ?? 0)
                    itemTotals[idx].textContent = Math.round(rawItemTotal * 100) / 100

                    let newSubtotal = 0
                    itemTotals.forEach(total => {
                        newSubtotal += parseFloat(total.textContent)
                    })
                    subtotal.textContent = Math.round(newSubtotal * 100) / 100
                }

                btnRemoveItems[idx].onclick = () => {
                    for (let i = itemList.length - 1; i >= 0; i--) {
                        if (itemList[i].id == btnRemoveItems[idx].dataset.productId) {
                            itemList.splice(i, 1)
                        }
                    }
                    location.reload()
                }
            })

            window.onbeforeunload = () => {
                localStorage.setItem("cartItems", JSON.stringify(itemList))
            }

            btnCheckout.onclick = () => {
                localStorage.setItem("buyNowItems", JSON.stringify(itemList))

                const loginToken = localStorage.getItem("loginToken")
                if (loginToken) {
                    window.location.pathname = "/checkout"
                } else {
                    window.location.pathname = "/login"
                }
            }

        }
    }
}