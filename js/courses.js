
import { COURSES } from "../data/courses.js";
import { getLevel } from "./profile.js";

export function createCourseSystem({
                                       getState,
                                       saveState,
                                       refresh,
                                       showToast
                                   }) {
    const page = document.getElementById("page-courses");

    let currentCourse = null;
    let currentLesson = null;

    function isCompleted(lessonId) {
        return getState().lessons.includes(lessonId);
    }

    function getCourseProgress(course) {
        const completed = course.lessons.filter(lesson =>
            isCompleted(lesson.id)
        ).length;

        return {
            completed,
            total: course.lessons.length,
            percent: course.lessons.length
                ? Math.round(completed / course.lessons.length * 100)
                : 0
        };
    }

    function renderCatalog() {
        currentCourse = null;
        currentLesson = null;

        page.innerHTML = `
            <div class="page-heading">
                <span class="eyebrow">БИБЛИОТЕКА ЗНАНИЙ</span>
                <h1>Все курсы</h1>
                <p>Выбирай направление и осваивай новые технологии.</p>
            </div>

            <div class="filter-bar">
                <input type="search" id="courseSearch"
                    placeholder="Найти курс...">

                <select id="courseCategory">
                    <option value="all">Все направления</option>
                    <option value="language">Языки</option>
                    <option value="database">Базы данных</option>
                    <option value="framework">Фреймворки</option>
                    <option value="tools">Инструменты</option>
                </select>
            </div>

            <div class="catalog-grid" id="courseCatalog"></div>
        `;

        const search = page.querySelector("#courseSearch");
        const category = page.querySelector("#courseCategory");
        const catalog = page.querySelector("#courseCatalog");

        function draw() {
            const query = search.value.trim().toLowerCase();

            const filtered = COURSES.filter(course => {
                const matchesName =
                    course.title.toLowerCase().includes(query) ||
                    course.description.toLowerCase().includes(query);

                const matchesCategory =
                    category.value === "all" ||
                    course.category === category.value;

                return matchesName && matchesCategory;
            });

            catalog.innerHTML = filtered.map(course => {
                const progress = getCourseProgress(course);
                const available = course.lessons.length > 0;

                return `
                    <article class="learning-card">
                        <div class="learning-card-top">
                            <div class="learning-icon">${course.icon}</div>
                            <span class="level-label">${course.level}</span>
                        </div>

                        <h2>${course.title}</h2>
                        <p>${course.description}</p>

                        <div class="learning-progress-info">
                            <span>
                                ${available
                    ? `${progress.completed} из ${progress.total} уроков`
                    : "Материалы готовятся"}
                            </span>
                            <strong>${progress.percent}%</strong>
                        </div>

                        <div class="progress-track">
                            <div class="progress-fill"
                                style="width:${progress.percent}%"></div>
                        </div>

                        <button class="btn-primary full-width"
                            data-open-course="${course.id}"
                            ${available ? "" : "disabled"}>
                            ${available ? "Открыть курс →" : "Скоро"}
                        </button>
                    </article>
                `;
            }).join("");

            if (!filtered.length) {
                catalog.innerHTML =
                    `<div class="course-empty">Ничего не найдено.</div>`;
            }
        }

        search.addEventListener("input", draw);
        category.addEventListener("change", draw);

        catalog.addEventListener("click", event => {
            const button = event.target.closest("[data-open-course]");
            if (!button) return;

            openCourse(button.dataset.openCourse);
        });

        draw();
    }

    function openCourse(courseId) {
        currentCourse = COURSES.find(course => course.id === courseId);

        if (!currentCourse) return;

        currentLesson = null;

        const progress = getCourseProgress(currentCourse);

        page.innerHTML = `
            <button class="back-btn" id="backToCatalog">
                ← Все курсы
            </button>

            <div class="course-detail-heading">
                <div class="learning-icon large">${currentCourse.icon}</div>

                <div>
                    <span class="eyebrow">УЧЕБНЫЙ КУРС</span>
                    <h1>${currentCourse.title}</h1>
                    <p>${currentCourse.description}</p>
                </div>
            </div>

            <div class="course-xp">
                ⚡ <strong>${getState().xp} XP</strong>
                <span>Твой опыт</span>
            </div>

            <div class="learning-progress-info">
                <span>Прогресс курса</span>
                <strong>${progress.completed}/${progress.total}</strong>
            </div>

            <div class="progress-track">
                <div class="progress-fill"
                    style="width:${progress.percent}%"></div>
            </div>

            <div class="lesson-list">
                ${currentCourse.lessons.map((lesson, index) => {
            const completed = isCompleted(lesson.id);
            const unlocked = index === 0 ||
                isCompleted(currentCourse.lessons[index - 1].id);

            return `
                        <button class="lesson-row"
                            data-open-lesson="${lesson.id}"
                            ${unlocked ? "" : "disabled"}
                            style="${unlocked ? "" : "opacity:.45;cursor:not-allowed"}">

                            <span class="lesson-number">
                                ${completed ? "✓" : index + 1}
                            </span>

                            <span class="lesson-row-content">
                                <strong>${lesson.title}</strong>
                                <small>${lesson.duration}</small>
                            </span>

                            <span class="lesson-status">
                                ${completed ? "Пройдено" : unlocked ? "Начать →" : "Закрыто 🔒"}
                            </span>
                        </button>
                    `;
        }).join("")}
            </div>
        `;

        page.querySelector("#backToCatalog").addEventListener(
            "click",
            renderCatalog
        );

        page.querySelectorAll("[data-open-lesson]").forEach(button => {
            button.addEventListener("click", () => {
                openLesson(button.dataset.openLesson);
            });
        });
    }

    function openLesson(lessonId) {
        currentLesson = currentCourse.lessons.find(
            lesson => lesson.id === lessonId
        );

        if (!currentLesson) return;

        const state = getState();
        state.lastLessonId = lessonId;
        saveState(state);

        const completed = isCompleted(lessonId);

        page.innerHTML = `
            <div class="lesson-content">
                <button class="back-btn" id="backToLessons">
                    ← К списку уроков
                </button>

                <span class="eyebrow">${currentCourse.title.toUpperCase()}</span>

                <h1>${currentLesson.title}</h1>

                <p class="lesson-duration">
                    ⏱ ${currentLesson.duration}
                </p>

                <div class="theory-block">
                    ${currentLesson.theory.map(section => `
                        <section>
                            <h2>${section.title}</h2>
                            <p>${section.text}</p>
                        </section>
                    `).join("")}
                </div>

                <h2>Пример кода</h2>

                <pre class="code-example"><code>${escapeHTML(currentLesson.example)}</code></pre>

                <div class="task-panel">
                    <h2>Практическое задание</h2>

                    <p>${currentLesson.task.question}</p>

                    <textarea id="lessonAnswer"
                        placeholder="Напиши своё решение..."></textarea>

                    <button class="secondary-button" id="showHint">
                        💡 Показать подсказку
                    </button>

                    <p id="lessonHint" hidden>
                        ${currentLesson.task.hint}
                    </p>

                    <div id="answerFeedback"
                        class="answer-feedback"></div>

                    <button class="btn-primary full-width"
                        id="checkAnswer">
                        Проверить ответ
                    </button>

                    <button class="complete-btn"
                        id="completeLesson"
                        ${completed ? "disabled" : "hidden"}>
                        ${completed ? "✓ Урок завершён" : "Завершить урок"}
                    </button>
                </div>
            </div>
        `;

        page.querySelector("#backToLessons").addEventListener(
            "click",
            () => openCourse(currentCourse.id)
        );

        page.querySelector("#showHint").addEventListener("click", () => {
            page.querySelector("#lessonHint").hidden = false;
        });

        page.querySelector("#checkAnswer").addEventListener(
            "click",
            checkAnswer
        );

        page.querySelector("#completeLesson").addEventListener(
            "click",
            completeLesson
        );

        if (completed) {
            const feedback = page.querySelector("#answerFeedback");
            feedback.textContent = "Этот урок уже пройден.";
            feedback.className = "answer-feedback success";
        }
    }

    function normalizeAnswer(value) {
        return value
            .trim()
            .replace(/\s+/g, " ")
            .replace(/;$/, "")
            .replace(/'/g, '"');
    }

    function checkAnswer() {
        const input = page.querySelector("#lessonAnswer");
        const feedback = page.querySelector("#answerFeedback");
        const completeButton = page.querySelector("#completeLesson");

        const userAnswer = normalizeAnswer(input.value);
        const correctAnswer = normalizeAnswer(
            currentLesson.task.answer
        );

        if (!userAnswer) {
            feedback.textContent = "Сначала напиши свой ответ.";
            feedback.className = "answer-feedback error";
            return;
        }

        if (userAnswer === correctAnswer) {
            feedback.textContent =
                "✓ Правильно! Теперь можешь завершить урок.";
            feedback.className = "answer-feedback success";
            completeButton.hidden = false;
        } else {
            feedback.textContent =
                "Пока неверно. Проверь синтаксис и попробуй ещё раз.";
            feedback.className = "answer-feedback error";
            completeButton.hidden = true;
        }
    }

    function completeLesson() {
        if (!currentLesson || isCompleted(currentLesson.id)) return;

        const state = getState();

        state.lessons.push(currentLesson.id);
        state.xp += 50;

        if (state.xp >= 10 && !state.achievements.includes("first-xp")) {
            state.achievements.push("first-xp");
        }

        if (state.lessons.length >= 1 &&
            !state.achievements.includes("first-lesson")) {
            state.achievements.push("first-lesson");
        }

        saveState(state);
        refresh();

        showToast("Урок завершён! Получено 50 XP.");

        openCourse(currentCourse.id);
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

    function openCourseById(courseId) {
        const course = COURSES.find(item => item.id === courseId);

        if (!course || !course.lessons.length) {
            showToast("Этот курс пока готовится.");
            return;
        }

        openCourse(courseId);
    }

    function render() {
        renderCatalog();
    }

    return {
        render,
        openCourse: openCourseById,
        getCourses: () => COURSES
    };
}
