
const STORAGE_KEY = "codequest-academy-state";

function createDefaultState() {
    return {
        xp: 0,
        lessons: [],
        achievements: [],
        completedProjects: [],
        completedPractice: [],
        streak: 0,
        lastVisit: null,
        theme: "dark",
        name: "Будущий разработчик",
        avatar: "👨‍💻",
        lastLessonId: null,
        quiz: null
    };
}

export function loadState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) return createDefaultState();

        const parsed = JSON.parse(saved);

        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
            return createDefaultState();
        }

        const defaults = createDefaultState();

        return {
            ...defaults,
            ...parsed,
            xp: Math.max(0, Number(parsed.xp) || 0),
            streak: Math.max(0, Number(parsed.streak) || 0),
            lessons: Array.isArray(parsed.lessons) ? parsed.lessons : [],
            achievements: Array.isArray(parsed.achievements)
                ? parsed.achievements
                : [],
            completedProjects: Array.isArray(parsed.completedProjects)
                ? parsed.completedProjects
                : [],
            completedPractice: Array.isArray(parsed.completedPractice)
                ? parsed.completedPractice
                : []
        };
    } catch (error) {
        console.error("Ошибка загрузки прогресса:", error);
        return createDefaultState();
    }
}

export function saveState(state) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        return true;
    } catch (error) {
        console.error("Ошибка сохранения прогресса:", error);
        return false;
    }
}

export function resetState() {
    const state = createDefaultState();
    saveState(state);
    return state;
}
