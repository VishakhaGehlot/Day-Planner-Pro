
// Global variables
let tasks = [];
let taskIdCounter = 0;
let schedule = {};

// Initialize the application
function init() {
    displayCurrentDate();
    generateTimeSlots();
    loadData();
    updateStats();
}

// Display current date
function displayCurrentDate() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', options);
}

// Generate time slots for the schedule
function generateTimeSlots() {
    const scheduleContainer = document.getElementById('schedule');
    const timeSlots = [];

    // Generate time slots from 6 AM to 11 PM
    for (let hour = 6; hour <= 23; hour++) {
        const time12 = hour > 12 ? `${hour - 12}:00 PM` :
            hour === 12 ? `${hour}:00 PM` :
                `${hour}:00 AM`;
        const time24 = `${hour.toString().padStart(2, '0')}:00`;
        timeSlots.push({ time24, time12 });
    }

    scheduleContainer.innerHTML = timeSlots.map(slot => `
                <div class="time-slot">
                    <div class="time-label">${slot.time12}</div>
                    <input type="text" 
                           class="time-input" 
                           placeholder="What's planned for this time?"
                           data-time="${slot.time24}"
                           onchange="updateSchedule('${slot.time24}', this.value)"
                           onblur="saveSchedule()">
                    <button class="btn btn-danger btn-small" onclick="clearTimeSlot('${slot.time24}')">Clear</button>
                </div>
            `).join('');
}

// Add a new task
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    const task = {
        id: taskIdCounter++,
        text: taskText,
        completed: false,
        priority: prioritySelect.value,
        createdAt: new Date().toISOString()
    };

    tasks.push(task);
    taskInput.value = '';
    renderTasks();
    updateStats();
    saveData();
}

// Render all tasks
function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = tasks.map(task => `
                <div class="task-item ${task.completed ? 'completed' : ''} ${task.priority}-priority">
                    <input type="checkbox" 
                           class="checkbox" 
                           ${task.completed ? 'checked' : ''} 
                           onchange="toggleTask(${task.id})">
                    <div class="task-text">${task.text}</div>
                    <div class="task-actions">
                        <button class="btn btn-danger btn-small" onclick="deleteTask(${task.id})">Delete</button>
                    </div>
                </div>
            `).join('');
}

// Toggle task completion
function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
        updateStats();
        saveData();
    }
}

// Delete a task
function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== taskId);
        renderTasks();
        updateStats();
        saveData();
    }
}

// Update task statistics
function updateStats() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
    document.getElementById('progressFill').style.width = `${completionRate}%`;
}

// Update schedule for a specific time slot
function updateSchedule(time, value) {
    schedule[time] = value;
    const input = document.querySelector(`input[data-time="${time}"]`);
    if (value.trim()) {
        input.classList.add('filled');
    } else {
        input.classList.remove('filled');
        delete schedule[time];
    }
}

// Clear a time slot
function clearTimeSlot(time) {
    const input = document.querySelector(`input[data-time="${time}"]`);
    input.value = '';
    input.classList.remove('filled');
    delete schedule[time];
    saveSchedule();
}

// Save data to memory (in a real app, this would be localStorage or a database)
function saveData() {
    // In a real application, you would save to localStorage or send to a server
    console.log('Saving tasks:', tasks);
}

function saveSchedule() {
    // In a real application, you would save to localStorage or send to a server
    console.log('Saving schedule:', schedule);
}

// Load data from memory (in a real app, this would be from localStorage or a database)
function loadData() {
    // In a real application, you would load from localStorage or fetch from a server
    // For demo purposes, we'll start with empty data
    renderTasks();
}

// Handle Enter key press in task input
document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    taskInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});

// Initialize the application when the page loads
window.onload = init;
