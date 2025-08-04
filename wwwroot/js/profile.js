import { hexToString } from "./stringConverter.js"

const hexLoginToken = localStorage.getItem("loginToken")
const profileLoading = document.querySelector(".profile-loading")

if (hexLoginToken) {
    const rawLoginInfo = hexToString(hexLoginToken)
    const loginInfo = JSON.parse(rawLoginInfo)

    const accountInfo = document.querySelector(".account-info")
    const shippingInfo = document.querySelector(".shipping-info")
    const profileWrapper = document.querySelector(".profile-wrapper")

    if (accountInfo && shippingInfo && profileLoading && profileWrapper) {
        accountInfo.innerHTML = `
        <h2>Account info</h2>
        <div class="account-info-inner">
        <div class="profile-info-inner">
        <div>
        <img src="${loginInfo.avatarURL ?? "/assets/icon/profile.svg"}" alt="${loginInfo.firstName} ${loginInfo.lastName}" width="100" height="100" loading="eager" />
        </div>
        <div>
        <p>Name: <span class="profile-name">${loginInfo.firstName} ${loginInfo.lastName}</span></p>
        <p>Email: ${loginInfo.email ?? "No email found"}</p>
        </div>
        </div>
        <div class="profile-action">
        <button class="btn-secondary btn-log-out">Log out</buton>
        </div>
        </div>
        `

        shippingInfo.innerHTML = `
        <h2>Shipping info</h2>
        <div>
        <p>Phone number: ${loginInfo.phoneNumber ?? "No phone number found"}</p>
        <p>Address: ${loginInfo.address ?? "No address found"}</p>
        <p>City: ${loginInfo.city ?? "No city found"}</p>
        <p>State: ${loginInfo.state ?? "No state found"}</p>
        <p>Country: ${loginInfo.country ?? "No country found"}</p>
        </div>
        `

        profileLoading.classList.add("stop-loading")
        profileWrapper.classList.add("active")
    }
} else {
    const errorMessage = document.querySelector(".error-message")

    if (errorMessage && profileLoading) {
        profileLoading.classList.add("stop-loading")
        errorMessage.textContent = "You are not logged in yet. Transitioning you to the login page..."
    }

    setTimeout(() => {
        window.location.pathname = "/login"
    }, 3000)
}