import { validateForm, validateOrder } from './formValidator.js';
import { generateOrderData, clearFormData } from './orderExporter.js';

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

    if (!validateForm() || !validateOrder(formData)) {
        showError("Ошибка: Пожалуйста, заполните форму корректно.");
        return;
    }

    const orderData = generateOrderData(formData);
    const whatsappMessage = encodeURIComponent(orderData);
    const whatsappLink = `https://wa.me/?text=${whatsappMessage}`;

    window.open(whatsappLink, '_blank');

    // Очищаем данные только после отправки
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
