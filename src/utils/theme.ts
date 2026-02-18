/**
 * Utility to manage theme (light/dark mode)
 */

export type Theme = 'light' | 'dark';

/**
 * Gets the theme from local storage or system preference
 */
export function getTheme(): Theme {
  if (typeof localStorage !== 'undefined') {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
  }

  if (typeof window !== 'undefined' && window.matchMedia) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }

  return 'light';
}

/**
 * Applies the theme to the document
 */
export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;

  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

/**
 * Initializes the theme toggle button
 */
export function setupThemeToggle(): void {
  if (typeof document === 'undefined') return;

  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  // Set initial state
  const isDark = document.documentElement.classList.contains('dark');
  toggle.setAttribute('aria-checked', isDark ? 'true' : 'false');

  // Handle clicks
  toggle.addEventListener('click', () => {
    const currentIsDark = document.documentElement.classList.contains('dark');
    const newTheme: Theme = currentIsDark ? 'light' : 'dark';

    applyTheme(newTheme);

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }

    toggle.setAttribute('aria-checked', newTheme === 'dark' ? 'true' : 'false');
  });
}

/**
 * Combined initialization function
 */
export function initTheme(): void {
  const theme = getTheme();
  applyTheme(theme);
}
