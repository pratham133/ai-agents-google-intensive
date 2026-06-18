// PriorityFlow Application Code

// --- STATE MANAGEMENT ---
let state = {
    tasks: [],
    filters: {
        search: '',
        status: 'all', // all, active, completed
        category: 'all', // all, work, personal, shopping, health, other
        sort: 'created-desc' // created-desc, created-asc, due-date, priority
    },
    theme: 'dark' // dark, light
};

// SVG progress circle config
const CIRCUMFERENCE = 2 * Math.PI * 54; // r=54 -> 339.29

// Sample tasks to populate if localstorage is empty
const defaultTasks = [
    {
        id: '1',
        title: 'Welcome to PriorityFlow! 🚀',
        description: 'Try checking off this task to see the celebration burst effect.',
        priority: 'high',
        category: 'work',
        dueDate: new Date().toISOString().split('T')[0], // today
        completed: false,
        createdDate: Date.now() - 100000,
        subtasks: [
            { id: '1-1', text: 'Create your first custom task', completed: false },
            { id: '1-2', text: 'Filter by priority using filters', completed: true }
        ]
    },
    {
        id: '2',
        title: 'Explore categories & dark mode 🌗',
        description: 'Toggle light/dark mode at the top right, and click on categories in the sidebar to filter.',
        priority: 'medium',
        category: 'personal',
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
        completed: false,
        createdDate: Date.now() - 50000,
        subtasks: []
    },
    {
        id: '3',
        title: 'Clean the workspace',
        description: 'Organize files and back up project workspace.',
        priority: 'low',
        category: 'other',
        dueDate: '',
        completed: true,
        createdDate: Date.now() - 25000,
        subtasks: []
    }
];

// --- LOAD DATA ---
function init() {
    // Theme load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        state.theme = savedTheme;
    } else {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        state.theme = prefersDark ? 'dark' : 'light';
    }
    applyTheme();

    // Tasks load
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        try {
            state.tasks = JSON.parse(savedTasks);
        } catch (e) {
            console.error('Failed to parse saved tasks', e);
            state.tasks = defaultTasks;
        }
    } else {
        state.tasks = defaultTasks;
        saveTasks();
    }

    // Initialize Due Date input to default empty, but min value today
    const dateInput = document.getElementById('taskDueDate');
    if (dateInput) {
        dateInput.min = new Date().toISOString().split('T')[0];
    }

    setupEventListeners();
    render();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
}

// --- THEME ---
function applyTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    const btn = document.getElementById('themeToggleBtn');
    if (btn) {
        btn.innerHTML = state.theme === 'dark'
            ? `<svg class="sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
               </svg>`
            : `<svg class="moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
               </svg>`;
    }
}

function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', state.theme);
    applyTheme();
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
    // Theme toggle
    document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);

    // Search input
    document.getElementById('searchInput').addEventListener('input', (e) => {
        state.filters.search = e.target.value.trim().toLowerCase();
        render();
    });

    // Filters and Sort selectors
    document.getElementById('statusFilter').addEventListener('change', (e) => {
        state.filters.status = e.target.value;
        render();
    });

    document.getElementById('sortOption').addEventListener('change', (e) => {
        state.filters.sort = e.target.value;
        render();
    });

    // Add Task Form submission
    document.getElementById('todoForm').addEventListener('submit', (e) => {
        e.preventDefault();
        addTask();
    });

    // Edit Modal Buttons
    document.getElementById('closeModalBtn').addEventListener('click', closeEditModal);
    document.getElementById('cancelModalBtn').addEventListener('click', closeEditModal);
    document.getElementById('saveModalBtn').addEventListener('click', saveEditedTask);

    // Close modal on click outside content
    document.getElementById('editModalOverlay').addEventListener('click', (e) => {
        if (e.target.id === 'editModalOverlay') {
            closeEditModal();
        }
    });
}

