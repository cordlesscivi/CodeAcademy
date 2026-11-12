
const PAGE_NAMES = {
    dashboard: "Главная",
    courses: "Все курсы",
    practice: "Практика",
    projects: "Проекты",
    quiz: "Тесты",
    achievements: "Достижения",
    statistics: "Статистика",
    profile: "Мой профиль"
};

export function navigate(page) {
    if (!PAGE_NAMES[page]) {
        return;
    }

    const target = document.getElementById(`page-${page}`);

    if (!target) {
        return;
    }

    document.querySelectorAll(".page").forEach(element => {
        element.classList.remove("active");
    });

    target.classList.add("active");

    document.querySelectorAll(".nav-item[data-page]").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.page === page
        );
    });

    const pageTitle = document.getElementById("pageTitle");

    if (pageTitle) {
        pageTitle.textContent = PAGE_NAMES[page];
    }

    document.getElementById("sidebar")?.classList.remove("open");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    window.dispatchEvent(
        new CustomEvent("codequest:pagechange", {
            detail: { page }
        })
    );
}

export function initRouter(onPageChange) {
    document.querySelectorAll("[data-page]").forEach(button => {
        button.addEventListener("click", () => {
            const page = button.dataset.page;

            navigate(page);

            if (typeof onPageChange === "function") {
                onPageChange(page);
            }
        });
    });

    navigate("dashboard");
}
