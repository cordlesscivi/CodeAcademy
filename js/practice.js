
const TASKS = [
    {
        id: "python-1",
        language: "Python",
        icon: "🐍",
        level: "Начальный",
        title: "Приветствие",
        description: "Выведи текст Hello, World! в консоль.",
        question: "Какой командой в Python вывести текст Hello, World!?",
        hint: "Используй функцию print().",
        answer: 'print("Hello, World!")'
    },
    {
        id: "python-2",
        language: "Python",
        icon: "🐍",
        level: "Начальный",
        title: "Переменная",
        description: "Создай переменную с именем age и значением 18.",
        question: "Напиши команду создания переменной age со значением 18.",
        hint: "Формат: имя = значение",
        answer: "age = 18"
    },
    {
        id: "js-1",
        language: "JavaScript",
        icon: "🌐",
        level: "Начальный",
        title: "Вывод текста",
        description: "Выведи сообщение в консоль браузера.",
        question: "Как вывести Hello в консоль JavaScript?",
        hint: "Используй console.log().",
        answer: 'console.log("Hello")'
    },
    {
        id: "js-2",
        language: "JavaScript",
        icon: "🌐",
        level: "Начальный",
        title: "Константа",
        description: "Создай константу с именем score и значением 100.",
        question: "Напиши команду создания константы score со значением 100.",
        hint: "Используй const.",
        answer: "const score = 100"
    },
    {
        id: "cpp-1",
        language: "C++",
        icon: "⚙️",
        level: "Начальный",
        title: "Вывод в консоль",
        description: "Выведи число 42.",
        question: "Как вывести число 42 в C++?",
        hint: "Используй std::cout.",
        answer: "std::cout << 42"
    },
    {
        id: "cpp-2",
        language: "C++",
        icon: "⚙️",
        level: "Начальный",
        title: "Переменная",
        description: "Создай целочисленную переменную number со значением 10.",
        question: "Напиши объявление переменной number.",
        hint: "Используй тип int.",
        answer: "int number = 10"
    },
    {
        id: "sql-1",
        language: "SQL",
        icon: "🗄️",
        level: "Начальный",
        title: "Выборка данных",
        description: "Получи все записи из таблицы users.",
        question: "Напиши SQL-запрос для получения всех записей из users.",
        hint: "Начни с SELECT * FROM.",
        answer: "SELECT * FROM users"
    },
    {
        id: "sql-2",
        language: "SQL",
        icon: "🗄️",
        level: "Начальный",
        title: "Фильтрация",
        description: "Найди пользователей старше 18 лет.",
        question: "Напиши запрос выбора пользователей старше 18 лет из users.",
        hint: "Используй WHERE age > 18.",
        answer: "SELECT * FROM users WHERE age > 18"
    },
    {
        id: "java-1",
        language: "Java",
        icon: "☕",
        level: "Начальный",
        title: "Вывод текста",
        description: "Выведи слово Hello.",
        question: "Как вывести Hello в Java?",
        hint: "Используй System.out.println().",
        answer: 'System.out.println("Hello")'
    },
    {
        id: "rust-1",
        language: "Rust",
        icon: "🦀",
        level: "Начальный",
        title: "Вывод текста",
        description: "Выведи сообщение Hello.",
        question: "Как вывести Hello в Rust?",
        hint: "Используй макрос println!.",
        answer: 'println!("Hello")'
    }
];

