function getFullURL(querykey, queryValue) {
    const pageLinkObj = new URL(window.location.href, window.location.origin)
    pageLinkObj.searchParams.set(querykey, queryValue);

    return pageLinkObj.href
}

const sortDropDown = document.querySelector(".sort-drop-down")
const paginatedPages = document.querySelectorAll(".paginated-page")

if (sortDropDown) {
    sortDropDown.onchange = () => {
        const selectedValue = sortDropDown.value
        window.location.href = getFullURL("sort", selectedValue)
    }
}

paginatedPages.forEach(page => {
    page.onclick = () => {
        const currentPage = page.getAttribute("data-go-to-page")

        if (currentPage != null) {
            window.location.href = getFullURL("currentPage", currentPage)
        } else {
            window.location.href = getFullURL("currentPage", "1")
        }
    }
})
