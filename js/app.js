import { loadState, saveState, resetState } from "./storage.js";
import { getLevel, registerVisit } from "./profile.js";
import { initRouter, navigate } from "./router.js";
import { COURSES } from "../data/courses.js";
import { createCourseSystem } from "./courses.js";
import { createPracticeSystem } from "./practice.js";
import { createProjectSystem } from "./projects.js";

let state = loadState();

registerVisit(state);
saveState(state);

const getState = () => state;

function persistState(newState = state) {
    state = newState;
    saveState(state);
}

function showToast(message) {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;

    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}

function updateHeader() {
    const level = getLevel(state.xp);

    setText("topXP", `${state.xp} XP`);
    setText("topLevel", `Уровень ${level.level}`);
}

function updateDashboard() {
    const level = getLevel(state.xp);

    setText("dashboardXP", `${state.xp} XP`);
    setText("dashboardLessons", state.lessons.length);
    setText("dashboardStreak", `${state.streak} дней`);
    setText("dashboardAchievements", state.achievements.length);

    setText("levelNumber", String(level.level).padStart(2, "0"));
    setText("levelName", level.name);
    setText(
        "levelProgressText",
        `${level.currentXP} / 100 XP до следующего уровня`
    );

    const progress = document.getElementById("levelProgressFill");

    if (progress) {
        progress.style.width = `${level.currentXP}%`;
    }

    updateHeader();
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

function statCard(icon, label, value, tone) {
    return `
        <div class="profile-stat-card">
            <div class="profile-stat-icon ${tone}">${icon}</div>
            <div>
                <strong>${escapeHTML(value)}</strong>
                <small>${escapeHTML(label)}</small>
            </div>
        </div>
    `;
}

function renderProfile() {
    const level = getLevel(state.xp);
    const name = state.name || "Будущий разработчик";
    const avatar = state.avatar || "👨‍💻";

    const section = document.getElementById("page-profile");
    if (!section) return;

    section.innerHTML = `
        <div class="profile-layout">
            <div class="profile-hero">
                <div class="profile-hero-main">
                    <div class="profile-avatar-large" id="profileAvatarLarge">${avatar}</div>
                    <div class="profile-identity">
                        <span class="profile-kicker">ЛИЧНЫЙ КАБИНЕТ</span>
                        <h2 id="profileNameDisplay">${escapeHTML(name)}</h2>
                        <p>Участник CodeQuest Academy</p>
                        <div class="profile-badges">
                            ${state.achievements.slice(0, 6)
                                .map(a => `<span>🏆 ${escapeHTML(a)}</span>`)
                                .join("")}
                            <span>⚡ ${state.xp} XP</span>
                        </div>
                    </div>
                </div>

                <div class="profile-level-panel">
                    <div class="profile-level-heading">
                        <div>
                            <span class="profile-kicker">УРОВЕНЬ</span>
                            <h3>${level.name}</h3>
                        </div>
                        <span class="profile-level-number">
                            ${String(level.level).padStart(2, "0")}
                        </span>
                    </div>

                    <div class="profile-progress-labels">
                        <span>0 XP</span>
                        <strong>${level.currentXP} XP</strong>
                        <span class="profile-next-level">до ${level.levelStep} XP</span>
                    </div>

                    <div class="profile-progress-track">
                        <div style="width:${level.currentXP}%"></div>
                    </div>

                    <div class="profile-next-level">
                        До следующего уровня: ${level.levelStep - level.currentXP} XP
                    </div>
                </div>
            </div>

            <div class="profile-stats-grid">
                ${statCard("zap", "Опыт", state.xp, "purple")}
                ${statCard("book-check", "Уроки", state.lessons.length, "blue")}
                ${statCard("flame", "Серия", `${state.streak} дней`, "orange")}
                ${statCard("trophy", "Достижения", state.achievements.length, "green")}
            </div>

            <div class="profile-content-grid">
                <div class="profile-section">
                    <div class="profile-section-heading">
                        <h2>Достижения</h2>
                        <span class="profile-section-count">
                            ${state.achievements.length}
                        </span>
                    </div>
                    <div class="profile-achievements">
                        ${renderProfileAchievements()}
                    </div>
                </div>

                <div class="profile-section">
                    <div class="profile-section-heading">
                        <h2>История</h2>
                    </div>
                    <div class="profile-history">
                        ${renderProfileHistory()}
                    </div>
                </div>
            </div>

            <div class="profile-section profile-settings">
                <div class="profile-section-heading"><h2>Настройки</h2></div>

                <div class="profile-field-label">Имя</div>
                <input class="profile-name-input"
                    id="profileNameInput"
                    value="${escapeHTML(name)}">

                <div class="profile-field-label">Автар</div>
                <div class="profile-avatar-options" id="profileAvatarOptions">
                    ${["👨‍💻", "👩‍💻", "🤖", "🐍", "🦀", "🌐", "🗄️", "🎮"]
                        .map((a, i) =>
                            `<div class="profile-avatar-option ${i === 0 ? "selected" : ""}"
                                data-avatar="${escapeHTML(a)}">${a}</div>`
                        )
                        .join("")}
                </div>

                <button class="btn-primary profile-save-button"
                    id="profileSave">
                    Сохранить настройки
                </button>
            </div>

            <div class="profile-danger-zone">
                <div>
                    <strong>Опасная зона</strong>
                    <p>Сбросить весь прогресс обучения. Это действие нельзя отменить.</p>
                </div>
                <button class="secondary-button" id="resetProgress">
                    Сбросить прогресс
                </button>
            </div>
        </div>
    `;

    bindProfileControls();
}

function renderProfileAchievements() {
    const labels = {
        "first-practice": "Первый шаг",
        "five-practice": "Практикант",
        "first-lesson": "Книга открыта",
        "first-project": "Создатель",
        "hundred-xp": "Первые 100 XP",
        "seven-days": "Постоянство",
        "first-xp": "Первый XP"
    };

    if (!state.achievements || !state.achievements.length) {
        return `
            <div class="profile-empty">
                <span>🏆</span>
                <strong>Достижений пока нет</strong>
                <p>Пройди уроки и задачи, чтобы получить награды.</p>
            </div>
        `;
    }

    return state.achievements.map(id => {
        const label = labels[id] || id;
        return `
            <div class="profile-achievement">
                <span>🏆</span>
                <div>
                    <strong>${escapeHTML(label)}</strong>
                    <small>Разблокировано</small>
                </div>
                <i class="profile-check">✓</i>
            </div>
        `;
    }).join("");
}

function renderProfileHistory() {
    const lessons = Array.isArray(state.lessons) ? state.lessons : [];

    if (!lessons.length) {
        return `
            <div class="profile-empty">
                <span>📚</span>
                <strong>Истории пока нет</strong>
                <p>Пройди первый урок, чтобы начать историю обучения.</p>
            </div>
        `;
    }

    return lessons.slice().reverse().slice(0, 6).map(id => {
        const course = COURSES.find(c => c.lessons.some(l => l.id === id));
        const lesson = course ? course.lessons.find(l => l.id === id) : null;
        const title = lesson ? escapeHTML(lesson.title) : escapeHTML(id);
        const courseName = course ? escapeHTML(course.title) : "";

        return `
            <div class="profile-history-item">
                <span class="profile-history-check">✓</span>
                <div>
                    <strong>${title}</strong>
                    <small>${courseName}</small>
                </div>
            </div>
        `;
    }).join("");
}

function bindProfileControls() {
    const options = document.querySelectorAll(
        "#profileAvatarOptions .profile-avatar-option"
    );
    let selectedAvatar = state.avatar || "👨‍💻";

    options.forEach(opt => {
        opt.addEventListener("click", () => {
            selectedAvatar = opt.dataset.avatar;
            options.forEach(o =>
                o.classList.toggle("selected", o === opt)
            );
        });
    });

    const saveButton = document.getElementById("profileSave");

    if (saveButton) {
        saveButton.addEventListener("click", () => {
            const input = document.getElementById("profileNameInput");
            const newName = input
                ? input.value.trim() || "Будущий разработчик"
                : state.name;

            state.name = newName;
            state.avatar = selectedAvatar;

            persistState();
            renderProfile();
            showToast("Настройки сохранены.");
        });
    }

    const resetButton = document.getElementById("resetProgress");

    if (resetButton) {
        resetButton.addEventListener("click", () => {
            const confirmed = confirm(
                "Ты действительно хочешь сбросить весь прогресс? Это действие нельзя отменить."
            );

            if (!confirmed) return;

            state = resetState();
            registerVisit(state);
            persistState();

            refresh();
            navigate("dashboard");
            showToast("Прогресс сброшен.");
        });
    }
}

function renderDashboard() {
    updateDashboard();
    renderDashboardContinue();
    renderDashboardCourses();
    renderDashboardProjects();
}

function renderDashboardContinue() {
    const container = document.getElementById("dashboardContinue");
    if (!container) return;

    const lastId = state.lastLessonId;

    if (!lastId) {
        container.innerHTML = `
            <div class="continue-card">
                <span class="continue-kicker">ПРОДОЛЖИТЬ</span>
                <strong>Начни обучение</strong>
                <p>Открой первый урок любого курса.</p>
                <button class="btn-primary" data-page="courses">Выбрать курс</button>
            </div>
        `;

        const button = container.querySelector('[data-page="courses"]');
        if (button) {
            button.addEventListener("click", () => navigate("courses"));
        }
        return;
    }

    let found = null;

    for (const course of COURSES) {
        const lesson = course.lessons.find(l => l.id === lastId);
        if (lesson) {
            found = { course, lesson };
            break;
        }
    }

    if (!found) {
        container.innerHTML = `
            <div class="continue-card">
                <span class="continue-kicker">ПРОДОЛЖИТЬ</span>
                <strong>Начни обучение</strong>
                <p>Открой первый урок любого курса.</p>
                <button class="btn-primary" data-page="courses">Выбрать курс</button>
            </div>
        `;
        const button = container.querySelector('[data-page="courses"]');
        if (button) {
            button.addEventListener("click", () => navigate("courses"));
        }
        return;
    }

    const { course, lesson } = found;

    container.innerHTML = `
        <div class="continue-card">
            <span class="continue-kicker">ПОСЛЕДНИЙ УРОК</span>
            <strong>${escapeHTML(lesson.title)}</strong>
            <p>${escapeHTML(course.title)} · ${escapeHTML(lesson.duration)}</p>
            <button class="btn-primary"
                data-continue-course="${escapeHTML(course.id)}"
                data-continue-lesson="${escapeHTML(lesson.id)}">
                Продолжить →
            </button>
        </div>
    `;

    const button = container.querySelector("[data-continue-course]");

    if (button) {
        button.addEventListener("click", () => {
            navigate("courses");
            courseSystem.openCourse(course.id);
        });
    }
}

function renderDashboardCourses() {
    const container = document.getElementById("dashboardCourses");
    if (!container) return;

    const completed = Array.isArray(state.lessons) ? state.lessons : [];

    const items = COURSES.map(course => {
        const done = course.lessons.filter(lesson =>
            completed.includes(lesson.id)
        ).length;
        const total = course.lessons.length;
        const percent = total ? Math.round(done / total * 100) : 0;

        return { course, done, total, percent };
    })
        .filter(item => item.total > 0)
        .slice(0, 4);

    container.innerHTML = items.map(({ course, done, total, percent }) => `
        <article class="learning-card">
            <div class="learning-card-top">
                <div class="learning-icon">${course.icon}</div>
                <span class="level-label">${escapeHTML(course.level)}</span>
            </div>

            <h2>${escapeHTML(course.title)}</h2>
            <p>${escapeHTML(course.description)}</p>

            <div class="learning-progress-info">
                <span>${done} из ${total} уроков</span>
                <strong>${percent}%</strong>
            </div>

            <div class="progress-track">
                <div class="progress-fill"
                    style="width:${percent}%"></div>
            </div>

            <button class="btn-primary full-width"
                data-open-course="${escapeHTML(course.id)}">
                Открыть курс →
            </button>
        </article>
    `).join("");

    container.querySelectorAll("[data-open-course]").forEach(button => {
        button.addEventListener("click", () => {
            const id = button.dataset.openCourse;
            navigate("courses");
            courseSystem.openCourse(id);
        });
    });
}

function renderDashboardProjects() {
    const container = document.getElementById("dashboardProjects");
    if (!container) return;

    const completed = Array.isArray(state.completedProjects)
        ? state.completedProjects
        : [];
    const projects = projectSystem.getProjects();

    const items = projects.slice(0, 3);

    container.innerHTML = items.map(project => {
        const done = completed.includes(project.id);

        return `
            <article class="project-card ${done ? "completed" : ""}">
                <div class="project-card-top">
                    <span class="project-icon">${project.icon}</span>
                    <span class="project-level">${escapeHTML(project.level)}</span>
                </div>

                <h3>${escapeHTML(project.title)}</h3>
                <p>${escapeHTML(project.description)}</p>

                <div class="project-meta">
                    <span>💻 ${escapeHTML(project.language)}</span>
                    <span>${done ? "✓ Выполнено" : "⭐ 50 XP"}</span>
                </div>

                <button class="btn-primary full-width"
                    data-project-id="${escapeHTML(project.id)}">
                    ${done ? "Посмотреть проект" : "Открыть задание"}
                </button>
            </article>
        `;
    }).join("");

    container.querySelectorAll("[data-project-id]").forEach(button => {
        button.addEventListener("click", () => {
            const id = button.dataset.projectId;
            navigate("projects");
            projectSystem.openProject(id);
        });
    });
}

const courseSystem = createCourseSystem({
    getState,
    saveState: persistState,
    refresh,
    showToast
});

const practiceSystem = createPracticeSystem({
    getState,
    saveState: persistState,
    refresh,
    showToast
});

const projectSystem = createProjectSystem({
    getState,
    saveState: persistState,
    refresh,
    showToast
});

function renderStatistics() {
    const container = document.getElementById("statisticsCards");
    const details = document.getElementById("statisticsDetails");

    if (!container || !details) return;

    const completedPractice = state.completedPractice.length;
    const completedLessons = state.lessons.length;
    const completedProjects = state.completedProjects.length;

    container.innerHTML = `
        <div class="overview-card">
            <span>Всего XP</span>
            <strong>${state.xp}</strong>
        </div>

        <div class="overview-card">
            <span>Уроки</span>
            <strong>${completedLessons}</strong>
        </div>

        <div class="overview-card">
            <span>Задания практики</span>
            <strong>${completedPractice}</strong>
        </div>

        <div class="overview-card">
            <span>Проекты</span>
            <strong>${completedProjects}</strong>
        </div>
    `;

    details.innerHTML = `
        <p>Текущая серия занятий: <strong>${state.streak} дней</strong></p>
        <p>Получено достижений: <strong>${state.achievements.length}</strong></p>
        <p>Всего выполнено учебных заданий:
            <strong>${completedLessons + completedPractice}</strong>
        </p>
    `;
}

const QUIZ_QUESTIONS = [
    {
        id: 1,
        category: "Сетевые протоколы",
        question: "Какие из перечисленных являются протоколами сетевого уровня (L3)?",
        options: ["IP", "ICMP", "TCP", "ARP", "OSPF", "UDP"],
        correct: [0, 1, 4],
        multiple: true,
        explanation: "IP, ICMP и OSPF — L3. TCP/UDP — L4, ARP — L2."
    },
    {
        id: 2,
        category: "Java: Инкапсуляция",
        question: "Какой из следующих фрагментов нарушает принцип инкапсуляции в Java?",
        options: [
            "Использование private поля с public геттером и сеттером",
            "Публичное поле public int age; в классе Person",
            "Метод public void save() в классе Database",
            "Использование final для неизменяемого поля"
        ],
        correct: [1],
        multiple: false,
        explanation: "Публичные поля открыты для изменения извне, что нарушает инкапсуляцию."
    },
    {
        id: 3,
        category: "Java: Компиляция",
        question: "Что произойдёт при компиляции этого кода?",
        code: `class A {
    protected void method() throws Exception {}
}
class B extends A {
    @Override
    public void method() throws java.io.IOException {}
}`,
        options: [
            "Ошибка компиляции: нельзя сузить тип исключения",
            "Ошибка компиляции: нельзя расширить модификатор доступа",
            "Компиляция без ошибок",
            "Ошибка компиляции: @Override недопустима"
        ],
        correct: [2],
        multiple: false,
        explanation: "IOException — подтип Exception, сужение исключения допустимо. Доступ protected → public — расширение допустимо."
    },
    {
        id: 4,
        category: "Сетевые протоколы",
        question: "Какой протокол используется для автоматического получения устройством IP-адреса, маски подсети, шлюза по умолчанию и адресов DNS-серверов при подключении к сети?",
        options: ["DHCP", "DNS", "HTTP", "ARP"],
        correct: [0],
        multiple: false,
        explanation: "DHCP (Dynamic Host Configuration Protocol) автоматически назначает IP-адреса и сетевые настройки."
    },
    {
        id: 5,
        category: "Java: Generics",
        question: "Какая сигнатура метода copy корректна для копирования из src в dest?",
        options: [
            "static <T> void copy(List<? extends T> dest, List<? super T> src)",
            "static <T> void copy(List<? super T> dest, List<? extends T> src)",
            "static <T> void copy(List<? extends T> dest, List<? extends T> src)",
            "static <T> void copy(List<? super T> dest, List<? super T> src)"
        ],
        correct: [1],
        multiple: false,
        explanation: "PECS: destination — consumer (super), source — producer (extends)."
    },
    {
        id: 6,
        category: "Java: String",
        question: "Какие из следующих утверждений о String в Java являются верными?",
        options: [
            "Объекты String иммутабельны",
            "Оператор == для двух String сравнивает их содержимое (символы)",
            "Строковые литералы хранятся в специальной области — пуле строк (String Pool)",
            "Метод intern() возвращает ссылку на строку из пула строк",
            "String s = \"a\" + \"b\"; создаёт объект в heap через конкатенацию в рантайме"
        ],
        correct: [0, 2, 3],
        multiple: true,
        explanation: "A, C, D верны. B — false (== сравнивает ссылки). E — false (конкатенация литералов на этапе компиляции)."
    },
    {
        id: 7,
        category: "Java: Effectively final",
        question: "Что произойдёт с этим кодом?",
        code: `public class Main {
    public static void main(String[] args) {
        final int x;
        if (args.length > 0) {
            x = 10;
        } else {
            x = 20;
        }
        Runnable r = () -> System.out.println(x);
        r.run();
    }
}`,
        options: [
            "Ошибка компиляции: x не инициализирована в момент объявления",
            "Ошибка компиляции: лямбда не может захватить final-переменную",
            "Ошибка компиляции: x не является «effectively final»",
            "Скомпилируется и отработает корректно"
        ],
        correct: [3],
        multiple: false,
        explanation: "x инициализируется в обеих ветках if/else, поэтому effectively final."
    },
    {
        id: 8,
        category: "JVM: Память",
        question: "Какое утверждение о распределении памяти в JVM является верным?",
        options: [
            "Объекты, созданные через new, хранятся в Stack, а локальные примитивные переменные — в Heap",
            "Объекты хранятся в Heap, а локальные переменные и ссылки на объекты — в Stack; каждый поток имеет свой отдельный Stack, но Heap общий для всех потоков",
            "И объекты, и локальные переменные хранятся в одной общей области — Heap, а Stack используется только для статических полей",
            "Начиная с Java 8, все объекты хранятся в Metaspace, а Heap используется только для примитивов"
        ],
        correct: [1],
        multiple: false,
        explanation: "Объекты в Heap, примитивы и ссылки в Stack (на поток). Heap общий."
    },
    {
        id: 9,
        category: "Java: HashMap",
        question: "Какое утверждение о внутреннем устройстве HashMap в Java 8+ является верным?",
        options: [
            "При коллизиях элементы всегда хранятся в связном списке",
            "Когда число элементов в бакете достигает 8, список сразу преобразуется в красно-чёрное дерево",
            "Связный список превращается в дерево, только если элементов в бакете ≥ 8 И размер таблицы ≥ 64; иначе — увеличение таблицы",
            "Преобразование в дерево происходит при достижении порога, а обратно в список — сразу при удалении любого элемента"
        ],
        correct: [2],
        multiple: false,
        explanation: "Treeify при ≥8 в бакете И table size ≥64, иначе resize."
    },
    {
        id: 10,
        category: "Java: ConcurrentModification",
        question: "Что выведет этот код?",
        code: `import java.util.ArrayList;
import java.util.List;
public class Main {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("A"); list.add("B"); list.add("C"); list.add("D");
        for (String s : list) {
            if (s.equals("B")) {
                list.remove(s);
            }
        }
        System.out.println(list);
    }
}`,
        options: [
            "[A, C, D]",
            "[A, B, D]",
            "ConcurrentModificationException",
            "[A, C]"
        ],
        correct: [2],
        multiple: false,
        explanation: "Удаление через итератор коллекции во время foreach вызывает ConcurrentModificationException."
    },
    {
        id: 11,
        category: "Java: Stream API",
        question: "Сопоставьте операцию Stream API и факт о ней.",
        options: [
            "count() → возвращает количество элементов как long",
            "mapToInt() → возвращает IntStream",
            "min() → находит наименьший элемент согласно Comparator",
            "map() → преобразует каждый элемент в одиночный элемент",
            "flatMap() → принимает функцию, возвращающую Stream"
        ],
        correct: [0, 1, 2, 3, 4],
        multiple: true,
        explanation: "Все пары верны: count() — long, mapToInt() — IntStream, min() — Comparator, map() — 1:1, flatMap() — 1:N."
    },
    {
        id: 12,
        category: "Java: Stream API",
        question: "Что выведет этот код?",
        code: `import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
public class Main {
    public static void main(String[] args) {
        List<String> words = Arrays.asList("apple", "banana", "avocado", "blueberry", "cherry");
        String result = words.stream()
                .filter(w -> w.length() > 5)
                .map(String::toUpperCase)
                .sorted()
                .collect(Collectors.groupingBy(w -> w.charAt(0)))
                .entrySet().stream()
                .map(e -> e.getKey() + "=" + e.getValue().size())
                .sorted()
                .collect(Collectors.joining(", "));
        System.out.println(result);
    }
}`,
        options: [
            "A=1, B=2, C=1",
            "A=2, B=2, C=1",
            "A=1, B=2",
            "B=2, C=1"
        ],
        correct: [0],
        multiple: false,
        explanation: "Фильтр length>5: banana(6), avocado(7), blueberry(9), cherry(6). Группировка по первой букве: A→[AVOCADO], B→[BANANA, BLUEBERRY], C→[CHERRY]."
    },
    {
        id: 13,
        category: "Java: Concurrency",
        question: "Что выведет этот код с ReentrantLock?",
        code: `import java.util.concurrent.locks.ReentrantLock;
public class Main {
    static ReentrantLock lock = new ReentrantLock();
    static void outer() {
        lock.lock();
        try {
            System.out.println("outer, holdCount = " + lock.getHoldCount());
            inner();
        } finally { lock.unlock(); }
    }
    static void inner() {
        lock.lock();
        try {
            System.out.println("inner, holdCount = " + lock.getHoldCount());
        } finally { lock.unlock(); }
    }
    public static void main(String[] args) { outer(); }
}`,
        options: [
            "outer, holdCount = 1 / inner, holdCount = 1",
            "outer, holdCount = 1 / inner, holdCount = 2",
            "Deadlock — inner() не сможет захватить lock",
            "Ошибка компиляции"
        ],
        correct: [1],
        multiple: false,
        explanation: "ReentrantLock reentrant: holdCount увеличивается до 2 при вложенном захвате."
    },
    {
        id: 14,
        category: "Java: CompletableFuture",
        question: "Что выведет этот код?",
        code: `import java.util.concurrent.CompletableFuture;
public class Main {
    public static void main(String[] args) throws Exception {
        CompletableFuture<Integer> future = CompletableFuture
                .supplyAsync(() -> 5)
                .thenApply(x -> x * 2)
                .thenCompose(x -> CompletableFuture.supplyAsync(() -> x + 1))
                .thenApply(x -> x * x);
        System.out.println(future.get());
    }
}`,
        options: ["121", "100", "144", "132"],
        correct: [0],
        multiple: false,
        explanation: "5 → thenApply(×2) = 10 → thenCompose(+1) = 11 → thenApply(×2) = 121."
    },
    {
        id: 15,
        category: "Java: ExecutorService",
        question: "В чём разница между submit() и execute() у ExecutorService?",
        options: [
            "execute(Runnable) возвращает void, а submit() возвращает Future; исключения в execute() идут в UncaughtExceptionHandler, а в submit() упаковываются в Future",
            "Оба метода возвращают Future",
            "submit() принимает Callable и Runnable, а execute() выполняет синхронно",
            "execute() определён в ExecutorService, а submit() — в родительском Executor"
        ],
        correct: [0],
        multiple: false,
        explanation: "execute() возвращает void, submit() возвращает Future. Исключения: execute() → UncaughtExceptionHandler, submit() → упаковка в Future."
    },
    {
        id: 16,
        category: "Java: volatile & synchronized",
        question: "Какие утверждения о volatile и synchronized НЕ верны?",
        options: [
            "volatile гарантирует атомарность операции count++",
            "volatile гарантирует видимость изменений между потоками",
            "synchronized обеспечивает и mutual exclusion, и видимость",
            "Два потока могут одновременно войти в два разных synchronized-метода одного объекта",
            "synchronized-блок можно использовать с любым объектом в качестве монитора"
        ],
        correct: [0, 3],
        multiple: true,
        explanation: "А — неверно (count++ не атомарен). Д — неверно (один монитор для всех synchronized-методов)."
    },
    {
        id: 17,
        category: "SQL: GROUP BY",
        question: "Дана таблица employees. Что вернёт запрос с HAVING COUNT(*) > 1?",
        code: `SELECT department, COUNT(*) AS cnt, AVG(salary) AS avg_salary
FROM employees
GROUP BY department
HAVING COUNT(*) > 1;`,
        options: [
            "IT 2 110000 / HR 2 80000",
            "IT 2 110000 / HR 2 80000 / Sales 1 90000",
            "IT 2 220000 / HR 2 160000",
            "Ошибка выполнения"
        ],
        correct: [0],
        multiple: false,
        explanation: "IT: cnt=2, avg=(100000+120000)/2=110000. HR: cnt=2, avg=80000. Sales отсекается (cnt=1)."
    },
    {
        id: 18,
        category: "SQL: Нормализация",
        question: "Какие утверждения о нормальных формах ВЕРНЫ?",
        options: [
            "Таблица orders нарушает 1NF, потому что несколько товаров в повторяющихся столбцах",
            "1NF требует атомарных значений и отсутствия повторяющихся групп столбцов",
            "2NF устраняет частичную зависимость неключевых атрибутов от части составного ключа",
            "3NF устраняет транзитивные зависимости",
            "Таблица уже в 3NF, так как есть первичный ключ order_id"
        ],
        correct: [0, 1, 2, 3],
        multiple: true,
        explanation: "A, B, C, D верны. E — неверно: наличие PK не гарантирует 3NF."
    },
    {
        id: 19,
        category: "SQL: Изоляция",
        question: "Какой уровень изоляции предотвращает грязные чтения, но допускает неповторяющиеся чтения и фантомные чтения?",
        options: [
            "READ UNCOMMITTED",
            "READ COMMITTED",
            "REPEATABLE READ",
            "SERIALIZABLE"
        ],
        correct: [1],
        multiple: false,
        explanation: "READ COMMITTED: нет грязных чтений, но есть неповторяющиеся и фантомные."
    },
    {
        id: 20,
        category: "PostgreSQL",
        question: "Выберите НЕВЕРНЫЕ утверждения для PostgreSQL:",
        options: [
            "LIMIT используется для ограничения строк",
            "SERIAL используется для автоинкремента",
            "SELECT TOP 10 * FROM users — синтаксис PostgreSQL",
            "PostgreSQL не поддерживает JSON",
            "Строки в PostgreSQL заключаются в двойные кавычки"
        ],
        correct: [2, 3, 4],
        multiple: true,
        explanation: "C — неверно (TOP это T-SQL). D — неверно (JSON/JSONB есть). E — неверно (строки в одинарных кавычках)."
    },
    {
        id: 21,
        category: "JDBC",
        question: "Что означает connection.setAutoCommit(false)?",
        options: [
            "Каждый SQL-запрос автоматически фиксируется",
            "Автоматическая фиксация отключается: изменения не попадут в БД до явного commit()",
            "Соединение автоматически закроется после первого запроса",
            "БД перейдёт в режим только чтения"
        ],
        correct: [1],
        multiple: false,
        explanation: "setAutoCommit(false) отключает автофиксацию — нужен явный commit()."
    },
    {
        id: 22,
        category: "Spring: DI",
        question: "Что произойдёт при @Autowired PaymentService с двумя реализациями (CardPayment, CashPayment)?",
        options: [
            "Spring внедрит первую попавшуюся по алфавиту",
            "Spring выбросит NoUniqueBeanDefinitionException",
            "Spring внедрит обе реализации в виде списка",
            "Приложение запустится, но paymentService будет null"
        ],
        correct: [1],
        multiple: false,
        explanation: "Без @Qualifier или @Primary будет NoUniqueBeanDefinitionException."
    },
    {
        id: 23,
        category: "Spring: @Transactional",
        question: "Что произойдёт с записью в БД после RuntimeException в @Transactional методе?",
        options: [
            "Запись сохранится",
            "Транзакция откатится (rollback), запись НЕ сохранится",
            "Запись сохранится, Spring просто zalогирует ошибку",
            "Приложение аварийно завершится"
        ],
        correct: [1],
        multiple: false,
        explanation: "RuntimeException откатывает транзакцию по умолчанию."
    },
    {
        id: 24,
        category: "Spring: REST",
        question: "Какой ответ получит клиент при UserNotFoundException в контроллере с локальным @ExceptionHandler и глобальным @RestControllerAdvice?",
        options: [
            "500 SERVER ERROR",
            "404 not found",
            "404 GLOBAL: not found",
            "Ошибка на старте"
        ],
        correct: [1],
        multiple: false,
        explanation: "Локальный @ExceptionHandler в контроллере имеет приоритет над глобальным @RestControllerAdvice."
    },
    {
        id: 25,
        category: "Kafka",
        question: "Что гарантирует Apache Kafka относительно порядка сообщений?",
        options: [
            "Порядок сохраняется глобально во всём топике",
            "Порядок гарантируется только внутри одной партиции",
            "Kafka вообще не гарантирует порядок",
            "Порядок гарантируется только при одном консьюмере"
        ],
        correct: [1],
        multiple: false,
        explanation: "Порядок гарантируется только в рамках одной партиции."
    },
    {
        id: 26,
        category: "Kafka",
        question: "Что такое Consumer group в Apache Kafka?",
        options: [
            "Группа топиков для администрирования",
            "Набор консьюмеров, совместно читающих топик: партиции распределяются так, что каждую читает один консьюмер",
            "Группа брокеров для репликации",
            "Набор продюсеров, пишущих в один топик"
        ],
        correct: [1],
        multiple: false,
        explanation: "Партиции распределяются между консьюмерами группы — каждую читает только один."
    },
    {
        id: 27,
        category: "Docker",
        question: "Docker-контейнер без флага --network. Какой сетевой драйвер по умолчанию?",
        options: ["host", "bridge", "none", "overlay", "macvlan"],
        correct: [1],
        multiple: false,
        explanation: "По умолчанию используется bridge."
    },
    {
        id: 28,
        category: "Java: Concurrency",
        question: "Для какого сценария предпочтительнее пессимистичная блокировка?",
        options: [
            "Много читающих операций, конфликты редки",
            "Высокая вероятность конфликтов и критична гарантированность записи (например, списание денег)",
            "Данные почти никогда не изменяются",
            "Нужно максимально повысить пропускную способность на чтение"
        ],
        correct: [1],
        multiple: false,
        explanation: "Пессимистичная блокировка при высокой вероятности конфликтов и критичности записи."
    },
    {
        id: 29,
        category: "Java: Concurrency",
        question: "Что делает Executors.newFixedThreadPool(3)?",
        options: [
            "Создаёт пул, где всегда ровно 3 потока, лишние задачи ждут в очереди",
            "Создаёт пул, который расширяется до бесконечности",
            "Создаёт пул из 3 потоков, уничтожаемых после задачи",
            "Создаёт 3 отдельных ExecutorService"
        ],
        correct: [0],
        multiple: false,
        explanation: "newFixedThreadPool создаёт фиксированный пул с очередью для лишних задач."
    },
    {
        id: 30,
        category: "Java: Concurrency",
        question: "Сопоставьте понятие и значение (Deadlock, Livelock, Starvation, Race condition).",
        options: [
            "Starvation → поток бесконечно не получает ресурс",
            "Race condition → несколько потоков одновременно обращаются к общим данным",
            "Livelock → потоки активно работают и постоянно меняют состояние",
            "Deadlock → два и более потока навсегда застыли"
        ],
        correct: [0, 1, 2, 3],
        multiple: true,
        explanation: "Все пары верны."
    }
];

function renderQuiz() {
    const page = document.getElementById("page-quiz");
    if (!page) return;

    let currentQuestion = 0;
    let score = 0;
    let userAnswers = {};

    function renderQuestion(idx) {
        const q = QUIZ_QUESTIONS[idx];
        const answered = userAnswers[q.id] !== undefined;
        const selected = answered
            ? (Array.isArray(userAnswers[q.id])
                ? userAnswers[q.id]
                : [userAnswers[q.id]])
            : [];

        let optionsHTML = q.options.map((opt, i) => {
            const checked = selected.includes(i);
            return `
                <label class="quiz-option ${checked ? "selected" : ""}">
                    <input type="${q.multiple ? "checkbox" : "radio"}"
                        name="quiz-${q.id}" value="${i}"
                        ${checked ? "checked" : ""}>
                    ${escapeHTML(opt)}
                </label>
            `;
        }).join("");

        return `
            <div class="quiz-question" data-qid="${q.id}">
                <div class="quiz-category">${escapeHTML(q.category)}</div>
                <h3>Вопрос ${idx + 1} из ${QUIZ_QUESTIONS.length}</h3>
                <p>${escapeHTML(q.question)}</p>
                ${q.code ? `<pre class="quiz-code"><code>${q.code}</code></pre>` : ""}
                <div class="quiz-options">
                    ${optionsHTML}
                </div>
                <div class="quiz-feedback"></div>
            </div>
        `;
    }

    function render() {
        page.innerHTML = `
            <div class="page-heading">
                <span class="eyebrow">ПРОВЕРЬ ЗНАНИЯ</span>
                <h1>Тесты и вопросы</h1>
                <p>Проверь себя по Java, SQL, Docker, Spring и другим темам.</p>
            </div>

            <div class="quiz-container">
                <div class="quiz-progress">
                    <span id="quizProgressText">Вопрос 1 из ${QUIZ_QUESTIONS.length}</span>
                    <div class="quiz-progress-bar">
                        <div class="quiz-progress-fill"
                            id="quizProgressFill"
                            style="width: ${100 / QUIZ_QUESTIONS.length}%"></div>
                    </div>
                </div>

                <div class="quiz-question-area" id="quizQuestionArea"></div>

                <div class="quiz-nav">
                    <button class="btn-secondary" id="quizPrev" disabled>Назад</button>
                    <button class="btn-primary" id="quizNext">Далее</button>
                </div>

                <div class="quiz-result" id="quizResult" style="display:none;">
                    <h2>Результат: <span id="quizScore">0</span> из ${QUIZ_QUESTIONS.length}</h2>
                    <p>Процент: <span id="quizPercent">0</span>%</p>
                    <button class="btn-primary" id="quizRetake">Пройти снова</button>
                </div>
            </div>
        `;

        bindEvents();
    }

    function bindEvents() {
        const questionArea = page.querySelector("#quizQuestionArea");
        const prevBtn = page.querySelector("#quizPrev");
        const nextBtn = page.querySelector("#quizNext");
        const resultArea = page.querySelector("#quizResult");
        const retakeBtn = page.querySelector("#quizRetake");
        const scoreText = page.querySelector("#quizScore");
        const percentText = page.querySelector("#quizPercent");
        const progressText = page.querySelector("#quizProgressText");
        const progressFill = page.querySelector("#quizProgressFill");

        function showQuestion(idx) {
            currentQuestion = idx;
            questionArea.innerHTML = renderQuestion(idx);
            progressText.textContent = `Вопрос ${idx + 1} из ${QUIZ_QUESTIONS.length}`;
            progressFill.style.width = `${((idx + 1) / QUIZ_QUESTIONS.length) * 100}%`;

            prevBtn.disabled = idx === 0;
            nextBtn.disabled = false;
            resultArea.style.display = "none";

            bindQuestionInputs(idx);
        }

        function bindQuestionInputs(idx) {
            const q = QUIZ_QUESTIONS[idx];

            questionArea.querySelectorAll("input").forEach(input => {
                input.addEventListener("change", () => {
                    const val = parseInt(input.value, 10);

                    if (q.multiple) {
                        const arr = Array.isArray(userAnswers[q.id])
                            ? [...userAnswers[q.id]]
                            : [];
                        const pos = arr.indexOf(val);

                        if (input.checked) {
                            if (pos === -1) arr.push(val);
                        } else {
                            if (pos !== -1) arr.splice(pos, 1);
                        }
                        userAnswers[q.id] = arr;
                    } else {
                        userAnswers[q.id] = val;
                    }
                });
            });
        }

        prevBtn.addEventListener("click", () => {
            if (currentQuestion > 0) {
                showQuestion(currentQuestion - 1);
            }
        });

        nextBtn.addEventListener("click", () => {
            const q = QUIZ_QUESTIONS[currentQuestion];
            const userAnswer = userAnswers[q.id];
            const hasAnswer = q.multiple
                ? Array.isArray(userAnswer) && userAnswer.length > 0
                : userAnswer !== undefined;

            if (!hasAnswer) {
                showToast("Сначала выберите ответ!");
                return;
            }

            const isCorrect = q.multiple
                ? Array.isArray(userAnswer)
                    && userAnswer.length === q.correct.length
                    && userAnswer.every(v => q.correct.includes(v))
                : q.correct.includes(userAnswer);

            if (isCorrect) {
                score++;
            }

            if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
                showQuestion(currentQuestion + 1);
            } else {
                showResult();
            }
        });

        function showResult() {
            questionArea.style.display = "none";
            prevBtn.style.display = "none";
            nextBtn.style.display = "none";
            resultArea.style.display = "block";
            scoreText.textContent = score;
            percentText.textContent = Math.round(
                (score / QUIZ_QUESTIONS.length) * 100
            );
        }

        retakeBtn.addEventListener("click", () => {
            currentQuestion = 0;
            score = 0;
            userAnswers = {};
            showQuestion(0);
            questionArea.style.display = "block";
            prevBtn.style.display = "inline-block";
            nextBtn.style.display = "inline-block";
            resultArea.style.display = "none";
        });

        showQuestion(0);
    }

    render();
}

