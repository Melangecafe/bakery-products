export let stores = {};
export let categories = {};

// Загрузка начальных данных
export async function loadInitialData() {
    try {
        const [storesResponse] = await Promise.all([
            fetch('stores.json')
        ]);

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
                            <input type="number" placeholder="Количество" name="quantity[]" min="${minQuantity}" max="1000">
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
    } else {
        document.getElementById('itemsContainer').innerHTML = ''; // Очищаем контейнер, если ничего не выбрано
    }
});

// Инициализация страницы
document.addEventListener('DOMContentLoaded', loadInitialData);
