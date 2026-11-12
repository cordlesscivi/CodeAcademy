
const PROJECTS = [
    {
        id: "task-manager",
        icon: "✅",
        title: "Task Manager",
        level: "Начальный",
        language: "JavaScript",
        description: "Приложение для управления задачами.",
        tasks: [
            "Добавить создание новых задач.",
            "Реализовать удаление задач.",
            "Добавить отметку о выполнении.",
            "Сделать фильтрацию задач."
        ]
    },
    {
        id: "finance-tracker",
        icon: "💰",
        title: "Finance Tracker",
        level: "Средний",
        language: "JavaScript",
        description: "Приложение для учёта личных финансов.",
        tasks: [
            "Добавить создание доходов.",
            "Добавить создание расходов.",
            "Рассчитывать общий баланс.",
            "Показывать историю операций."
        ]
    },
    {
        id: "online-store",
        icon: "🛍️",
        title: "Online Store",
        level: "Средний",
        language: "JavaScript",
        description: "Учебный интернет-магазин.",
        tasks: [
            "Создать каталог товаров.",
            "Добавить поиск товаров.",
            "Реализовать корзину.",
            "Рассчитать общую стоимость заказа."
        ]
    },
    {
        id: "chat-app",
        icon: "💬",
        title: "Chat Application",
        level: "Продвинутый",
        language: "JavaScript",
        description: "Интерфейс приложения для общения.",
        tasks: [
            "Создать список сообщений.",
            "Добавить отправку сообщений.",
            "Отображать время сообщений.",
            "Сохранить историю переписки."
        ]
    },
    {
        id: "library-system",
        icon: "📚",
        title: "Library System",
        level: "Средний",
        language: "Python",
        description: "Система управления библиотекой.",
        tasks: [
            "Создать каталог книг.",
            "Добавить поиск по названию.",
            "Реализовать выдачу книг.",
            "Добавить возврат книг."
        ]
    },
    {
        id: "portfolio",
        icon: "🌍",
        title: "Personal Portfolio",
        level: "Начальный",
        language: "HTML / CSS",
        description: "Персональный сайт разработчика.",
        tasks: [
            "Создать главную страницу.",
            "Добавить информацию о себе.",
            "Разместить проекты.",
            "Добавить контакты и адаптивную версию."
        ]
    }
];

export function createProjectSystem({
                                        getState,
                                        saveState,
                                        refresh,
                                        showToast
                                    }) {
    const page = document.getElementById("page-projects");

    function render() {
        if (!page) return;

        const state = getState();
        const completed = Array.isArray(state.completedProjects)
            ? state.completedProjects
            : [];

        page.innerHTML = `
            <div class="page-heading">
                <span class="eyebrow">ПРИМЕНЯЙ ЗНАНИЯ</span>
                <h1>Практические проекты</h1>
                <p>Закрепляй навыки на небольших проектах.</p>
            </div>

            <div class="projects-summary">
                <div>
                    <strong>${completed.length}</strong>
                    <span>из ${PROJECTS.length} проектов завершено</span>
                </div>
                <div class="projects-summary-progress">
                    <div style="width:${completed.length / PROJECTS.length * 100}%"></div>
                </div>
            </div>

            <div class="projects-grid">
                ${PROJECTS.map(project => {
            const done = completed.includes(project.id);

            return `
                        <article class="project-card ${done ? "completed" : ""}">
                            <div class="project-card-top">
                                <span class="project-icon">${project.icon}</span>
                                <span class="project-level">${project.level}</span>
                            </div>

                            <h3>${project.title}</h3>
                            <p>${project.description}</p>

                            <div class="project-meta">
                                <span>💻 ${project.language}</span>
                                <span>${done ? "✓ Выполнен" : "⭐ Награда: 50 XP"}</span>
                            </div>

                            <button class="btn-primary full-width"
                                data-project-id="${project.id}">
                                ${done ? "Посмотреть проект" : "Открыть задание"}
                            </button>
                        </article>
                    `;
        }).join("")}
            </div>
        `;

        page.querySelectorAll("[data-project-id]").forEach(button => {
            button.addEventListener("click", () => {
                const project = PROJECTS.find(
                    item => item.id === button.dataset.projectId
                );

                if (project) openProject(project);
            });
        });
    }

    function openProject(project) {
        const state = getState();
        const completed = (state.completedProjects || [])
            .includes(project.id);

        const overlay = document.createElement("div");
        overlay.className = "project-modal";

        overlay.innerHTML = `
            <div class="project-modal-content">
                <button class="project-modal-close" aria-label="Закрыть">×</button>

                <span class="project-modal-icon">${project.icon}</span>
                <h2>${project.title}</h2>
                <p>${project.description}</p>

                <div class="project-requirements">
                    <h3>Что необходимо сделать:</h3>
                    ${project.tasks.map((task, index) => `
                        <div class="project-requirement">
                            <span>${index + 1}.</span>
                            <span>${task}</span>
                        </div>
                    `).join("")}
                </div>

                <div class="project-modal-info">
                    <span>Уровень: ${project.level}</span>
                    <span>Язык: ${project.language}</span>
                    <span>Награда: 50 XP</span>
                </div>

                ${
            completed
                ? '<div class="project-completed-message">✓ Проект отмечен как выполненный</div>'
                : `<button class="btn-primary full-width" data-complete-project>
                            Отметить как выполненный
                        </button>`
        }

                <p class="project-note">
                    Отметка сохраняет прогресс обучения. Она не заменяет
                    автоматическую проверку исходного кода.
                </p>
            </div>
        `;

        document.body.appendChild(overlay);

        const close = () => overlay.remove();

        overlay.querySelector(".project-modal-close")
            .addEventListener("click", close);

        overlay.addEventListener("click", event => {
            if (event.target === overlay) close();
        });

        const completeButton = overlay.querySelector("[data-complete-project]");

        if (completeButton) {
            completeButton.addEventListener("click", () => {
                const currentState = getState();

                if (!Array.isArray(currentState.completedProjects)) {
                    currentState.completedProjects = [];
                }

                if (currentState.completedProjects.includes(project.id)) {
                    close();
                    return;
                }

                currentState.completedProjects.push(project.id);
                currentState.xp = (Number(currentState.xp) || 0) + 50;

                saveState(currentState);

                if (typeof refresh === "function") {
                    refresh();
                }

                if (typeof showToast === "function") {
                    showToast("Проект завершён! Получено 50 XP.");
                }

                close();
                render();
            });
        }
    }

    function openProjectById(projectId) {
        const project = PROJECTS.find(item => item.id === projectId);

        if (project) openProject(project);
    }

    return {
        render,
        getProjects: () => PROJECTS,
        openProject: openProjectById
    };
}
