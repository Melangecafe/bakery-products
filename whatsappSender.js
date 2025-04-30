import { validateForm, validateOrder } from './formValidator.js';

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
    if (!validateForm()) {
        showError("Ошибка: Пожалуйста, заполните форму корректно.");
        return;
    }

    // Валидация заказа
    if (!validateOrder(formData)) {
        return;
    }

    // Генерация данных заказа
    const orderData = generateOrderData(formData);

    // Разбиение данных на группы товаров
    const groupedOrderData = groupItemsByCategory(orderData);

    // Формирование текста для WhatsApp
    let whatsappMessage = `*Заказ для точки: ${formData.get('storeName')}*\n`;
    whatsappMessage += `Сотрудник: ${formData.get('lastName')}\n\n`;

    // Добавление групп товаров
    groupedOrderData.forEach(group => {
        whatsappMessage += `*${group.category}*\n`;
        group.items.forEach(item => {
            // Выделяем количество жирным шрифтом
            whatsappMessage += `- ${item.name}: *${item.quantity} шт.*\n`;
        });
        whatsappMessage += '\n';
    });

    // Кодирование сообщения для URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappLink = `https://wa.me/?text=${encodedMessage}`;

    // Открытие ссылки WhatsApp
    window.open(whatsappLink, '_blank');

    // Очистка данных после отправки
    clearFormData();
    localStorage.removeItem('formData'); // Удаляем данные из localStorage
    showSuccessMessage();
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

function showSuccessMessage() {
    alert("Данные успешно отправлены в WhatsApp!");
    clearError();
}

function groupItemsByCategory(orderData) {
    const groupedData = {};

    orderData.forEach(item => {
        const category = item.category; // Предполагается, что у каждого товара есть поле "category"
        if (!groupedData[category]) {
            groupedData[category] = [];
        }
        groupedData[category].push(item);
    });

    // Преобразование объекта в массив для удобства
    return Object.keys(groupedData).map(category => ({
        category: category,
        items: groupedData[category]
    }));
}
