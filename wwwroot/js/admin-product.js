const btnSubmit = document.querySelector(".btn-submit")
const submitError = document.querySelector(".submit-error")
if (btnSubmit && submitError) {
    btnSubmit.onclick = (e) => {
        e.preventDefault()
        btnSubmit.disabled = true
        submitError.textContent = ""

        let productIdValue = null
        const productId = parseInt(btnSubmit.dataset.productId)
        if (productId != NaN) {
            productIdValue = productId
        }

        let titleValue = null
        let isTitleValid = false
        const titleInput = document.querySelector(".title-input")
        const titleError = document.querySelector(".title-error")
        if (titleInput && titleError) {
            titleValue = titleInput.value.trim()
            if (titleValue == "") {
                isTitleValid = false
                titleError.textContent = "Product title cannot be empty. Please type it in."

                btnSubmit.disabled = false
                submitError.textContent = ""
                return;
            } else {
                isTitleValid = true
                titleError.textContent = ""
            }
        }

        let descValue = null
        let isDescValid = false
        const descInput = document.querySelector(".desc-input")
        const descError = document.querySelector(".desc-error")
        if (descInput && descError) {
            descValue = descInput.value.trim()

            if (descValue == "") {
                isDescValid = false
                descError.textContent = "Product description cannot be empty. Please type it in."

                btnSubmit.disabled = false
                submitError.textContent = ""
                return;
            } else {
                isDescValid = true
                descError.textContent = ""
            }
        }

        let priceValue = null
        let isPriceValid = false
        const priceInput = document.querySelector(".price-input")
        const priceError = document.querySelector(".price-error")
        if (priceInput && priceError) {
            priceValue = parseFloat(priceInput.value.trim())

            if (priceValue == NaN) {
                isPriceValid = false
                priceError.textContent = "Product price is invalid. Please type it right."

                btnSubmit.disabled = false
                submitError.textContent = ""
                return;
            } else if (priceValue < 0) {
                isPriceValid = false
                priceError.textContent = "Product price must be greater than 0. Please type it right."

                btnSubmit.disabled = false
                submitError.textContent = ""
                return;
            } else {
                isPriceValid = true
                priceError.textContent = ""
            }
        }

        let inventoryValue = null
        let isInventoryValid = false
        const inventoryInput = document.querySelector(".inventory-input")
        const inventoryError = document.querySelector(".inventory-error")
        if (inventoryInput && inventoryError) {
            inventoryValue = parseInt(inventoryInput.value.trim())

            if (inventoryValue == NaN) {
                isInventoryValid = false
                inventoryError.textContent = "Inventory is invalid. Please type it right."

                btnSubmit.disabled = false
                submitError.textContent = ""
                return;
            } else if (inventoryValue < 0) {
                isInventoryValid = false
                inventoryError.textContent = "Inventory must be greater than 0. Please type it right."

                btnSubmit.disabled = false
                submitError.textContent = ""
                return;
            } else {
                isInventoryValid = true
                inventoryError.textContent = ""
            }
        }

        let modelNumberValue = null
        let isModelNumberValid = false
        const modelNumberInput = document.querySelector(".model-number-input")
        const modelNumberError = document.querySelector(".model-number-error")
        if (modelNumberInput && modelNumberError) {
            modelNumberValue = parseInt(modelNumberInput.value.trim())

            if (modelNumberValue == NaN) {
                isModelNumberValid = false
                modelNumberError.textContent = "Model number is invalid. Please type it right."

                btnSubmit.disabled = false
                submitError.textContent = ""
                return;
            } else if (modelNumberError < 0) {
                isModelNumberValid = false
                modelNumberError.textContent = "Model number must be greater than 0. Please type it right."

                btnSubmit.disabled = false
                submitError.textContent = ""
                return;
            } else {
                isModelNumberValid = true
                modelNumberError.textContent = ""
            }
        }

        let statusValue = null
        const statusInput = document.querySelector(".status-input")
        if (statusInput) {
            statusValue = statusInput.value == "true" ? true : false
        }

        let collectionIdValue = null
        const collectionIdInput = document.querySelector(".collection-input")
        if (collectionIdInput) {
            collectionIdValue = parseInt(collectionIdInput.value)
        }

        let imageFile = null
        let imageLink = null
        let isImageValid = false
        const imageInput = document.querySelector(".product-image-input")
        const imageError = document.querySelector(".image-upload-error")
        const currentImage = document.querySelector(".product-image")
        if (imageInput && imageError && currentImage) {
            if (imageInput.files.length == 0) {
                if (currentImage.src.includes("https://")) {
                    imageLink = currentImage.src
                    isImageValid = true
                } else {
                    isImageValid = false
                    imageError.textContent = "Please upload one image for this product."
                    btnSubmit.disabled = false
                    submitError.textContent = ""
                    return;
                }
            } else {
                imageFile = imageInput.files[0]
                isImageValid = true
                imageError.textContent = ""
            }
        }

        if (isTitleValid && isDescValid && isPriceValid && isInventoryValid && isModelNumberValid & isImageValid) {
            if (imageLink) {
                const product = {
                    id: productIdValue,
                    title: titleValue,
                    description: descValue,
                    handle: titleValue != null ? titleValue.toLowerCase().replaceAll(" ", "-") : null,
                    price: priceValue,
                    inventory: inventoryValue,
                    status: statusValue,
                    modelNumber: modelNumberValue,
                    collectionId: collectionIdValue,
                    imageURL: imageLink
                }

                fetch("/api/admin/product/update", {
                    method: "POST",
                    "Content-Type": "application/json",
                    body: JSON.stringify(product)
                })
                    .then(response => response.json())
                    .then(result => {
                        if (result.isOkay) {
                            btnSubmit.disabled = false
                            submitError.style.color = "var(--secondary-color)"
                            submitError.textContent = result.message

                            setTimeout(() => {
                                submitError.textContent = ""
                                submitError.removeAttribute("style")
                                window.location.reload()
                            }, 3000)

                            return;
                        } else {
                            btnSubmit.disabled = false
                            submitError.removeAttribute("style")
                            submitError.textContent = result.message
                            return;
                        }
                    }).catch(error => {
                        btnSubmit.disabled = false
                        submitError.removeAttribute("style")
                        submitError.textContent = error.message
                        return;
                    })
            } else if (imageFile) {
                const imageFormData = new FormData()
                imageFormData.append("file", imageFile)
                imageFormData.append("upload_preset", "ml_default")
                imageFormData.append("api_key", 764163852778554)
                imageFormData.append("public_id", imageFile.name)
                imageFormData.append("folder", "LegoWebsite/ProductImage")

                fetch("https://api.cloudinary.com/v1_1/dpmed5hfe/image/upload", {
                    method: "POST",
                    body: imageFormData
                })
                    .then(response => response.json())
                    .then(result => {
                        if (result.asset_id) {
                            const product = {
                                id: productIdValue,
                                title: titleValue,
                                description: descValue,
                                handle: titleValue != null ? titleValue.toLowerCase().replaceAll(" ", "-") : null,
                                price: priceValue,
                                inventory: inventoryValue,
                                status: statusValue,
                                modelNumber: modelNumberValue,
                                collectionId: collectionIdValue,
                                imageURL: result.secure_url
                            }

                            if (productIdValue) {
                                fetch("/api/admin/product/update", {
                                    method: "POST",
                                    "Content-Type": "application/json",
                                    body: JSON.stringify(product)
                                })
                                    .then(response => response.json())
                                    .then(result => {
                                        if (result.isOkay) {
                                            btnSubmit.disabled = false
                                            submitError.style.color = "var(--secondary-color)"
                                            submitError.textContent = result.message

                                            setTimeout(() => {
                                                submitError.textContent = ""
                                                submitError.removeAttribute("style")
                                                window.location.reload()
                                            }, 3000)

                                            return;
                                        } else {
                                            btnSubmit.disabled = false
                                            submitError.removeAttribute("style")
                                            submitError.textContent = result.message
                                            return;
                                        }
                                    }).catch(error => {
                                        btnSubmit.disabled = false
                                        submitError.removeAttribute("style")
                                        submitError.textContent = error.message
                                        return;
                                    })
                            } else {
                                fetch("/api/admin/product/create", {
                                    method: "POST",
                                    "Content-Type": "application/json",
                                    body: JSON.stringify(product)
                                })
                                    .then(response => response.json())
                                    .then(result => {
                                        if (result.isOkay) {
                                            btnSubmit.disabled = false
                                            submitError.style.color = "var(--secondary-color)"
                                            submitError.textContent = result.message

                                            titleInput.value = ""
                                            descInput.value = ""
                                            priceInput.value = ""
                                            inventoryInput.value = ""
                                            modelNumberInput.value = ""
                                            statusInput.selectedIndex = 0
                                            collectionIdInput.selectedIndex = 0

                                            const removeImageIcon = document.querySelector(".remove-image-action")
                                            if (removeImageIcon) {
                                                removeImageIcon.click()
                                            }

                                            setTimeout(() => {
                                                submitError.textContent = ""
                                                submitError.removeAttribute("style")
                                                window.location.reload()
                                            }, 3000)

                                            return;
                                        } else {
                                            btnSubmit.disabled = false
                                            submitError.removeAttribute("style")
                                            submitError.textContent = result.message
                                            return;
                                        }
                                    }).catch(error => {
                                        btnSubmit.disabled = false
                                        submitError.removeAttribute("style")
                                        submitError.textContent = error.message
                                        return;
                                    })
                            }
                        }
                    })
                    .catch(error => {
                        btnSubmit.disabled = false
                        submitError.textContent = error.message
                        return;
                    })
            }
        } else {
            btnSubmit.disabled = false
            submitError.textContent = "Please check your input before submitting the data."
            return;
        }
    }
}