// --- ADD TASK ---
function addTask() {
    const titleInput = document.getElementById('taskTitle');
    const descInput = document.getElementById('taskDesc');
    const prioritySelect = document.getElementById('taskPriority');
    const categorySelect = document.getElementById('taskCategory');
    const dateInput = document.getElementById('taskDueDate');

    if (!titleInput.value.trim()) return;

    const newTask = {
        id: Date.now().toString(),
        title: titleInput.value.trim(),
        description: descInput.value.trim(),
        priority: prioritySelect.value,
        category: categorySelect.value,
        dueDate: dateInput.value,
        completed: false,
        createdDate: Date.now(),
        subtasks: []
    };

    state.tasks.unshift(newTask);
    saveTasks();

    // Reset fields
    titleInput.value = '';
    descInput.value = '';
    prioritySelect.value = 'medium';
    categorySelect.value = 'other';
    dateInput.value = '';

    render();
}

// --- DELETE TASK ---
function deleteTask(id) {
    const card = document.querySelector(`.task-card[data-id="${id}"]`);
    if (card) {
        card.classList.add('removing');
        // Wait for removal animation before re-rendering
        setTimeout(() => {
            state.tasks = state.tasks.filter(t => t.id !== id);
            saveTasks();
            render();
        }, 300);
    } else {
        state.tasks = state.tasks.filter(t => t.id !== id);
        saveTasks();
        render();
    }
}

// --- TOGGLE TASK COMPLETION ---
function toggleTask(id, event) {
    const taskIndex = state.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return;

    const completed = !state.tasks[taskIndex].completed;
    state.tasks[taskIndex].completed = completed;

    // Check all subtasks if completed
    if (completed && state.tasks[taskIndex].subtasks) {
        state.tasks[taskIndex].subtasks.forEach(sub => sub.completed = true);
    }

    saveTasks();

    // Play confetti burst if just marked completed
    if (completed && event) {
        const rect = event.target.getBoundingClientRect();
        createCelebrationParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }

    // Re-render task visual classes smoothly without a full redraw if possible
    // but for stats updating and sort order, we re-render after a tiny delay
    const card = document.querySelector(`.task-card[data-id="${id}"]`);
    if (card) {
        if (completed) {
            card.classList.add('completed');
            // Auto check visual checkboxes for subtasks
            card.querySelectorAll('.subtask-checkbox').forEach(cb => cb.checked = true);
            card.querySelectorAll('.subtask-item').forEach(item => item.classList.add('completed'));
        } else {
            card.classList.remove('completed');
        }
    }

    // Re-render dashboard stats and list in 250ms for smooth visual flow
    setTimeout(render, 250);
}

// --- SUBTASKS ---
function addSubtask(taskId) {
    const input = document.getElementById(`subtask-input-${taskId}`);
    if (!input || !input.value.trim()) return;

    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    const newSubtask = {
        id: Date.now().toString(),
        text: input.value.trim(),
        completed: false
    };

    if (!task.subtasks) task.subtasks = [];
    task.subtasks.push(newSubtask);

    // If task was completed, and we add a pending subtask, task is no longer completed
    if (task.completed) {
        task.completed = false;
    }

    input.value = '';
    saveTasks();
    render();
}

function toggleSubtask(taskId, subtaskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task || !task.subtasks) return;

    const sub = task.subtasks.find(s => s.id === subtaskId);
    if (!sub) return;

    sub.completed = !sub.completed;

    // If all subtasks are completed, do we complete the parent task?
    // Let's not auto-complete the main task, but if a task is completed and a subtask is unchecked,
    // we uncheck the main task.
    if (!sub.completed && task.completed) {
        task.completed = false;
    }

    saveTasks();
    render();
}

function deleteSubtask(taskId, subtaskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task || !task.subtasks) return;

    task.subtasks = task.subtasks.filter(s => s.id !== subtaskId);
    saveTasks();
    render();
}

