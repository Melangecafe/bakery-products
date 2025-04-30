export function validateForm(formData) {
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
    const quantities = formData.getAll('quantity[]');
    const itemNames = formData.getAll('itemName[]');

    for (let i = 0; i < quantities.length; i++) {
        const itemName = itemNames[i];
        const quantity = parseInt(quantities[i], 10);

        // Если количество равно 0 или пустое, пропускаем проверку
        if (isNaN(quantity) || quantity === 0) {
            continue;
        }

        // Извлекаем минимальное количество из описания товара
        const minQuantityMatch = itemName.match(/минимум для точки (\d+)/);
        const minQuantity = minQuantityMatch ? parseInt(minQuantityMatch[1], 10) : 0;

        if (quantity < minQuantity) {
            alert(`Ошибка: Для товара "${itemName}" минимальное количество — ${minQuantity} шт.`);
            return false;
        }
    }

    return true;
}
