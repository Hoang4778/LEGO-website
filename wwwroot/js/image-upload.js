const removeImageAction = document.querySelector(".remove-image-action")
const currentProductImageWrapper = document.querySelector(".current-product-image-wrapper")
const currentProductImage = document.querySelector(".current-product-image-wrapper .product-image")
const productImageInputWrapper = document.querySelector(".product-image-input-wrapper")
const productImageInput = document.querySelector(".product-image-input")

if (removeImageAction && currentProductImageWrapper && productImageInputWrapper && currentProductImage && productImageInput) {
    removeImageAction.onclick = () => {
        currentProductImageWrapper.classList.remove("image-existed")
        productImageInputWrapper.classList.add("add-image")
        currentProductImage.src = ""
    }

    productImageInput.onchange = () => {
        const imageFile = productImageInput.files[0]

        if (imageFile) {
            const reader = new FileReader();

            reader.onload = () => {
                currentProductImage.src = reader.result
                currentProductImageWrapper.classList.add("image-existed")
                productImageInputWrapper.classList.remove("add-image")
            }

            reader.readAsDataURL(imageFile)
        }
    }
}
