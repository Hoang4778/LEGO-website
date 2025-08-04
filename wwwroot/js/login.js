import { stringToHex } from "./stringConverter.js"

const emailInput = document.querySelector(".email-input")
const passwordInput = document.querySelector(".password-input")
const btnSubmit = document.querySelector(".btn-submit")
const loginSection = document.querySelector(".login-section")
const loggedInNote = document.querySelector(".logged-in")
const emailError = document.querySelector(".email-error")
const passwordError = document.querySelector(".password-error")
const loginError = document.querySelector(".login-error")

if (loginSection && loggedInNote) {
    const loginToken = localStorage.getItem("loginToken")

    if (loginToken) {
        loggedInNote.classList.add("active")

        setTimeout(() => {
            window.location.pathname = "/profile"
        }, 3000)
    } else {
        loginSection.classList.add("active")

        if (emailInput && passwordInput && btnSubmit && emailError && passwordError && loginError) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            let isEmailValid = false
            let isPasswordValid = false

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

            btnSubmit.onclick = () => {
                loginError.textContent = ""
                btnSubmit.disabled = true

                if (isEmailValid && isPasswordValid) {
                    const emailValue = emailInput.value.trim()
                    const passwordValue = passwordInput.value.trim()

                    fetch("/api/login", {
                        method: "POST",
                        headers: { "Content-Type": "text/plain" },
                        body: stringToHex(JSON.stringify({ email: emailValue, password: passwordValue }))
                    })
                        .then(response => response.json())
                        .then(result => {
                            if (result.loginToken != "") {
                                localStorage.setItem("loginToken", result.loginToken)

                                if (document.referrer != "") {
                                    const referrer = new URL(document.referrer)

                                    if (referrer.origin == window.location.origin && (referrer.pathname.includes("/cart") || referrer.pathname.includes("/products/"))) {
                                        window.location.pathname = "/checkout"
                                    } else {
                                        window.location.pathname = "/profile"
                                    }
                                } else {
                                    window.location.pathname = "/profile"
                                }
                            } else {
                                loginError.textContent = result.message
                                btnSubmit.disabled = false
                            }
                        })
                        .catch(err => {
                            loginError.textContent = err.message
                            btnSubmit.disabled = false
                        })
                } else {
                    loginError.textContent = "Please check your email and password again before submitting"
                    btnSubmit.disabled = false
                }
            }
        }
    }
} else {
    window.location.pathname = "/"
}
