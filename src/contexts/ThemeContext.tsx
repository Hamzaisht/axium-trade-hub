
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import useSound from 'use-sound';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  ThemeToggle: React.FC;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [playOn] = useSound('/sounds/switch-on.mp3', { volume: 0.5 });
  const [playOff] = useSound('/sounds/switch-off.mp3', { volume: 0.5 });

  useEffect(() => {
    // Check for system preference on first load
    const savedTheme = localStorage.getItem('axium-theme') as Theme;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = window.document.documentElement;
    
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    localStorage.setItem('axium-theme', newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    applyTheme(newTheme);
    
    // Play sound effect
    if (newTheme === 'dark') {
      playOn();
    } else {
      playOff();
    }
  };

  // Theme toggle component
  const ThemeToggle: React.FC = () => {
    return (
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full bg-gray-100 dark:bg-[#1A2747] hover:bg-gray-200 dark:hover:bg-[#243762] 
                   transition-all duration-300 text-gray-800 dark:text-white"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun className="h-5 w-5 text-[#FFD700] animate-theme-switch" />
        ) : (
          <Moon className="h-5 w-5 text-blue-600 animate-theme-switch" />
        )}
      </button>
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, ThemeToggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
