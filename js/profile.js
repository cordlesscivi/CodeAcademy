
const LEVELS = [
    "Новичок",
    "Ученик",
    "Практикант",
    "Разработчик",
    "Продвинутый разработчик",
    "Мастер кода",
    "Эксперт",
    "Архитектор",
    "Легенда программирования"
];

export function getLevel(xp = 0) {
    const safeXP = Math.max(0, Number(xp) || 0);
    const level = Math.floor(safeXP / 100) + 1;

    return {
        level,
        name: LEVELS[Math.min(level - 1, LEVELS.length - 1)],
        currentXP: safeXP % 100,
        totalXP: safeXP,
        nextLevelXP: 100
    };
}

export function registerVisit(state) {
    const today = new Date().toLocaleDateString("en-CA");

    if (!state.lastVisit) {
        state.streak = 1;
    } else if (state.lastVisit !== today) {
        const previous = new Date(`${state.lastVisit}T00:00:00`);
        const current = new Date(`${today}T00:00:00`);

        const difference = Math.round(
            (current - previous) / 86400000
        );

        if (difference === 1) {
            state.streak = (Number(state.streak) || 0) + 1;
        } else if (difference > 1) {
            state.streak = 1;
        }
    }

    state.lastVisit = today;

    return state;
}

export function getProgressPercent(xp = 0) {
    return getLevel(xp).currentXP;
}
