import { validateForm, validateOrder } from './formValidator.js';
import { generateOrderData, clearFormData } from './orderExporter.js';

// Экспорт функции для отправки данных в WhatsApp
function shareTextViaWhatsApp() {
    console.log("Кнопка 'Поделиться в WhatsApp' нажата");

    const form = document.getElementById('orderForm');
    const formData = new FormData(form);

    if (!validateForm()) {
        showError("Ошибка: Пожалуйста, заполните форму корректно.");
        return;
    }

    const orderData = generateOrderData(formData);
    const whatsappMessage = encodeURIComponent(orderData);
    const whatsappLink = `https://wa.me/?text=${whatsappMessage}`;

    window.open(whatsappLink, '_blank');
    clearFormData();
    showSuccessMessage();
}

// Вывод ошибок
function showError(message) {
    const errorContainer = document.getElementById('orderError');
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
}

// Сброс ошибок
function clearError() {
    const errorContainer = document.getElementById('orderError');
    errorContainer.style.display = 'none';
}

// Вывод успешного сообщения
function showSuccessMessage() {
    alert("Данные успешно отправлены в WhatsApp!");
    clearError();
}

// Добавление обработчика события для кнопки
document.addEventListener('DOMContentLoaded', () => {
    const whatsappButton = document.querySelector('.green-button');

    if (whatsappButton) {
        whatsappButton.addEventListener('click', shareTextViaWhatsApp);
    }
});
