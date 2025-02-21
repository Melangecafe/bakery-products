export function validateForm() {
    const storeNameSelect = document.getElementById('storeName');
    const lastNameInput = document.getElementById('lastName');

    let isValid = true;

    if (storeNameSelect.value === "") {
        document.getElementById('storeNameError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('storeNameError').style.display = 'none';
    }

    if (lastNameInput.value.trim() === "") {
        document.getElementById('lastNameError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('lastNameError').style.display = 'none';
    }

    return isValid;
}

export function validateOrder(formData) {
    const itemNames = formData.getAll('itemName[]');
    const quantities = formData.getAll('quantity[]');

    // Проверяем, что количество товаров соответствует формату (число)
    for (let i = 0; i < quantities.length; i++) {
        const quantity = parseInt(quantities[i], 10);
        if (isNaN(quantity)) {
            showError(`Ошибка: Для товара "${itemNames[i]}" указано некорректное количество.`);
            return false;
        }
    }

    // Если все проверки пройдены, возвращаем true
    return true;
}

function showError(message) {
    const errorContainer = document.getElementById('orderError');
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
}

function clearError() {
    const errorContainer = document.getElementById('orderError');
    errorContainer.style.display = 'none';
}
