git add .
    git commit -m "move files to root"
git push
const createInputElem = document.querySelector("#todo-form input");
const createBtnElem = document.querySelector("#todo-form button");
const todoListElem = document.querySelector("#todo-list");
const searchElem = document.querySelector("#search");
const fiiltersElem = document.querySelectorAll(".filters button");
const themeToggle = document.querySelector("#theme-toggle");

let filter = "all";
let tasks = [];

const saveTasks = () => {
    const data = tasks.map(t => ({
        name: t.name,
        isFinished: t.isFinished,
    }));
    localStorage.setItem("tasks", JSON.stringify(data));
};

const loadTasks = () => {
    const data = JSON.parse(localStorage.getItem("tasks") || "[]");

    data.forEach(item => {
        const task = new Task(
            item.name,
            item.isFinished,
            renderTasks,
            name => {
                tasks = tasks.filter(t => t.name !== name);
                saveTasks();
            }
        );

        task.renderCard();

        if (item.isFinished) task.element.classList.add("completed");

        tasks.push(task);
    });

    renderTasks();
};

const saveTheme = () => {
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
};

const loadTheme = () => {
    const theme = localStorage.getItem("theme") || "dark";
    if (theme === "dark") document.body.classList.add("dark");
    else document.body.classList.remove("dark");
};

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    saveTheme();
});

class Task {
    constructor(name, isFinished, onMark, onRemove) {
        this.name = name;
        this.isFinished = isFinished;
        this.onMark = onMark;
        this.onRemove = onRemove;
    }

    renderCard() {
        this.element = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.checked = this.isFinished; // восстановление состояния
        this.element.append(checkbox);

        const name = document.createElement("span");
        name.innerText = this.name;
        this.element.append(name);

        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "x";
        this.element.append(deleteBtn);

        if (this.isFinished) {
            this.element.classList.add("completed");
        }

        checkbox.addEventListener("change", () => this.markTask());
        deleteBtn.addEventListener("click", () => {
            this.removeTask();
            this.onRemove(this.name);
            saveTasks();
        });

        return this.element;
    }

    markTask() {
        this.element.classList.toggle("completed");
        this.isFinished = !this.isFinished;

        if (this.isFinished) alert(`Задача (${this.name}) успешно выполнена!`);
        this.onMark();
        saveTasks(); // сохраняем после отметки
    }

    removeTask() {
        this.element.remove();
    }
}

const renderTasks = () => {
    todoListElem.innerHTML = "";
    let filteredTasks = [...tasks];

    filteredTasks = filteredTasks.filter(task =>
        task.name.toLowerCase().includes(searchElem.value.toLowerCase())
    );

    filteredTasks = filteredTasks.filter(task => {
        if (filter === "active") return !task.isFinished;
        if (filter === "completed") return task.isFinished;
        return true;
    });

    filteredTasks.forEach(task => todoListElem.append(task.element));
};


const createTask = () => {
    const task = new Task(
        createInputElem.value,
        false,
        renderTasks,
        name => {
            tasks = tasks.filter(task => task.name !== name);
            saveTasks();
        }
    );

    task.renderCard();
    tasks.push(task);
    saveTasks(); // сохраняем
    renderTasks();
};

createBtnElem.addEventListener("click", e => {
    e.preventDefault();
    createTask();
});

searchElem.addEventListener("input", () => renderTasks());

fiiltersElem.forEach(btn =>
    btn.addEventListener("click", ({ target }) => {
        filter = target.dataset.filter;
        fiiltersElem.forEach(btn => {
            btn.classList.toggle("active", btn.dataset.filter === filter);
        });
        renderTasks();
    })
);


loadTheme();
loadTasks();
