import { convertCurrentDateToDateTime } from "./dateConverter.js"

const urlObj = new URL(window.location.href)
const isCreatingOrder = urlObj.searchParams["createOrder"]

if (isCreatingOrder == "yes") {

} else {
    const btnSubmit = document.querySelector(".btn-submit")
    const submitError = document.querySelector(".submit-error")

    if (btnSubmit && submitError) {
        btnSubmit.onclick = (e) => {
            e.preventDefault()
            btnSubmit.disabled = true
            submitError.textContent = ""

            const orderStatus = document.querySelector(".order-status")
            const orderAddress = document.querySelector(".shipping-detail .address")
            const orderCity = document.querySelector(".shipping-detail .city")
            const orderState = document.querySelector(".shipping-detail .state")
            const orderCountry = document.querySelector(".shipping-detail .country")

            if (orderStatus && orderAddress && orderCity && orderState && orderCountry) {
                const orderId = parseInt(btnSubmit.dataset.orderId)
                const createdDate = btnSubmit.dataset.createdDate
                const orderDate = btnSubmit.dataset.orderDate
                const shippedDate = btnSubmit.dataset.shippedDate
                const deliveredDate = btnSubmit.dataset.deliveredDate
                const fulfilledDate = btnSubmit.dataset.fulfilledDate
                const archivedDate = btnSubmit.dataset.archivedDate
                const cancelledDate = btnSubmit.dataset.cancelledDate

                const orderStatusValue = orderStatus.value
                const order = {
                    id: orderId,
                    shippingAddress: orderAddress.value.trim(),
                    city: orderCity.value.trim(),
                    state: orderState.value.trim(),
                    country: orderCountry.value.trim(),
                    status: orderStatus.value,
                    createdDate: orderStatusValue == "Created" ? convertCurrentDateToDateTime() : (createdDate ? convertCurrentDateToDateTime(createdDate) : null),
                    orderDate: orderStatusValue == "Placed" ? convertCurrentDateToDateTime() : (orderDate ? convertCurrentDateToDateTime(orderDate) : null),
                    shippedDate: orderStatusValue == "Shipping" ? convertCurrentDateToDateTime() : (shippedDate ? convertCurrentDateToDateTime(shippedDate) : null),
                    deliveredDate: orderStatusValue == "Delivered" ? convertCurrentDateToDateTime() : (deliveredDate ? convertCurrentDateToDateTime(deliveredDate) : null),
                    fulfilledDate: orderStatusValue == "Fulfilled" ? convertCurrentDateToDateTime() : (fulfilledDate ? convertCurrentDateToDateTime(fulfilledDate) : null),
                    archivedDate: orderStatusValue == "Archived" ? convertCurrentDateToDateTime() : (archivedDate ? convertCurrentDateToDateTime(archivedDate) : null),
                    cancelledDate: orderStatusValue == "Cancelled" ? convertCurrentDateToDateTime() : (cancelledDate ? convertCurrentDateToDateTime(cancelledDate) : null)
                }

                fetch("/api/admin/order/update", {
                    method: "POST",
                    body: JSON.stringify(order)
                }).then(res => res.json()).then(result => {
                    if (result.isOkay) {
                        btnSubmit.disabled = false
                        submitError.textContent = result.message
                        submitError.style.color = "var(--secondary-color)"

                        setTimeout(() => {
                            submitError.textContent = ""
                            submitError.removeAttribute("style")
                            window.location.reload()
                        }, 3000)
                    } else {
                        btnSubmit.disabled = false
                        submitError.textContent = result.message
                    }
                }).catch(error => {
                    btnSubmit.disabled = false
                    submitError.textContent = error.message
                })
            } else {
                btnSubmit.disabled = false
                submitError.textContent = "Something went wrong with the submit. Please try again later."
            }
        }
    }
}