export let stores = {};

// Сохранение данных формы в localStorage
function saveFormData() {
    const storeName = document.getElementById('storeName').value;
    const lastName = document.getElementById('lastName').value;

    if (storeName || lastName) {
        const formData = { storeName, lastName };

        // Сохраняем выбранные товары
        const itemsContainer = document.getElementById('itemsContainer');
        const itemRows = Array.from(itemsContainer.querySelectorAll('.item-row'));
        const items = itemRows.map(row => ({
            name: row.querySelector('[name="itemName[]"]').value,
            quantity: parseInt(row.querySelector('[name="quantity[]"]').value, 10)
        }));

        formData.items = items.filter(item => item.quantity > 0); // Сохраняем только товары с количеством > 0
        localStorage.setItem('formData', JSON.stringify(formData));
    } else {
        localStorage.removeItem('formData');
    }
}

// Восстановление данных из localStorage
function loadFormData() {
    const storedData = JSON.parse(localStorage.getItem('formData'));
    if (storedData) {
        document.getElementById('storeName').value = storedData.storeName;
        document.getElementById('lastName').value = storedData.lastName;

        if (storedData.storeName) {
            renderItems(storedData.storeName); // Рендерим товары для сохраненной точки

            // Восстанавливаем количество товаров
            setTimeout(() => {
                const itemRows = Array.from(document.querySelectorAll('.item-row'));
                storedData.items.forEach(storedItem => {
                    const matchingRow = itemRows.find(row =>
                        row.querySelector('[name="itemName[]"]').value === storedItem.name
                    );
                    if (matchingRow) {
                        matchingRow.querySelector('[name="quantity[]"]').value = storedItem.quantity;
                    }
                });
            }, 100); // Задержка для корректного рендера
        }
    }
}

// Загрузка начальных данных
export async function loadInitialData() {
    try {
        const storesResponse = await fetch('stores.json');

        if (!storesResponse.ok) {
            throw new Error("Ошибка загрузки данных.");
        }

        stores = await storesResponse.json();

        console.log("Stores загружены:", stores);

        const storeSelect = document.getElementById('storeName');
        Object.keys(stores).forEach(store => {
            const option = document.createElement('option');
            option.value = store;
            option.textContent = store;
            storeSelect.appendChild(option);
        });

        loadFormData(); // Восстанавливаем данные из localStorage
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error.message);
        alert("Не удалось загрузить данные. Проверьте файл stores.json.");
    }
}

// Рендеринг категорий для выбранного магазина
export function renderItems(storeName) {
    const itemsContainer = document.getElementById('itemsContainer');

    while (itemsContainer.firstChild) {
        itemsContainer.firstChild.remove();
    }

    const storeCategories = stores[storeName] || [];

    storeCategories.forEach(category => {
        if (!Array.isArray(category.items)) return;

        const categoryDiv = document.createElement('details');
        categoryDiv.innerHTML = `
            <summary>${category.name}</summary>
            <div class="category-container">
                ${category.items.map(item => {
                    const minQuantityMatch = item.match(/минимум для точки (\d+)/);
                    const minQuantity = minQuantityMatch ? parseInt(minQuantityMatch[1], 10) : 0;

                    return `
                        <div class="item-row">
                            <span>${item}</span>
                            <input type="hidden" name="itemName[]" value="${item}">
                            <input type="number" placeholder="Количество" name="quantity[]" min="0" max="1000">
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        itemsContainer.appendChild(categoryDiv);
    });
}

// Обработчик изменения торговой точки
document.getElementById('storeName').addEventListener('change', function () {
    const selectedStore = this.value;

    if (selectedStore) {
        renderItems(selectedStore); // Рендерим товары для выбранной точки
        saveFormData(); // Сохраняем выбранные данные
    } else {
        document.getElementById('itemsContainer').innerHTML = ''; // Очищаем контейнер, если ничего не выбрано
        saveFormData(); // Очищаем данные в localStorage
    }
});

// Инициализация страницы
document.addEventListener('DOMContentLoaded', loadInitialData);
