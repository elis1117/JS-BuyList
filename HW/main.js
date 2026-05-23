const inputField = document.querySelector('.add-item-section input');
const addButton = document.querySelector('.btn-add');
const leftColumn = document.querySelector('.left-column');

function addNewItem() {
    const itemName = inputField.value.trim();
    if (itemName === '') return; 

    const newItemHTML = `
        <div class="product-item">
            <span class="product-name">${itemName}</span>
            <div class="product-controls">
                <button class="btn-minus" data-tooltip="Зменшити кількість" disabled>-</button>
                <span class="amount">1</span>
                <button class="btn-plus" data-tooltip="Збільшити кількість">+</button>
                <button class="btn-status" data-tooltip="Відмітити як куплене">Не куплено</button>
                <button class="btn-delete" data-tooltip="Видалити товар">x</button>
            </div>
        </div>
    `;

    leftColumn.insertAdjacentHTML('beforeend', newItemHTML);
    inputField.value = '';
    inputField.focus();

    updateStatistics(); 
}

addButton.addEventListener('click', addNewItem);

inputField.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') 
        addNewItem();
});

leftColumn.addEventListener('click', function(event) {
    const productItem = event.target.closest('.product-item');
    if (!productItem) return;

    
    if (event.target.classList.contains('btn-delete')) {
        productItem.remove(); 
        updateStatistics(); 
    }

    
    if (event.target.classList.contains('btn-status')) {
        const statusButton = event.target;
        const productName = productItem.querySelector('.product-name');
        const btnPlus = productItem.querySelector('.btn-plus');
        const btnMinus = productItem.querySelector('.btn-minus');
        const btnDelete = productItem.querySelector('.btn-delete');

        if (statusButton.textContent === 'Не куплено') {
            statusButton.textContent = 'Куплено';
            statusButton.dataset.tooltip = 'Відмітити як не куплене';
            productName.style.textDecoration = 'line-through';
            btnPlus.style.display = 'none';
            btnMinus.style.display = 'none';
            btnDelete.style.display = 'none';
        } else {
            statusButton.textContent = 'Не куплено';
            statusButton.dataset.tooltip = 'Відмітити як куплене';
            productName.style.textDecoration = 'none';
            btnPlus.style.display = '';
            btnMinus.style.display = '';
            btnDelete.style.display = '';
        }
        updateStatistics(); 
    }

    
    if (event.target.classList.contains('btn-plus')) {
        const amountSpan = productItem.querySelector('.amount');
        const btnMinus = productItem.querySelector('.btn-minus');
        
        let currentAmount = parseInt(amountSpan.textContent);
        currentAmount += 1; 
        amountSpan.textContent = currentAmount; 
        
        if (currentAmount > 1) {
            btnMinus.disabled = false;
        }
        updateStatistics(); 
    }

    if (event.target.classList.contains('btn-minus')) {
        const amountSpan = productItem.querySelector('.amount');
        const btnMinus = event.target; 
        
        let currentAmount = parseInt(amountSpan.textContent);
        if (currentAmount > 1) {
            currentAmount -= 1;
            amountSpan.textContent = currentAmount;
        }
        if (currentAmount === 1) {
            btnMinus.disabled = true;
        }
        updateStatistics(); 
    }

    if (event.target.classList.contains('product-name')) {
        const nameSpan = event.target;
        const statusButton = productItem.querySelector('.btn-status');

        if (statusButton.textContent === 'Не куплено') {
            nameSpan.style.display = 'none';
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.value = nameSpan.textContent; 
            nameSpan.after(editInput);
            editInput.focus();

            editInput.addEventListener('blur', function() {
                const newName = editInput.value.trim();
                if (newName !== '') {
                    nameSpan.textContent = newName;
                }
                editInput.remove();
                nameSpan.style.display = '';

                updateStatistics(); 
            });

            editInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') editInput.blur();
            });
        }
    }
});

function updateStatistics() {
    const statsContainers = document.querySelectorAll('.right-column .stats-container');
    const leftToBuyContainer = statsContainers[0]; 
    const alreadyBoughtContainer = statsContainers[1]; 

    leftToBuyContainer.innerHTML = '';
    alreadyBoughtContainer.innerHTML = '';

    const allProducts = document.querySelectorAll('.left-column .product-item');

    allProducts.forEach(function(item) {
        const name = item.querySelector('.product-name').textContent;
        const amount = item.querySelector('.amount').textContent;
        const status = item.querySelector('.btn-status').textContent;

        if (status === 'Не куплено') {
            leftToBuyContainer.insertAdjacentHTML('beforeend', 
                `<span class="stat-badge">${name} <span class="stat-amount">${amount}</span></span>`
            );
        } else {
            alreadyBoughtContainer.insertAdjacentHTML('beforeend', 
                `<span class="stat-badge is-bought">${name} <span class="stat-amount">${amount}</span></span>`
            );
        }
    });
}

updateStatistics();