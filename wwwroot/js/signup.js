import { stringToHex } from "./stringConverter.js"

const signupSection = document.querySelector(".signup-section")
const signedUpNote = document.querySelector(".signed-up")
const firstNameInput = document.querySelector(".first-name-input")
const lastNameInput = document.querySelector(".last-name-input")
const emailInput = document.querySelector(".email-input")
const passwordInput = document.querySelector(".password-input")
const passwordConfirmInput = document.querySelector(".password-confirm-input")
const btnSubmit = document.querySelector(".btn-submit")
const emailError = document.querySelector(".email-error")
const passwordError = document.querySelector(".password-error")
const passwordConfirmError = document.querySelector(".password-confirm-error")
const signupError = document.querySelector(".signup-error")
const hexLoginToken = localStorage.getItem("loginToken")

if (hexLoginToken) {
    if (signedUpNote) {
        signedUpNote.classList.add("active")

        setTimeout(() => {
            window.location.pathname = "/profile"
        }, 3000)
    }
} else {
    if (signupSection) {
        signupSection.classList.add("active")

        if (emailInput && passwordInput && passwordConfirmInput && emailError && passwordError && passwordConfirmError && btnSubmit && signupError && firstNameInput && lastNameInput) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            let isEmailValid = false
            let isPasswordValid = false
            let isPasswordConfirmValid = false

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

            passwordInput.onblur = () => {
                const passwordValue = passwordInput.value.trim()

                if (passwordValue == "") {
                    isPasswordValid = false
                    passwordError.textContent = "Password cannot be empty, please type it in."
                } else {
                    isPasswordValid = true
                    passwordError.textContent = ""
                }
            }

            passwordConfirmInput.onblur = () => {
                const passwordConfirmValue = passwordConfirmInput.value.trim()

                if (passwordConfirmValue == "") {
                    isPasswordConfirmValid = false
                    passwordConfirmError.textContent = "Password confirm cannot be empty, please type it in."
                } else if (passwordConfirmValue != passwordInput.value.trim()) {
                    isPasswordConfirmValid = false
                    passwordConfirmError.textContent = "Password confirm is not the same as the above password, please type it again."
                } else {
                    isPasswordConfirmValid = true
                    passwordConfirmError.textContent = ""
                }
            }

            btnSubmit.onclick = () => {
                signupError.textContent = ""
                btnSubmit.disabled = true

                if (isEmailValid && isPasswordValid && isPasswordConfirmValid) {
                    const firstName = firstNameInput.value.trim()
                    const lastName = lastNameInput.value.trim()
                    const email = emailInput.value.trim()
                    const password = passwordInput.value.trim()

                    fetch(`/api/signup/check-email?email=${email}`).then(res2 => res2.json()).then(result2 => {
                        if (result2.code == 200) {
                            signupError.textContent = result2.message
                            btnSubmit.disabled = false
                        } else if (result2.code == 404) {
                            fetch("/api/signup", {
                                method: "POST",
                                headers: { "Content-Type": "text/plain" },
                                body: stringToHex(JSON.stringify(
                                    {
                                        firstName: firstName != "" ? firstName : "Customer",
                                        lastName: lastName != "" ? lastName : "Creative",
                                        email: email,
                                        password: password
                                    }))
                            })
                                .then(response => response.json())
                                .then(result => {
                                    if (result.loginToken != "") {
                                        localStorage.setItem("loginToken", result.loginToken)

                                        if (document.referrer != "") {
                                            const referrer = new URL(document.referrer)

                                            if (referrer.origin == window.location.origin) {
                                                const buyNowItems = localStorage.getItem("buyNowItems")
                                                const cartItems = localStorage.getItem("cartItems")

                                                if (buyNowItems || cartItems) {
                                                    window.location.pathname = "/checkout"
                                                } else {
                                                    window.location.pathname = "/profile"
                                                }
                                            } else {
                                                window.location.pathname = "/profile"
                                            }
                                        } else {
                                            window.location.pathname = "/profile"
                                        }
                                    } else {
                                        signupError.textContent = result.message
                                        btnSubmit.disabled = false
                                    }
                                })
                                .catch(error => {
                                    signupError.textContent = error.message
                                    btnSubmit.disabled = false
                                })
                        } else {
                            signupError.textContent = result2.message
                            btnSubmit.disabled = false
                        }
                    }).catch(error2 => {
                        signupError.textContent = error2.message
                        btnSubmit.disabled = false
                    })
                } else {
                    signupError.textContent = "Please check your email and password again before submitting."
                    btnSubmit.disabled = false
                }
            }
        }
    }
}