function renderAchievements() {
    const container = document.getElementById("achievementCatalog");
    if (!container) return;

    const achievements = [
        {
            id: "first-practice",
            title: "Первый шаг",
            description: "Выполни первое задание практики.",
            icon: "🚀",
            condition: state.completedPractice.length >= 1
        },
        {
            id: "five-practice",
            title: "Практикант",
            description: "Выполни пять заданий практики.",
            icon: "💻",
            condition: state.completedPractice.length >= 5
        },
        {
            id: "first-lesson",
            title: "Книга открыта",
            description: "Заверши первый урок.",
            icon: "📚",
            condition: state.lessons.length >= 1
        },
        {
            id: "first-project",
            title: "Создатель",
            description: "Заверши первый проект.",
            icon: "🛠️",
            condition: state.completedProjects.length >= 1
        },
        {
            id: "hundred-xp",
            title: "Первые 100 XP",
            description: "Набери 100 очков опыта.",
            icon: "⚡",
            condition: state.xp >= 100
        },
        {
            id: "seven-days",
            title: "Постоянство",
            description: "Занимайся семь дней подряд.",
            icon: "🔥",
            condition: state.streak >= 7
        }
    ];

    const unlocked = achievements.filter(item => item.condition);

    state.achievements = unlocked.map(item => item.id);
    saveState(state);

    container.innerHTML = achievements.map(item => `
        <article class="achievement-card ${item.condition ? "unlocked" : "locked"}">
            <div class="achievement-icon">${item.icon}</div>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <span>${item.condition ? "✓ Получено" : "🔒 Пока закрыто"}</span>
        </article>
    `).join("");
}

