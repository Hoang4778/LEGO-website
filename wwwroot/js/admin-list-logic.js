const listItems = document.querySelectorAll(".list-item")

listItems.forEach(item => {
    item.onclick = () => {
        const itemLink = item.dataset.listItemLink

        if (itemLink) {
            window.open(window.location.origin + itemLink, "_self")
        }
    }
})