import { validateForm } from './formValidator.js';

document.addEventListener('DOMContentLoaded', () => {
    const whatsappButton = document.querySelector('.green-button');

    if (whatsappButton) {
        whatsappButton.addEventListener('click', shareTextViaWhatsApp);
    }
});

function shareTextViaWhatsApp() {
    console.log("Кнопка 'Поделиться в WhatsApp' нажата");

    const form = document.getElementById('orderForm');
    const formData = new FormData(form);

    // Валидация формы
    if (!validateForm(formData)) {
        showError("Ошибка: Пожалуйста, заполните форму корректно.");
        return;
    }

    // Генерация данных заказа
    const orderData = generateOrderData(formData);

    // Формирование текста для WhatsApp
    let whatsappMessage = `*Заказ для точки: ${formData.get('storeName')}*\n`;
    whatsappMessage += `Сотрудник: ${formData.get('lastName')}\n\n`;

    // Разбиение данных на группы (бывшие категории)
    const groupedOrderData = groupItemsByCategory(orderData);

    groupedOrderData.forEach(group => {
        // Добавляем название категории
        whatsappMessage += `*${group.category}*\n`;

        group.items.forEach(item => {
            // Добавляем товар с количеством
            whatsappMessage += `- ${item.name}: *${item.quantity} порц.*\n`;
        });
        whatsappMessage += '\n'; // Пустая строка между группами
    });

    // Удаляем последнюю пустую строку
    whatsappMessage = whatsappMessage.trim();

    // Кодирование сообщения для URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappLink = `https://wa.me/?text=${encodedMessage}`;

    // Открытие ссылки WhatsApp
    window.open(whatsappLink, '_blank');

    clearFormData();
    showSuccessMessage();
}

function showError(message) {
    const errorContainer = document.getElementById('orderError');
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
}

function showSuccessMessage() {
    alert("Данные успешно отправлены в WhatsApp!");
    clearError();
}

function generateOrderData(formData) {
    const itemNames = formData.getAll('itemName[]');
    const quantities = formData.getAll('quantity[]');
    const categories = formData.getAll('category[]');

    const orderData = [];

    for (let i = 0; i < itemNames.length; i++) {
        const category = categories[i];
        const itemName = itemNames[i];
        const quantity = parseInt(quantities[i], 10);

        // Проверяем минимальное количество для точки
        const minQuantity = getMinimumQuantityForItem(itemName); // Функция для получения минимума
        if (quantity < minQuantity) {
            showError(`Ошибка: Для товара "${itemName}" минимальное количество - ${minQuantity} шт.`);
            return [];
        }

        if (quantity > 0) {
            orderData.push({ category, name: itemName, quantity });
        }
    }

    return orderData;
}

function groupItemsByCategory(orderData) {
    const groupedData = {};

    orderData.forEach(item => {
        const category = item.category;
        if (!groupedData[category]) {
            groupedData[category] = [];
        }
        groupedData[category].push(item);
    });

    return Object.keys(groupedData).map(category => ({
        category, // Добавляем имя категории
        items: groupedData[category]
    }));
}

function getMinimumQuantityForItem(itemName) {
    // Здесь можно загрузить JSON-данные и найти минимальное значение для товара
    const jsonData = {
        "Приморграждан проэкт": [
            {"name": "Киш", "items": ["Киш с лососем и шпинатом 140г, порц минимум для точки 4шт"]},
            {"name": "Маффин", "items": ["Маффин с вишней и мягким сыром 70г минимум для точки 1шт"]},
            {"name": "Сэндвич", "items": ["Сэндвич с беконом и омлетом целый 270г минимум для точки 1шт"]},
            {"name": "Блинчики", "items": ["Блинчики с курицей и грибами в сливочном соусе 2шт 210г минимум для точки от 1 до 4шт"]}
        ]
    };

    const location = formData.get('storeName'); // Замените на актуальную локацию
    const categories = jsonData[location];

    for (const category of categories) {
        for (const item of category.items) {
            if (item.includes(itemName)) {
                const match = item.match(/минимум для точки (\d+)/);
                return match ? parseInt(match[1], 10) : 1; // Возвращаем минимальное значение или 1
            }
        }
    }

    return 1; // По умолчанию
}

function clearFormData() {
    document.getElementById('storeName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('itemsContainer').innerHTML = '';
}
