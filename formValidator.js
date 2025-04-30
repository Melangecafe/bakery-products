export function validateForm() {
    const storeNameSelect = document.getElementById('storeName');
    const lastNameInput = document.getElementById('lastName');

    let isValid = true;

    // Проверка выбора торговой точки
    if (storeNameSelect.value === "") {
        document.getElementById('storeNameError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('storeNameError').style.display = 'none';
    }

    // Проверка ввода фамилии сотрудника
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

    for (let i = 0; i < itemNames.length; i++) {
        const itemName = itemNames[i];
        const quantity = parseInt(quantities[i], 10);

        // Проверяем, что количество — число и больше 0
        if (isNaN(quantity) || quantity <= 0) {
            showError(`Ошибка: Количество для товара "${itemName}" должно быть больше 0.`);
            return false;
        }

        // Запрещаем отрицательные значения
        if (quantity < 0) {
            showError(`Ошибка: Количество для товара "${itemName}" не может быть отрицательным.`);
            return false;
        }
    }

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
