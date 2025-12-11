import { useEffect, useState, useLayoutEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    // Initialize from localStorage or system preference
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    // fallback to system preference
    if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const el =
      document.getElementsByClassName('theme-div')[0] ||
      document.documentElement;
    if (theme === 'dark') {
      el.classList.add('dark');
      document.body.style.backgroundColor = '#121212';
    } else {
      el.classList.remove('dark');
      document.body.style.backgroundColor = '#ffffff';
    }
    // Persist
    localStorage.setItem('theme', theme);
  }, [theme]);

  useLayoutEffect(() => {
    const el =
      document.getElementsByClassName('theme-div')[0] ||
      document.documentElement;
    if (theme === 'dark') {
      el.classList.add('dark');
      document.body.style.backgroundColor = '#121212';
    } else {
      el.classList.remove('dark');
      document.body.style.backgroundColor = '#ffffff';
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
}