export function createPracticeSystem({
                                         getState,
                                         saveState,
                                         refresh,
                                         showToast
                                     }) {
    const page = document.getElementById("page-practice");

    function normalize(value) {
        return String(value)
            .trim()
            .replace(/\s+/g, " ")
            .replace(/;$/, "")
            .replace(/'/g, '"')
            .toLowerCase();
    }

    function render() {
        if (!page) return;

        const state = getState();
        const completed = Array.isArray(state.completedPractice)
            ? state.completedPractice
            : [];

        const count = completed.length;
        const percent = Math.round(count / TASKS.length * 100);

        page.innerHTML = `
            <div class="page-heading">
                <span class="eyebrow">ТРЕНИРУЙ НАВЫКИ</span>
                <h1>Практика</h1>
                <p>Решай задачи, проверяй знания и получай опыт.</p>
            </div>

            <div class="practice-progress">
                <div class="practice-progress-info">
                    <strong>Твой прогресс</strong>
                    <span>${count} из ${TASKS.length} заданий</span>
                </div>
                <div class="practice-progress-track">
                    <div class="practice-progress-fill"
                         style="width: ${percent}%"></div>
                </div>
                <span>${percent}% выполнено</span>
            </div>

            <div class="practice-filters">
                <button class="practice-filter active" data-filter="all">
                    Все задания
                </button>
                <button class="practice-filter" data-filter="Python">
                    Python
                </button>
                <button class="practice-filter" data-filter="JavaScript">
                    JavaScript
                </button>
                <button class="practice-filter" data-filter="C++">
                    C++
                </button>
                <button class="practice-filter" data-filter="SQL">
                    SQL
                </button>
                <button class="practice-filter" data-filter="Java">
                    Java
                </button>
                <button class="practice-filter" data-filter="Rust">
                    Rust
                </button>
            </div>

            <div class="practice-list" id="practiceList"></div>
        `;

        const list = page.querySelector("#practiceList");
        let activeFilter = "all";

        function drawTasks() {
            const currentCompleted = getState().completedPractice || [];

            const filtered = TASKS.filter(task =>
                activeFilter === "all" ||
                task.language === activeFilter
            );

            list.innerHTML = filtered.map(task => {
                const done = currentCompleted.includes(task.id);

                return `
                    <article class="practice-card ${done ? "completed" : ""}">
                        <div class="practice-card-top">
                            <span class="practice-language">
                                ${task.icon} ${task.language}
                            </span>
                            <span class="practice-level">${task.level}</span>
                        </div>

                        <h3>${task.title}</h3>
                        <p>${task.description}</p>

                        <button class="btn-primary full-width"
                            data-open-task="${task.id}">
                            ${done ? "Посмотреть задание" : "Решить задание"}
                        </button>

                        ${done ? '<span class="practice-done">✓ Выполнено</span>' : ""}
                    </article>
                `;
            }).join("");

        }

        page.querySelectorAll("[data-filter]").forEach(button => {
            button.addEventListener("click", () => {
                activeFilter = button.dataset.filter;

                page.querySelectorAll("[data-filter]").forEach(item => {
                    item.classList.toggle("active", item === button);
                });

                drawTasks();
            });
        });

        list.addEventListener("click", event => {
            const button = event.target.closest("[data-open-task]");
            if (!button) return;

            const task = TASKS.find(
                item => item.id === button.dataset.openTask
            );

            if (task) {
                openTask(task);
            }
        });

        function openTask(task) {
            const done = (getState().completedPractice || [])
                .includes(task.id);

            const overlay = document.createElement("div");
            overlay.className = "practice-modal";

            overlay.innerHTML = `
                <div class="practice-modal-content">
                    <button class="practice-close" aria-label="Закрыть">
                        ×
                    </button>

                    <span class="practice-language">
                        ${task.icon} ${task.language}
                    </span>

                    <h2>${task.title}</h2>
                    <p>${task.question}</p>

                    <textarea
                        class="practice-answer"
                        placeholder="Напиши свой ответ..."
                        rows="4"
                        ${done ? "disabled" : ""}
                    >${done ? task.answer : ""}</textarea>

                    <button class="practice-hint-button">
                        Показать подсказку
                    </button>

                    <p class="practice-hint" hidden>${task.hint}</p>

                    <div class="practice-feedback"></div>

                    ${
                done
                    ? '<div class="practice-success">✓ Это задание уже выполнено!</div>'
                    : '<button class="btn-primary full-width practice-check">Проверить ответ</button>'
            }
                </div>
            `;

            document.body.appendChild(overlay);

            const close = () => overlay.remove();

            overlay.querySelector(".practice-close")
                .addEventListener("click", close);

            overlay.addEventListener("click", event => {
                if (event.target === overlay) close();
            });

            const hintButton = overlay.querySelector(".practice-hint-button");
            const hint = overlay.querySelector(".practice-hint");

            hintButton.addEventListener("click", () => {
                hint.hidden = !hint.hidden;
                hintButton.textContent = hint.hidden
                    ? "Показать подсказку"
                    : "Скрыть подсказку";
            });

            const checkButton = overlay.querySelector(".practice-check");

            if (!checkButton) return;

            checkButton.addEventListener("click", () => {
                const answer = overlay.querySelector(".practice-answer").value;
                const feedback = overlay.querySelector(".practice-feedback");

                if (!answer.trim()) {
                    feedback.textContent = "Сначала введи ответ.";
                    feedback.className = "practice-feedback error";
                    return;
                }

                if (normalize(answer) !== normalize(task.answer)) {
                    feedback.textContent = "Ответ пока неверный. Попробуй ещё раз!";
                    feedback.className = "practice-feedback error";
                    return;
                }

                const currentState = getState();

                if (!Array.isArray(currentState.completedPractice)) {
                    currentState.completedPractice = [];
                }

                if (!currentState.completedPractice.includes(task.id)) {
                    currentState.completedPractice.push(task.id);
                    currentState.xp = (Number(currentState.xp) || 0) + 25;

                    saveState(currentState);

                    if (typeof refresh === "function") {
                        refresh();
                    }

                    if (typeof showToast === "function") {
                        showToast("Правильно! Получено 25 XP.");
                    }
                }

                feedback.textContent = "Верно! Ты получил 25 XP.";
                feedback.className = "practice-feedback success";

                checkButton.remove();
                overlay.querySelector(".practice-answer").disabled = true;

                setTimeout(() => {
                    close();
                    render();
                }, 1200);
            });
        }

        drawTasks();
    }

    return { render };
}
