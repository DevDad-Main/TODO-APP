document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.querySelector("#newtask input");
  const addBtn = document.querySelector("#push");
  const tasksContainer = document.querySelector("#tasks");

  // Load tasks from localStorage on page load
  loadTasks();

  addBtn.onclick = () => {
    const taskText = taskInput.value.trim();
    if (!taskText) {
      alert("Please enter a task.");
      return;
    }

    const task = {
      text: taskText,
      completed: false,
    };

    addTaskToDOM(task);
    saveTask(task);
    taskInput.value = "";
    toggleTaskBoxVisibility();
  };

  function addTaskToDOM(task) {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task";
    if (task.completed) taskDiv.classList.add("completed");

    const span = document.createElement("span");
    span.className = "taskname";
    span.textContent = task.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete";
    deleteBtn.innerHTML = "🗑️";

    // Toggle completion
    span.onclick = () => {
      taskDiv.classList.toggle("completed");
      updateLocalStorage();
    };

    // Delete task
    deleteBtn.onclick = () => {
      taskDiv.remove();
      updateLocalStorage();
      toggleTaskBoxVisibility();
    };

    taskDiv.appendChild(span);
    taskDiv.appendChild(deleteBtn);
    tasksContainer.appendChild(taskDiv);
  }

  function toggleTaskBoxVisibility() {
    const hasTasks = tasksContainer.querySelectorAll(".task").length > 0;
    tasksContainer.style.display = hasTasks ? "block" : "none";
  }

  function saveTask(task) {
    const tasks = getTasksFromStorage();
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function updateLocalStorage() {
    const tasks = [];
    document.querySelectorAll(".task").forEach((taskEl) => {
      tasks.push({
        text: taskEl.querySelector(".taskname").textContent,
        completed: taskEl.classList.contains("completed"),
      });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function getTasksFromStorage() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  }

  function loadTasks() {
    const tasks = getTasksFromStorage();
    tasks.forEach(addTaskToDOM);
    toggleTaskBoxVisibility();
  }
});