function renderPage(page) {
    if (page === "dashboard") {
        renderDashboard();
    }

    if (page === "courses") {
        courseSystem.render();
    }

    if (page === "practice") {
        practiceSystem.render();
    }

    if (page === "projects") {
        projectSystem.render();
    }

    if (page === "achievements") {
        renderAchievements();
    }

    if (page === "statistics") {
        renderStatistics();
    }

    if (page === "profile") {
        renderProfile();
    }

    if (page === "quiz") {
        renderQuiz();
    }

    updateDashboard();
}

function refresh() {
    updateDashboard();
    renderProfile();
    renderStatistics();
    renderAchievements();
    projectSystem.render();
}

function applyTheme() {
    document.body.classList.remove("light", "cyberpunk");

    if (state.theme === "light") {
        document.body.classList.add("light");
    }

    if (state.theme === "cyberpunk") {
        document.body.classList.add("cyberpunk");
    }
}

function bindThemeButton() {
    const button = document.getElementById("themeButton");

    button?.addEventListener("click", () => {
        const themes = ["dark", "light", "cyberpunk"];
        const currentIndex = themes.indexOf(state.theme);

        state.theme = themes[(currentIndex + 1) % themes.length];

        applyTheme();
        persistState();

        showToast(`Тема: ${state.theme}`);
    });
}

function initMobileMenu() {
    const menuButton = document.getElementById("mobileMenu");
    const sidebar = document.getElementById("sidebar");

    menuButton?.addEventListener("click", () => {
        sidebar?.classList.toggle("open");
    });

    document.addEventListener("click", event => {
        if (
            window.innerWidth <= 900 &&
            sidebar?.classList.contains("open") &&
            !sidebar.contains(event.target) &&
            !menuButton?.contains(event.target)
        ) {
            sidebar.classList.remove("open");
        }
    });
}

function init() {
    applyTheme();
    initMobileMenu();
    bindThemeButton();

    initRouter(renderPage);

    refresh();
    renderPage("dashboard");

    if (window.lucide) {
        window.lucide.createIcons();
    }

    window.addEventListener("codequest:pagechange", event => {
        renderPage(event.detail.page);

        if (window.lucide) {
            window.lucide.createIcons();
        }
    });

    console.log("CodeQuest Academy запущена.");
}

init();
