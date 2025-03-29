
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  // Initialize theme based on saved preference or default to dark
  useEffect(() => {
    const savedTheme = localStorage.getItem('axium-theme') as Theme;
    setTheme(savedTheme || 'dark'); // Default to dark mode
  }, []);

  // Apply theme class to document and save to localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('axium-theme', theme);
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('cyberpunk-grid', 'dark-mode-transition');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('cyberpunk-grid', 'dark-mode-transition');
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