function toggleSubtasksCollapse(taskId) {
    const section = document.getElementById(`subtasks-sec-${taskId}`);
    if (section) {
        section.classList.toggle('collapsed');
        // Save collapse state if needed, or keep local in DOM
    }
}

// --- EDIT MODAL ---
function openEditModal(id) {
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;

    state.editingTaskId = id;

    document.getElementById('editTitle').value = task.title;
    document.getElementById('editDesc').value = task.description || '';
    document.getElementById('editPriority').value = task.priority;
    document.getElementById('editCategory').value = task.category;
    document.getElementById('editDueDate').value = task.dueDate || '';

    document.getElementById('editModalOverlay').classList.add('active');
}

function closeEditModal() {
    state.editingTaskId = null;
    document.getElementById('editModalOverlay').classList.remove('active');
}

function saveEditedTask() {
    if (!state.editingTaskId) return;

    const taskIndex = state.tasks.findIndex(t => t.id === state.editingTaskId);
    if (taskIndex === -1) return;

    const newTitle = document.getElementById('editTitle').value.trim();
    if (!newTitle) return;

    state.tasks[taskIndex].title = newTitle;
    state.tasks[taskIndex].description = document.getElementById('editDesc').value.trim();
    state.tasks[taskIndex].priority = document.getElementById('editPriority').value;
    state.tasks[taskIndex].category = document.getElementById('editCategory').value;
    state.tasks[taskIndex].dueDate = document.getElementById('editDueDate').value;

    saveTasks();
    closeEditModal();
    render();
}

// --- PARTICLE BURST CELEBRATION ---
function createCelebrationParticles(originX, originY) {
    const colors = ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#f59e0b', '#ef4444'];
    const particleCount = 28;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('confetti-particle');

        // Random particle styling
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.backgroundColor = color;

        const size = Math.floor(Math.random() * 8) + 6; // 6px - 14px
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        // Circular particles mostly, some squares
        if (Math.random() > 0.4) {
            particle.style.borderRadius = '50%';
        }

        // Position at click coordinate
        particle.style.left = `${originX}px`;
        particle.style.top = `${originY}px`;

        // Trajectory variables
        const angle = Math.random() * Math.PI * 2; // 0 to 360 deg
        const distance = Math.floor(Math.random() * 100) + 50; // 50px - 150px
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        const rotate = Math.floor(Math.random() * 720) - 360;

        particle.style.setProperty('--x', `${x}px`);
        particle.style.setProperty('--y', `${y}px`);
        particle.style.setProperty('--r', `${rotate}deg`);

        document.body.appendChild(particle);

        // Cleanup particle DOM
        particle.addEventListener('animationend', () => {
            particle.remove();
        });
    }
}

// --- CALCULATIONS & STATS ---
function updateStats() {
    const total = state.tasks.length;
    const completed = state.tasks.filter(t => t.completed).length;
    const pending = total - completed;

    // Overdue check
    const todayStr = new Date().toISOString().split('T')[0];
    const overdue = state.tasks.filter(t => {
        return !t.completed && t.dueDate && t.dueDate < todayStr;
    }).length;

    // Completion percentage
    const completionPercent = total === 0 ? 0 : Math.round((completed / total) * 100);

    // Update Text Elements
    document.getElementById('statTotal').innerText = total;
    document.getElementById('statCompleted').innerText = completed;
    document.getElementById('statPending').innerText = pending;
    const overdueEl = document.getElementById('statOverdue');
    overdueEl.innerText = overdue;
    if (overdue > 0) {
        overdueEl.style.color = '#ef4444';
    } else {
        overdueEl.style.color = 'var(--text-primary)';
    }

    // Progress bar ring circle update
    const circle = document.getElementById('progressCircle');
    if (circle) {
        circle.style.strokeDasharray = `${CIRCUMFERENCE} ${CIRCUMFERENCE}`;
        const offset = CIRCUMFERENCE - (completionPercent / 100) * CIRCUMFERENCE;
        circle.style.strokeDashoffset = offset;
    }
    document.getElementById('progressText').innerText = `${completionPercent}%`;

    // Render Category counts in sidebar filter list
    renderCategoryFilters();
}

