
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
      
      // Apply dark mode specific animations and effects
      const overlay = document.createElement('div');
      overlay.classList.add('fixed', 'inset-0', 'pointer-events-none', 'z-[-1]');
      overlay.style.background = 'radial-gradient(circle at 10% 30%, rgba(0,207,255,0.07), transparent 70%)';
      document.body.appendChild(overlay);
      
      return () => {
        document.body.removeChild(overlay);
      };
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('cyberpunk-grid', 'dark-mode-transition');
    }
  }, [theme]);

  const toggleTheme = () => {
    // Add flash animation effect during theme toggle
    const flash = document.createElement('div');
    flash.classList.add('fixed', 'inset-0', 'bg-white', 'z-[9999]', 'pointer-events-none');
    flash.style.opacity = '0.1';
    document.body.appendChild(flash);
    
    setTimeout(() => {
      document.body.removeChild(flash);
      setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
    }, 50);
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
