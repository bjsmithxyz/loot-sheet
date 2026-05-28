const STORAGE_KEY = 'loot-sheet-theme';

function readStoredTheme() {
    try {
        return localStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
}

function writeStoredTheme(theme) {
    try {
        localStorage.setItem(STORAGE_KEY, theme);
    } catch {
        // Private browsing or storage disabled — theme still applies for this session.
    }
}

export function getInitialTheme() {
    if (typeof window === 'undefined') return 'dark';
    return readStoredTheme() === 'light' ? 'light' : 'dark';
}

export function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    writeStoredTheme(theme);
}

export function toggleTheme(currentTheme) {
    return currentTheme === 'dark' ? 'light' : 'dark';
}
