
const API = "https://jsonplaceholder.typicode.com/todos";

const form = document.getElementById('new-todo');
const input = form.querySelector('input[name="title"]');
const submitBtn = form.querySelector('button[type="submit"]');
const todosList = document.getElementById('todos');
const statusEl = document.getElementById('status');

function showStatus(message, isError = false) {
    statusEl.textContent = message;
    statusEl.style.color = isError ? 'red' : '#888';
}

async function getTodos() {
    try {
        showStatus('Завантаження нотаток...');
        const response = await fetch(`${API}?_limit=10`);
        
        if (!response.ok) throw new Error('Не вдалося завантажити список');
        
        const todos = await response.json();
        todosList.innerHTML = ''; 
        todos.forEach(todo => renderTodo(todo));
        showStatus(''); 

    } catch (error) {
        showStatus(error.message, true);
    }
}

async function createTodo(title) {
    try {
        submitBtn.disabled = true; 
        showStatus('Збереження...');

        const response = await fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                title: title, 
                completed: false, 
                userId: 1 
            })
        });

        if (!response.ok) throw new Error('Помилка при збереженні');
        
        const newTodo = await response.json();
        
        renderTodo(newTodo, true); 
        input.value = ''; 
        showStatus('');
    } catch (error) {
        showStatus(error.message, true);
    } finally {
        submitBtn.disabled = false;
    }
}

async function updateTodo(id, completed, liElement, checkbox) {
    try {
        checkbox.disabled = true; 
        showStatus('Оновлення...');

        const response = await fetch(`${API}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: completed }) 
        });

        if (!response.ok) throw new Error('Помилка при оновленні');

        if (completed) {
            liElement.classList.add('completed');
        } else {
            liElement.classList.remove('completed');
        }
        showStatus('');
        
    } catch (error) {
        showStatus(error.message, true);
        checkbox.checked = !completed; 
    } finally {
        checkbox.disabled = false;
    }
}

async function deleteTodo(id, liElement, deleteBtn) {
    try {
        deleteBtn.disabled = true; 
        showStatus('Видалення...');

        const response = await fetch(`${API}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Помилка при видаленні');

        liElement.remove(); 
        showStatus('');
    } catch (error) {
        showStatus(error.message, true);
        deleteBtn.disabled = false;
    }
}

function renderTodo(todo, prepend = false) {
    const li = document.createElement('li');
    if (todo.completed) li.classList.add('completed');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;

    checkbox.addEventListener('change', () => {
        updateTodo(todo.id, checkbox.checked, li, checkbox);
    });

    const titleSpan = document.createElement('span');
    titleSpan.className = 'title';
    titleSpan.textContent = todo.title;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete';
    deleteBtn.textContent = '×';
    deleteBtn.addEventListener('click', () => {
        deleteTodo(todo.id, li, deleteBtn);
    });

    li.append(checkbox, titleSpan, deleteBtn);

    if (prepend) {
        todosList.prepend(li);
    } else {
        todosList.append(li);
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault(); 
    const title = input.value.trim();
    if (title !== '') {
        createTodo(title);
    }
});

getTodos();