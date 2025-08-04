import { convertCurrentDateToDateTime } from "./dateConverter.js"

let isEmailValid = false 
let isPhoneNumberValid = false
let isCountryValid = false
let isStateValid = false
let isCityValid = false
let isAddressValid = false
let isCardNumberValid = false
let isCardNameValid = false
let isCardDateValid = false
let isCardCVVValid = false

const emailInput = document.querySelector(".form-item .email")
const emailError = document.querySelector(".form-item .email-error")
if (emailInput && emailError) {
    if (emailInput.value.trim() != "") {
        isEmailValid = true
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    emailInput.onblur = () => {
        const emailValue = emailInput.value.trim()

        if (emailValue == "") {
            isEmailValid = false
            emailError.textContent = "Email cannot be empty, please type it in."
        } else if (!emailRegex.test(emailValue)) {
            isEmailValid = false
            emailError.textContent = "Email is invalid, please put it right."
        } else {
            isEmailValid = true
            emailError.textContent = ""
        }
    }
}

const phoneNumberInput = document.querySelector(".form-item .phone-number")
const phoneNumberError = document.querySelector(".form-item .phone-number-error")
if (phoneNumberInput && phoneNumberError) {
    if (phoneNumberInput.value.trim() != "") {
        isPhoneNumberValid = true
    }
    const phoneNumberRegex = /^\d{10}$/

    phoneNumberInput.onblur = () => {
        const phoneNumberValue = phoneNumberInput.value.trim()

        if (phoneNumberValue == "") {
            isPhoneNumberValid = false
            phoneNumberError.textContent = "Phone number cannot be empty, please type it in."
        } else if (!phoneNumberRegex.test(phoneNumberValue)) {
            isPhoneNumberValid = false
            phoneNumberError.textContent = "Phone number is invalid, it needs to be 10 digits."
        } else {
            isPhoneNumberValid = true
            phoneNumberError.textContent = ""
        }
    }
}

const countryInput = document.querySelector(".form-item .country")
const countryError = document.querySelector(".form-item .country-error")
if (countryInput && countryError) {
    if (countryInput.value.trim() != "") {
        isCountryValid = true
    }

    countryInput.onblur = () => {
        const countryValue = countryInput.value.trim()
        if (countryValue == "") {
            isCountryValid = false
            countryError.textContent = "Country cannot be empty, please type it in."
        } else {
            isCountryValid = true
            countryError.textContent = ""
        }
    }
}

const stateInput = document.querySelector(".form-item .state")
const stateError = document.querySelector(".form-item .state-error")
if (stateInput && stateError) {
    if (stateInput.value.trim() != "") {
        isStateValid = true
    }

    stateInput.onblur = () => {
        const stateValue = stateInput.value.trim()
        if (stateValue == "") {
            isStateValid = false
            stateError.textContent = "State cannot be empty, please type it in."
        } else {
            isStateValid = true
            stateError.textContent = ""
        }
    }
}

const cityInput = document.querySelector(".form-item .city")
const cityError = document.querySelector(".form-item .city-error")
if (cityInput && cityError) {
    if (cityInput.value.trim() != "") {
        isCityValid = true
    }

    cityInput.onblur = () => {
        const cityValue = cityInput.value.trim()
        if (cityValue == "") {
            isCityValid = false
            cityError.textContent = "City cannot be empty, please type it in."
        } else {
            isCityValid = true
            cityError.textContent = ""
        }
    }
}

const addressInput = document.querySelector(".form-item .address")
const addressError = document.querySelector(".form-item .address-error")
if (addressInput && addressError) {
    if (addressInput.value.trim() != "") {
        isAddressValid = true
    }

    addressInput.onblur = () => {
        const addressValue = addressInput.value.trim()
        if (addressValue == "") {
            isAddressValid = false
            addressError.textContent = "Shipping address cannot be empty, please type it in."
        } else {
            isAddressValid = true
            addressError.textContent = ""
        }
    }
}

const carNumberInput = document.querySelector(".form-item .card-number")
const cardNumberError = document.querySelector(".form-item .card-number-error")
if (carNumberInput && cardNumberError) {
    let previousCardNumberValue = ""
    const cardNumberRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$/
    carNumberInput.oninput = () => {
        let cardNumberValue = carNumberInput.value.trim()
        if (previousCardNumberValue.length < cardNumberValue.length) {
            if (cardNumberValue.length == 4 || cardNumberValue.length == 9 || cardNumberValue.length == 14) {
                cardNumberValue += "-"
                carNumberInput.value = cardNumberValue
            }
        }
        previousCardNumberValue = cardNumberValue
    }

    carNumberInput.onblur = () => {
        const cardNumberValue = carNumberInput.value.trim()
        const cleanedNumber = cardNumberValue.replace(/\D/g, "")

        if (cleanedNumber == "") {
            isCardNumberValid = false
            cardNumberError.textContent = "Card number cannot be empty, please type it in."
        } else if (!cardNumberRegex.test(cleanedNumber)) {
            isCardNumberValid = false
            cardNumberError.textContent = "Card number is invalid, please type it right."
        } else {
            isCardNumberValid = true
            cardNumberError.textContent = ""
        }
    }
}

const cardNameInput = document.querySelector(".form-item .card-name")
const cardNameError = document.querySelector(".form-item .card-name-error")
if (cardNameInput && cardNameError) {
    cardNameInput.onblur = () => {
        const cardNameValue = cardNameInput.value.trim()
        if (cardNameValue == "") {
            isCardNameValid = false
            cardNameError.textContent = "Card name cannot be empty, please type it in."
        } else {
            isCardNameValid = true
            cardNameError.textContent = ""
        }
    }
}

const cardDateInput = document.querySelector(".form-item .expiration-date")
const cardDateError = document.querySelector(".form-item .expiration-date-error")
if (cardDateInput && cardDateError) {
    let previousDateValue = ""
    const expDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/

    cardDateInput.oninput = () => {
        let cardDateValue = cardDateInput.value.trim()

        if (previousDateValue.length < cardDateValue.length) {
            if (cardDateValue.length == 2) {
                cardDateValue += "/"
                cardDateInput.value = cardDateValue
            }
        }
        previousDateValue = cardDateValue
    }

    cardDateInput.onblur = () => {
        const cardDateValue = cardDateInput.value.trim()

        if (cardDateValue == "") {
            isCardDateValid = false
            cardDateError.textContent = "Expiration date cannot be empty, please type it in."
        } else if (!expDateRegex.test(cardDateValue)) {
            isCardDateValid = false
            cardDateError.textContent = "Expiration date is invalid, please type it right."
        } else {
            isCardDateValid = true
            cardDateError.textContent = ""
        }
    }
}

const cardCVVInput = document.querySelector(".form-item .card-cvv")
const cardCVVError = document.querySelector(".form-item .card-cvv-error")
if (cardCVVInput && cardCVVError) {
    const cvvRegex = /^\d{3,4}$/

    cardCVVInput.onblur = () => {
        const cardCVVValue = cardCVVInput.value.trim()

        if (cardCVVValue == "") {
            isCardCVVValid = false
            cardCVVError.textContent = "Card CVV cannot be empty, please type it in."
        } else if (!cvvRegex.test(cardCVVValue)) {
            isCardCVVValid = false
            cardCVVError.textContent = "Card CVV is invalid, please type it right."
        } else {
            isCardCVVValid = true
            cardCVVError.textContent = ""
        }
    }
}

const btnCheckout = document.querySelector(".order-action .btn-checkout")
const submitError = document.querySelector(".order-action .submit-error")
if (btnCheckout && submitError) {
    btnCheckout.onclick = (event) => {
        event.preventDefault()
        submitError.textContent = ""
        btnCheckout.disabled = true

        if (isEmailValid && isAddressValid && isCardCVVValid && isCardDateValid && isCardNameValid && isCardNumberValid && isCityValid && isCountryValid && isPhoneNumberValid && isStateValid) {
            const orderTotal = document.querySelector(".order-info-pcs .total")
            const shippingInfo = document.querySelector(".shipping-info")

            if (orderTotal && shippingInfo && addressInput && cityInput && stateInput && countryInput && emailInput) {
                const orderTotalAmount = parseFloat(orderTotal.textContent)
                const customerId = shippingInfo.dataset.customerId
                const shippingAddress = addressInput.value.trim()
                const email = emailInput.value.trim()

                const orderedItems = []
                const orderItems = document.querySelectorAll(".order-item")
                if (orderItems.length > 0) {
                    orderItems.forEach(item => {
                        const itemId = parseInt(item.dataset.itemId)
                        const quantity = parseInt(item.dataset.itemQuantity)

                        const orderItem = {
                            orderId: null,
                            productId: itemId,
                            quantity: quantity
                        }
                        orderedItems.push(orderItem)
                    })


                    fetch("/api/checkout/product-quantity", {
                        method: "POST",
                        body: JSON.stringify(orderedItems)
                    }).then(res4 => res4.json()).then(result4 => {
                        if (result4.isOkay) {
                            const order = {
                                customerId: parseInt(customerId),
                                total: orderTotalAmount,
                                shippingAddress: shippingAddress,
                                email: email,
                                city: cityInput.value.trim(),
                                state: stateInput.value.trim(),
                                country: countryInput.value.trim(),
                                status: "Placed",
                                orderDate: convertCurrentDateToDateTime(),
                                createdDate: convertCurrentDateToDateTime()
                            }

                            fetch("/api/checkout/order", {
                                method: "POST",
                                body: JSON.stringify(order)
                            }).then(res => res.json()).then(result => {
                                if (result.isOkay && result.orderId != null) {
                                    orderItems.forEach((item, idx) => {
                                        orderedItems[idx].orderId = result.orderId
                                    })

                                    fetch("/api/checkout/ordered-items", {
                                        method: "POST",
                                        body: JSON.stringify(orderedItems)
                                    }).then(res2 => res2.json()).then(result2 => {
                                        if (result2.isOkay && result2.orderId != null) {
                                            if (phoneNumberInput && countryInput && stateInput && cityInput && addressInput) {
                                                const infoUpdate = {
                                                    id: parseInt(customerId),
                                                    phoneNumber: phoneNumberInput.value.trim(),
                                                    address: addressInput.value.trim(),
                                                    city: cityInput.value.trim(),
                                                    state: stateInput.value.trim(),
                                                    country: countryInput.value.trim()
                                                }

                                                fetch("/api/profile/update", {
                                                    method: "POST",
                                                    body: JSON.stringify(infoUpdate)
                                                }).then(res3 => res3.json()).then(result3 => {
                                                    if (result3.isOkay) {
                                                        localStorage.removeItem("buyNowItems")
                                                        localStorage.removeItem("cartItems")
                                                        localStorage.setItem("loginToken", result3.loginToken)

                                                        window.location.href = `/thank-you?orderId=${result.orderId}`
                                                    } else {
                                                        btnCheckout.disabled = false
                                                        submitError.textContent = result3.message
                                                    }
                                                }).catch(error3 => {
                                                    btnCheckout.disabled = false
                                                    submitError.textContent = error3.message
                                                })
                                            }
                                        } else {
                                            btnCheckout.disabled = false
                                            submitError.textContent = result2.message
                                        }
                                    }).catch(error2 => {
                                        btnCheckout.disabled = false
                                        submitError.textContent = error2.message
                                    })
                                } else {
                                    btnCheckout.disabled = false
                                    submitError.textContent = result.message
                                }
                            }).catch(error => {
                                btnCheckout.disabled = false
                                submitError.textContent = error.message
                            })
                        } else {
                            btnCheckout.disabled = false
                            submitError.textContent = result4.message
                        }
                    }).catch(error4 => {
                        btnCheckout.disabled = false
                        submitError.textContent = error4.message
                    })
                } else {
                    btnCheckout.disabled = false
                    submitError.textContent = "Something went wrong with the ordered items list. Please try again later"
                }
            }
        } else {
            btnCheckout.disabled = false
            submitError.textContent = "Please check your information before placing the order."
        }
    }
}
