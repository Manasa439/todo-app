const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filters button");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

addBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task");
        return;
    }

    tasks.push({
        id: Date.now(),
        text: taskText,
        completed: false
    });

    taskInput.value = "";
    saveTasks();
    renderTasks();
});

function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(t => t.completed);
    } else if (currentFilter === "pending") {
        filteredTasks = tasks.filter(t => !t.completed);
    }

    if (filteredTasks.length === 0) {
        const empty = document.createElement("li");
        empty.textContent = "No tasks to show 👀";
        empty.style.textAlign = "center";
        empty.style.color = "gray";
        taskList.appendChild(empty);
        return;
    }

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "task";
        if (task.completed) li.classList.add("completed");

        const span = document.createElement("span");
        span.textContent = task.text;

        const completeBtn = document.createElement("button");
        completeBtn.textContent = "✔";
        completeBtn.className = "complete";
        completeBtn.onclick = () => {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        };

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.className = "delete";
        deleteBtn.onclick = () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
        };

        li.appendChild(span);
        li.appendChild(completeBtn);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        currentFilter = button.dataset.filter;
        renderTasks();
    });
});

renderTasks();