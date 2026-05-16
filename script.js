// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const itemsLeft = document.getElementById('items-left');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all';

    // Save todos to localStorage
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    // Render todos based on current filter
    function renderTodos() {
        todoList.innerHTML = '';

        let filteredTodos = todos;
        if (currentFilter === 'active') {
            filteredTodos = todos.filter(todo => !todo.completed);
        } else if (currentFilter === 'completed') {
            filteredTodos = todos.filter(todo => todo.completed);
        }

        if (filteredTodos.length === 0) {
            const emptyMsg = document.createElement('li');
            emptyMsg.textContent = currentFilter === 'all' ? 'No tasks yet. Add one above!' :
                                   currentFilter === 'active' ? 'No active tasks.' :
                                   'No completed tasks.';
            emptyMsg.style.cssText = 'text-align: center; color: #999; padding: 20px 0; list-style: none;';
            todoList.appendChild(emptyMsg);
        } else {
            filteredTodos.forEach(todo => {
                const li = document.createElement('li');
                li.className = 'todo-item';
                li.dataset.id = todo.id;

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = todo.completed;
                checkbox.addEventListener('change', () => toggleTodo(todo.id));

                const textSpan = document.createElement('span');
                textSpan.className = 'todo-text' + (todo.completed ? ' completed' : '');
                textSpan.textContent = todo.text;

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.textContent = '✕';
                deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

                li.appendChild(checkbox);
                li.appendChild(textSpan);
                li.appendChild(deleteBtn);
                todoList.appendChild(li);
            });
        }

        updateItemsLeft();
        updateFilterButtons();
    }

    // Add a new todo
    function addTodo() {
        const text = todoInput.value.trim();
        if (text === '') {
            alert('Please enter a task!');
            return;
        }

        const newTodo = {
            id: Date.now().toString(),
            text: text,
            completed: false
        };

        todos.push(newTodo);
        saveTodos();
        renderTodos();
        todoInput.value = '';
        todoInput.focus();
    }

    // Toggle todo completion
    function toggleTodo(id) {
        todos = todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        saveTodos();
        renderTodos();
    }

    // Delete a todo
    function deleteTodo(id) {
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();
        renderTodos();
    }

    // Clear completed todos
    function clearCompleted() {
        todos = todos.filter(todo => !todo.completed);
        saveTodos();
        renderTodos();
    }

    // Update items left count
    function updateItemsLeft() {
        const activeCount = todos.filter(todo => !todo.completed).length;
        itemsLeft.textContent = activeCount + ' item' + (activeCount !== 1 ? 's' : '') + ' left';
    }

    // Update active filter button
    function updateFilterButtons() {
        filterBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === currentFilter) {
                btn.classList.add('active');
            }
        });
    }

    // Set filter
    function setFilter(filter) {
        currentFilter = filter;
        renderTodos();
    }

    // --- Event Listeners ---

    addBtn.addEventListener('click', addTodo);

    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    clearCompletedBtn.addEventListener('click', clearCompleted);

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setFilter(btn.dataset.filter);
        });
    });

    // Initial render
    renderTodos();
});