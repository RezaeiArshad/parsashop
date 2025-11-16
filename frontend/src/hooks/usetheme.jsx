// hooks/useTheme.js
import { useEffect, useState } from 'react';

const THEME_KEY = 'theme';
const THEME_DIV_ID = 'theme-div'; // or 'html', 'body' — see note below

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    // Initialize from localStorage or system preference
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    // Optional: fallback to system preference
    if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    // Update DOM class
    const el =
      document.getElementById(THEME_DIV_ID) || document.documentElement;
    if (theme === 'dark') {
      el.classList.add('dark');
    } else {
      el.classList.remove('dark');
    }

    // Persist
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
}
