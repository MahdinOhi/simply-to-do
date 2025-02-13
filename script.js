let selectedTask = null;

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Initialize app
function init() {
    tasks.forEach(task => createTaskElement(task));
    document.getElementById('taskInput').focus();
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Create task element
function createTaskElement(task) {
    const li = document.createElement('li');
    if (task.done) li.classList.add('done');

    li.innerHTML = `
        <span>${task.text}</span>
        <button class="delete-btn"><i class="fas fa-trash"></i></button>
      `;

    li.querySelector('.delete-btn').addEventListener('click', () => {
        tasks = tasks.filter(t => t.id !== task.id);
        li.remove();
        saveTasks();
    });

    li.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') {
            selectTask(li, task);
        }
    });

    document.getElementById('taskList').appendChild(li);
    return li;
}

// Task selection handler
function selectTask(element, task) {
    if (selectedTask) {
        selectedTask.classList.remove('selected');
    }
    selectedTask = element;
    selectedTask.classList.add('selected');
}

// Add new task
function addTask(text) {
    const newTask = {
        id: Date.now(),
        text: text,
        done: false
    };

    tasks.push(newTask);
    createTaskElement(newTask);
    saveTasks();
}

// Event Listeners
document.getElementById('addTaskBtn').addEventListener('click', () => {
    const input = document.getElementById('taskInput');
    if (input.value.trim()) {
        addTask(input.value.trim());
        input.value = '';
    }
});

document.getElementById('taskInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
        addTask(e.target.value.trim());
        e.target.value = '';
    }
});

document.addEventListener('keydown', (e) => {
    if (!selectedTask) return;

    const taskId = parseInt(selectedTask.dataset.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (e.key === 'Delete') {
        tasks.splice(taskIndex, 1);
        selectedTask.remove();
        selectedTask = null;
        saveTasks();
    }

    if (e.key === 'Enter') {
        tasks[taskIndex].done = !tasks[taskIndex].done;
        selectedTask.classList.toggle('done');
        saveTasks();
    }
});

// Initialize the app
init();