function renderCategoryFilters() {
    const categories = ['all', 'work', 'personal', 'shopping', 'health', 'other'];
    const container = document.getElementById('categoryFiltersList');
    if (!container) return;

    // Compute counts
    const counts = {
        all: state.tasks.length,
        work: state.tasks.filter(t => t.category === 'work').length,
        personal: state.tasks.filter(t => t.category === 'personal').length,
        shopping: state.tasks.filter(t => t.category === 'shopping').length,
        health: state.tasks.filter(t => t.category === 'health').length,
        other: state.tasks.filter(t => t.category === 'other').length
    };

    container.innerHTML = categories.map(cat => {
        const label = cat.charAt(0).toUpperCase() + cat.slice(1);
        const isActive = state.filters.category === cat;
        const colorVar = `var(--cat-${cat})`;

        let dotHtml = '';
        if (cat !== 'all') {
            dotHtml = `<span class="cat-dot" style="background-color: ${colorVar}"></span>`;
        }

        return `
            <button class="cat-filter-btn ${isActive ? 'active' : ''}" onclick="selectCategoryFilter('${cat}')">
                <span class="cat-meta">
                    ${dotHtml}
                    <span>${label}</span>
                </span>
                <span class="cat-count">${counts[cat]}</span>
            </button>
        `;
    }).join('');
}

window.selectCategoryFilter = function(category) {
    state.filters.category = category;
    render();
};

