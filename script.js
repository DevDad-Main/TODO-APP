// script.js
document.addEventListener("DOMContentLoaded", () => {
  const taskContainer = document.querySelector("#tasks");
  const taskInput = document.querySelector("#newtask input");
  const addBtn = document.querySelector("#push");
  const clearBtn = document.querySelector("#clearAll");

  // Load from localStorage
  loadTasks();

  addBtn.onclick = () => {
    const taskText = taskInput.value.trim();
    if (!taskText) return alert("Please Enter a Task.");

    addTask(taskText);
    taskInput.value = "";
    saveTasks();
  };

  clearBtn.onclick = () => {
    localStorage.removeItem("tasks");
    taskContainer.innerHTML = "";
    toggleTaskBoxVisibility();
  };

  function addTask(text, completed = false) {
    const task = document.createElement("div");
    task.classList.add("task");
    if (completed) task.classList.add("completed");

    const span = document.createElement("span");
    span.textContent = text;
    span.ondblclick = () => makeEditable(span);

    span.onclick = () => {
      task.classList.toggle("completed");
      saveTasks();
    };

    const del = document.createElement("button");
    del.innerHTML = "<i class='fa fa-trash'></i>";
    del.onclick = () => {
      task.remove();
      saveTasks();
      toggleTaskBoxVisibility();
    };

    task.appendChild(span);
    task.appendChild(del);
    taskContainer.appendChild(task);
    toggleTaskBoxVisibility();
  }

  function makeEditable(span) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = span.textContent;
    span.replaceWith(input);
    input.focus();

    input.onblur = input.onkeypress = (e) => {
      if (e.type === "blur" || e.key === "Enter") {
        span.textContent = input.value;
        input.replaceWith(span);
        saveTasks();
      }
    };
  }

  function saveTasks() {
    const tasks = [...document.querySelectorAll(".task")].map(t => ({
      text: t.querySelector("span").textContent,
      completed: t.classList.contains("completed")
    }));
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasks() {
    const saved = JSON.parse(localStorage.getItem("tasks")) || [];
    saved.forEach(t => addTask(t.text, t.completed));
  }

  function filterTasks(filter) {
  const tasks = document.querySelectorAll("#tasks .task");
  tasks.forEach(task => {
    const isCompleted = task.classList.contains("completed");

    if (
      filter === "all" ||
      (filter === "active" && !isCompleted) ||
      (filter === "completed" && isCompleted)
    ) {
      task.style.display = "flex"; // show the task
    } else {
      task.style.display = "none"; // hide the task
    }
  });
}


  function toggleTaskBoxVisibility() {
    taskContainer.style.display = taskContainer.children.length ? "block" : "none";
  }

  // Enable drag and drop
  new Sortable(taskContainer, {
    animation: 150,
    onEnd: saveTasks
  });

  // Make filterTasks globally accessible
  window.filterTasks = filterTasks;
});
