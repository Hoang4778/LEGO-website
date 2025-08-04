const hamburgerIcon = document.querySelector(".hamburger-menu-icon")
const sidebar = document.querySelector(".sidebar")
const sidebarBg = document.querySelector(".sidebar-bg")

if (hamburgerIcon && sidebar && sidebarBg) {
    hamburgerIcon.onclick = () => {
        if (hamburgerIcon.classList.contains("open")) {
            sidebar.classList.remove("open")
            sidebarBg.classList.remove("active")
            hamburgerIcon.classList.remove("open")
            document.body.removeAttribute("style")
            hamburgerIcon.setAttribute("src", "/assets/icon/hamburger-menu.svg")
        } else {
            sidebar.classList.add("open")
            sidebarBg.classList.add("active")
            hamburgerIcon.classList.add("open")
            document.body.style.overflow = "hidden"
            hamburgerIcon.setAttribute("src", "/assets/icon/close.svg")
        }
    }
}