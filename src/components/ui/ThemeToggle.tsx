
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={`relative transition-all duration-500 overflow-hidden group ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-axium-neon-blue/10 to-axium-neon-gold/10 dark:from-axium-neon-mint/20 dark:to-axium-neon-blue/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ 
          opacity: theme === 'dark' ? 0 : 1, 
          scale: theme === 'dark' ? 0 : 1,
          rotate: theme === 'dark' ? -45 : 0
        }}
        transition={{ duration: 0.4, type: "spring" }}
      >
        <Sun className="h-5 w-5 text-axium-neon-gold" />
      </motion.div>
      
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ 
          opacity: theme === 'dark' ? 1 : 0, 
          scale: theme === 'dark' ? 1 : 0,
          rotate: theme === 'dark' ? 0 : 45
        }}
        transition={{ duration: 0.4, type: "spring" }}
      >
        <Moon className="h-5 w-5 text-axium-neon-blue" />
      </motion.div>
    </Button>
  );
}
