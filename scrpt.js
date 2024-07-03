document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskDateTime = document.getElementById('task-date-time');
    const taskPriority = document.getElementById('task-priority');
    const taskCategory = document.getElementById('task-category');
    const taskList = document.getElementById('task-list');
    const searchInput = document.getElementById('search-input');
    const sortTasks = document.getElementById('sort-tasks');
  
    loadTasks();
  
    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();
        addTask(taskInput.value, taskDateTime.value, taskPriority.value, taskCategory.value);
        taskInput.value = '';
        taskDateTime.value = '';
        taskPriority.value = 'low';
        taskCategory.value = '';
    });
  
    searchInput.addEventListener('input', filterTasks);
    sortTasks.addEventListener('change', sortAndRenderTasks);
  
    function addTask(taskText, taskDateTime, taskPriority, taskCategory) {
        const taskItem = createTaskElement(taskText, taskDateTime, taskPriority, taskCategory);
        taskList.appendChild(taskItem);
        saveTaskToLocalStorage(taskText, taskDateTime, taskPriority, taskCategory);
    }
  
    function createTaskElement(taskText, taskDateTime, taskPriority, taskCategory) {
        const taskItem = document.createElement('li');
        const taskDetails = document.createElement('div');
        taskDetails.classList.add('task-details');
  
        const taskTextSpan = document.createElement('span');
        taskTextSpan.textContent = taskText;
        taskDetails.appendChild(taskTextSpan);
  
        const taskDateTimeSpan = document.createElement('span');
        taskDateTimeSpan.textContent = ` - ${new Date(taskDateTime).toLocaleString()}`;
        taskDetails.appendChild(taskDateTimeSpan);
  
        const taskCategorySpan = document.createElement('span');
        taskCategorySpan.classList.add('task-category');
        taskCategorySpan.textContent = `Category: ${taskCategory}, Priority: ${taskPriority}`;
        taskDetails.appendChild(taskCategorySpan);
  
        taskItem.appendChild(taskDetails);
  
        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete';
        completeButton.classList.add('complete');
        completeButton.addEventListener('click', () => {
            taskItem.classList.toggle('completed');
            saveTasksToLocalStorage();
        });
        taskItem.appendChild(completeButton);
  
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit');
        editButton.addEventListener('click', () => {
            taskInput.value = taskText;
            taskDateTime.value = taskDateTime;
            taskPriority.value = taskPriority;
            taskCategory.value = taskCategory;
            taskItem.remove();
            saveTasksToLocalStorage();
        });
        taskItem.appendChild(editButton);
  
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete');
        deleteButton.addEventListener('click', () => {
            taskItem.remove();
            saveTasksToLocalStorage();
        });
        taskItem.appendChild(deleteButton);
  
        // Highlight overdue tasks
        const now = new Date();
        const taskDueDate = new Date(taskDateTime);
        if (taskDueDate < now) {
            taskItem.classList.add('overdue');
        }
  
        return taskItem;
    }
  
    function saveTaskToLocalStorage(taskText, taskDateTime, taskPriority, taskCategory) {
        const tasks = getTasksFromLocalStorage();
        tasks.push({ taskText, taskDateTime, taskPriority, taskCategory });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  
    function getTasksFromLocalStorage() {
        const tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    }
  
    function saveTasksToLocalStorage() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(taskItem => {
            const taskDetails = taskItem.querySelector('.task-details');
            const taskText = taskDetails.querySelector('span:first-child').textContent;
            const taskDateTime = taskDetails.querySelector('span:nth-child(2)').textContent.slice(3); // Remove ' - ' prefix
            const taskCategory = taskDetails.querySelector('.task-category').textContent.split(', ')[0].split(': ')[1];
            const taskPriority = taskDetails.querySelector('.task-category').textContent.split(', ')[1].split(': ')[1];
            tasks.push({ taskText, taskDateTime, taskPriority, taskCategory });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  
    function loadTasks() {
        const tasks = getTasksFromLocalStorage();
        tasks.forEach(task => {
            const taskItem = createTaskElement(task.taskText, task.taskDateTime, task.taskPriority, task.taskCategory);
            taskList.appendChild(taskItem);
        });
    }
  
    function filterTasks() {
        const filterText = searchInput.value.toLowerCase();
        taskList.querySelectorAll('li').forEach(taskItem => {
            const taskText = taskItem.querySelector('.task-details span:first-child').textContent.toLowerCase();
            taskItem.style.display = taskText.includes(filterText) ? '' : 'none';
        });
    }
  
    function sortAndRenderTasks() {
        const tasks = getTasksFromLocalStorage();
        const sortBy = sortTasks.value;
  
        tasks.sort((a, b) => {
            if (sortBy === 'date') {
                return new Date(a.taskDateTime) - new Date(b.taskDateTime);
            } else if (sortBy === 'priority') {
                const priorityOrder = { low: 1, medium: 2, high: 3 };
                return priorityOrder[a.taskPriority] - priorityOrder[b.taskPriority];
            } else if (sortBy === 'category') {
                return a.taskCategory.localeCompare(b.taskCategory);
            }
        });
  
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const taskItem = createTaskElement(task.taskText, task.taskDateTime, task.taskPriority, task.taskCategory);
            taskList.appendChild(taskItem);
        });
    }
  });