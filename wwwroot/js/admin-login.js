import { stringToHex } from "./stringConverter.js"

const emailInput = document.querySelector(".email-input")
const passwordInput = document.querySelector(".password-input")
const btnSubmit = document.querySelector(".btn-submit")
const emailError = document.querySelector(".email-error")
const passwordError = document.querySelector(".password-error")
const loginError = document.querySelector(".login-error")

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

            fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "text/plain" },
                body: stringToHex(JSON.stringify({ email: emailValue, password: passwordValue }))
            })
                .then(response => response.json())
                .then(result => {
                    if (result.loginToken != "") {
                        localStorage.setItem("adminLoginToken", result.loginToken)
                        window.location.pathname = "/admin"
                    } else {
                        btnSubmit.disabled = false
                        loginError.textContent = result.message
                    }
                })
                .catch(err => {
                    btnSubmit.disabled = false
                    loginError.textContent = err.message
                })
        } else {
            btnSubmit.disabled = false
            loginError.textContent = "Please check your email and password again before submitting"
        }
    }
}
