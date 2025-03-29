
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import useSound from 'use-sound';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
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
    
    // For our new design, we'll default to dark mode always
    const initialTheme = savedTheme || 'dark';
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

  // Theme toggle component - updated with neon glow effect
  const ThemeToggle: React.FC = () => {
    return (
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full bg-black/30 backdrop-blur-lg border border-[#1A2747]/50 hover:border-[#3676FF]/70 
                   transition-all duration-300 text-white shadow-lg hover:shadow-[0_0_15px_rgba(54,118,255,0.5)] group"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun className="h-5 w-5 text-[#FFD700] group-hover:rotate-45 transition-transform duration-300" />
        ) : (
          <Moon className="h-5 w-5 text-[#3676FF] group-hover:-rotate-12 transition-transform duration-300" />
        )}
      </button>
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, ThemeToggle }}>
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
