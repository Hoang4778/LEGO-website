import { hexToString } from "./stringConverter.js"

if (window.location.pathname != "/admin/login") {
    const adminLoginToken = localStorage.getItem("adminLoginToken")
    if (adminLoginToken) {
        const adminThumbnail = document.querySelector(".admin-thumbnail")
        const adminName = document.querySelector(".admin-name")
        const btnLogout = document.querySelector(".btn-log-out")
        const sidebar = document.querySelector(".sidebar")

        if (sidebar) {
            sidebar.classList.add("active")
        }

        if (adminThumbnail && adminName) {
            const rawAdminLogin = hexToString(adminLoginToken)
            const adminLoginInfo = JSON.parse(rawAdminLogin)

            if (adminLoginInfo.avatarURL != undefined) {
                adminThumbnail.setAttribute("src", adminLoginInfo.avatarURL)
            } 

            if (adminLoginInfo.accountName != undefined) {
                adminName.textContent = adminLoginInfo.accountName ?? "Admin"
            }
        }

        if (btnLogout) {
            btnLogout.onclick = () => {
                localStorage.removeItem("adminLoginToken")
                window.location.pathname = "/"
            }
        }
    } else {
        window.location.pathname = "/admin/login"
    }
}