// --- RENDER TASKS LIST ---
function render() {
    // 1. Calculate & Render Stats
    updateStats();

    const listContainer = document.getElementById('taskList');
    if (!listContainer) return;

    // 2. Filter Tasks
    let filteredTasks = [...state.tasks];

    // Category filter
    if (state.filters.category !== 'all') {
        filteredTasks = filteredTasks.filter(t => t.category === state.filters.category);
    }

    // Status filter
    if (state.filters.status === 'active') {
        filteredTasks = filteredTasks.filter(t => !t.completed);
    } else if (state.filters.status === 'completed') {
        filteredTasks = filteredTasks.filter(t => t.completed);
    }

    // Search filter
    if (state.filters.search) {
        filteredTasks = filteredTasks.filter(t =>
            t.title.toLowerCase().includes(state.filters.search) ||
            (t.description && t.description.toLowerCase().includes(state.filters.search))
        );
    }

    // 3. Sort Tasks
    const priorityWeight = { high: 3, medium: 2, low: 1 };

    filteredTasks.sort((a, b) => {
        if (state.filters.sort === 'created-desc') {
            return b.createdDate - a.createdDate;
        }
        if (state.filters.sort === 'created-asc') {
            return a.createdDate - b.createdDate;
        }
        if (state.filters.sort === 'due-date') {
            // Unspecified dates go last
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return a.dueDate.localeCompare(b.dueDate);
        }
        if (state.filters.sort === 'priority') {
            return priorityWeight[b.priority] - priorityWeight[a.priority];
        }
        return 0;
    });

    // 4. Render output HTML
    if (filteredTasks.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
                <h3>No tasks found</h3>
                <p>Try clearing your filters or create a new task above to get started.</p>
            </div>
        `;
        return;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    listContainer.innerHTML = filteredTasks.map(task => {
        // Class calculations
        const completedClass = task.completed ? 'completed' : '';
        const priorityClass = `priority-${task.priority}`;

        // Priority Badge
        const priorityLabels = { high: '🔴 High', medium: '🟡 Medium', low: '🟢 Low' };
        const priorityBadge = `<span class="badge badge-priority-${task.priority}">${priorityLabels[task.priority]}</span>`;

        // Category Badge
        const catLabel = task.category.charAt(0).toUpperCase() + task.category.slice(1);
        const catBadge = `
            <span class="badge badge-cat">
                <span class="badge-cat-dot" style="background-color: var(--cat-${task.category})"></span>
                ${catLabel}
            </span>
        `;

        // Due Date Badge
        let dateBadge = '';
        if (task.dueDate) {
            const isOverdue = !task.completed && task.dueDate < todayStr;
            const overdueClass = isOverdue ? 'overdue' : '';
            const calendarIcon = `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
            `;
            // Format date nicely
            let displayDate = task.dueDate;
            try {
                const parts = task.dueDate.split('-');
                const dt = new Date(parts[0], parts[1] - 1, parts[2]);
                displayDate = dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
            } catch (e) {}

            dateBadge = `
                <span class="badge badge-date ${overdueClass}">
                    ${calendarIcon}
                    ${isOverdue ? 'Overdue: ' : ''}${displayDate}
                </span>
            `;
        }

        // Subtasks HTML
        const subtasks = task.subtasks || [];
        const completedSubtasksCount = subtasks.filter(s => s.completed).length;
        const totalSubtasksCount = subtasks.length;
        const hasSubtasks = totalSubtasksCount > 0;

        let subtasksSectionHtml = '';

        if (hasSubtasks || !task.completed) {
            const subtaskItemsHtml = subtasks.map(sub => `
                <div class="subtask-item ${sub.completed ? 'completed' : ''}">
                    <label class="subtask-label">
                        <input type="checkbox" class="subtask-checkbox" ${sub.completed ? 'checked' : ''} onchange="toggleSubtask('${task.id}', '${sub.id}')">
                        <span>${escapeHtml(sub.text)}</span>
                    </label>
                    <button class="btn-delete-subtask" onclick="deleteSubtask('${task.id}', '${sub.id}')" aria-label="Delete subtask">&times;</button>
                </div>
            `).join('');

            subtasksSectionHtml = `
                <div class="subtasks-section" id="subtasks-sec-${task.id}">
                    <div class="subtasks-header" onclick="toggleSubtasksCollapse('${task.id}')">
                        <span class="subtasks-title">
                            Subtasks (${completedSubtasksCount}/${totalSubtasksCount})
                            <span class="subtasks-toggle-icon">▼</span>
                        </span>
                    </div>
                    <div class="subtasks-list">
                        ${subtaskItemsHtml}
                    </div>
                    ${!task.completed ? `
                    <div class="subtask-add-row">
                        <input type="text" id="subtask-input-${task.id}" placeholder="Add a subtask..." onkeydown="if(event.key === 'Enter') addSubtask('${task.id}')">
                        <button class="btn-add-subtask" onclick="addSubtask('${task.id}')">Add</button>
                    </div>
                    ` : ''}
                </div>
            `;
        }

        return `
            <div class="card task-card ${completedClass} ${priorityClass}" data-id="${task.id}">
                <div class="task-header">
                    <label class="checkbox-container">
                        <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask('${task.id}', event)">
                        <span class="checkmark"></span>
                    </label>

                    <div class="task-details">
                        <div class="task-title">${escapeHtml(task.title)}</div>
                        ${task.description ? `<div class="task-desc">${escapeHtml(task.description)}</div>` : ''}

                        <div class="task-badges" style="margin-top: 0.5rem;">
                            ${priorityBadge}
                            ${catBadge}
                            ${dateBadge}
                        </div>
                    </div>

                    <div class="task-actions">
                        <button class="btn-action" onclick="openEditModal('${task.id}')" aria-label="Edit task">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                            </svg>
                        </button>
                        <button class="btn-action btn-delete" onclick="deleteTask('${task.id}')" aria-label="Delete task">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                            </svg>
                        </button>
                    </div>
                </div>
                ${subtasksSectionHtml}
            </div>
        `;
    }).join('');
}

// Helper to escape HTML characters to prevent XSS
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// --- INITIALIZE APPLICATION ---
document.addEventListener('DOMContentLoaded', init);
