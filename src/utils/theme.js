const STORAGE_KEY = 'loot-sheet-theme';

export function getInitialTheme() {
    if (typeof window === 'undefined') return 'dark';
    return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark';
}

export function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
}

export function toggleTheme(currentTheme) {
    return currentTheme === 'dark' ? 'light' : 'dark';
}
