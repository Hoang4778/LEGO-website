const btnLogout = document.querySelector(".btn-log-out")

if (btnLogout) {
    btnLogout.onclick = () => {
        const logoutModalWrapper = document.querySelector(".logout-modal-wrapper")
        const btnLogoutYes = document.querySelector(".logout-modal-action .btn-yes")
        const btnLogoutNo = document.querySelector(".logout-modal-action .btn-no")

        if (logoutModalWrapper && btnLogoutYes && btnLogoutNo) {
            logoutModalWrapper.classList.add("active")

            btnLogoutYes.onclick = () => {
                const hexLoginToken = localStorage.getItem("loginToken")

                if (hexLoginToken) {
                    localStorage.removeItem("loginToken")
                    window.location.pathname = "/"
                } else {
                    const logoutErrorMessage = document.querySelector("logout-error-message")

                    if (logoutErrorMessage) {
                        logoutErrorMessage.textContent = "Something went wrong for now. Please try again later."
                    }
                }
            }

            btnLogoutNo.onclick = () => {
                logoutModalWrapper.classList.remove("active")
            }
        }
    }
}