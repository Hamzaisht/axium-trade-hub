
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark'); // Default to dark mode

  // Initialize theme based on saved preference or default to dark
  useEffect(() => {
    const savedTheme = localStorage.getItem('axium-theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Default to dark mode if no preference saved
      setTheme('dark');
      localStorage.setItem('axium-theme', 'dark');
    }
  }, []);

  // Apply theme class to document and save to localStorage
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('axium-theme', theme);
    
    // Set the background color on the body
    if (theme === 'dark') {
      document.body.style.backgroundColor = 'rgb(11, 15, 26)'; // Obsidian black (#0B0F1A)
    } else {
      document.body.style.backgroundColor = 'rgb(247, 249, 251)'; // Light white/gray (#F7F9FB)
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
