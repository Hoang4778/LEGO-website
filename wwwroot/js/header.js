import { hexToString } from "./stringConverter.js"

if (window.matchMedia("(max-width: 640px)").matches) {
    const hamburgerIcon = document.querySelector(".hamburger-icon")
    const closeIcon = document.querySelector(".close-icon")
    const mobileMenu = document.querySelector(".mobile-menu")
    const mobileMenuBackground = document.querySelector(".mobile-menu-background")
    const mobileSearchIcon = document.querySelector(".mobile-nav .btn-search")

    if (hamburgerIcon && closeIcon && mobileMenu && mobileMenuBackground && mobileSearchIcon) {
        hamburgerIcon.onclick = () => {
            mobileMenuBackground.classList.add("active")
            mobileMenu.classList.add("active")
            document.documentElement.style.overflow = "hidden"
        }

        closeIcon.onclick = () => {
            mobileMenuBackground.classList.remove("active")
            mobileMenu.classList.remove("active")
            document.documentElement.removeAttribute("style")
        }

        mobileMenuBackground.onclick = () => {
            mobileMenuBackground.classList.remove("active")
            mobileMenu.classList.remove("active")
            document.documentElement.removeAttribute("style")
        }

        mobileSearchIcon.onclick = () => {
            mobileMenuBackground.classList.remove("active")
            mobileMenu.classList.remove("active")
            document.documentElement.removeAttribute("style")

            const searchSection = document.querySelector(".search-section")
            if (searchSection) {
                searchSection.classList.add("active")
            }
        }
    }
} else {
    const desktopSearchIcon = document.querySelector(".desktop-nav .btn-search")
    if (desktopSearchIcon) {
        desktopSearchIcon.onclick = () => {
            const searchSection = document.querySelector(".search-section")
            if (searchSection) {
                searchSection.classList.add("active")
            }
        }
    }
}

const btnCloseSearch = document.querySelector(".btn-close-search")
if (btnCloseSearch) {
    btnCloseSearch.onclick = () => {
        const searchSection = document.querySelector(".search-section")
        if (searchSection) {
            searchSection.classList.remove("active")
        }
    }
}

const searchInput = document.querySelector(".search-input")
const clearInputBtn = document.querySelector(".clear-search-icon")
const instantResult = document.querySelector(".instant-result")
const productResult = instantResult.querySelector(".product-result")
const collectionResult = instantResult.querySelector(".collection-result")
const resultCount = instantResult.querySelector(".see-all-result")

if (searchInput && clearInputBtn && instantResult && productResult && collectionResult && resultCount) {
    searchInput.value = ""
    let searching
    searchInput.oninput = () => {
        if (searchInput.value.trim() != "") {
            clearInputBtn.classList.add("active")

            clearTimeout(searching)
            searching = setTimeout(async () => {
                try {
                    instantResult.classList.remove("active")
                    const searchValue = searchInput.value.toLowerCase().trim().replace(" ", "+")
                    const response = await fetch(`/api/search?query=${searchValue}`)
                    const result = await response.json()

                    collectionResult.innerHTML = ""
                    if (result.searchedCollectionCount > 0) {
                        result.collections.slice(0, 3).forEach(collection => {
                            const collectionItem = document.createElement("a")
                            collectionItem.classList.add("result-collection-link")
                            collectionItem.classList.add("link")
                            collectionItem.href = `/collections/${collection.handle}`
                            collectionItem.textContent = collection.title
                            collectionResult.appendChild(collectionItem)
                        })
                    }

                    productResult.innerHTML = ""
                    if (result.searchedProductCount > 0) {
                        result.products.slice(0, 3).forEach(product => {
                            const productItem = document.createElement("div")
                            productItem.classList.add("result-product-item")
                            productItem.innerHTML = `<img width="50" height="50" src="${product.imageURL}" alt="${product.title}" loading="lazy" /><a href="/products/${product.handle}" class="result-product-link link">${product.title}</a>`
                            productResult.appendChild(productItem)
                        })
                    }

                    resultCount.textContent = ""
                    const allResultCount = result.searchedProductCount + result.searchedCollectionCount

                    if (allResultCount > 0) {
                        resultCount.innerHTML = `<a href="/search?query=${searchValue}" class="all-result-link link">Show all ${allResultCount} ${allResultCount > 1 ? "results" : "result"}</a>`
                    } else {
                        resultCount.textContent = "No result found"
                    }

                    instantResult.classList.add("active")
                } catch (error) {
                    collectionResult.innerHTML = ""
                    productResult.innerHTML = ""
                    resultCount.textContent = "Error searching for products/collections. Please try again later"
                }
            }, 1500)
        } else {
            clearInputBtn.classList.remove("active")
        }
    }

    clearInputBtn.onclick = () => {
        searchInput.value = ""
        clearInputBtn.classList.remove("active")
    }

    searchInput.onfocus = () => {
        if (searchInput.value.trim() != "") {
            instantResult.classList.add("active")
        } else {
            instantResult.classList.remove("active")
        }
    }

    searchInput.onblur = () => {
        setTimeout(() => {
            instantResult.classList.remove("active")
        }, 300)
    }
}

const loginToken = localStorage.getItem("loginToken")
if (loginToken) {
    const rawLoginInfo = hexToString(loginToken)
    const loginInfo = JSON.parse(rawLoginInfo)

    const profileIcon = document.querySelector(".profile-icon")
    if (profileIcon && loginInfo.avatarURL) {
        profileIcon.setAttribute("src", loginInfo.avatarURL)
    }
}
