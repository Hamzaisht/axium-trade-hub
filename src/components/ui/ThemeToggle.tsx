
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
      className={`relative transition-all duration-500 ${className}`}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ opacity: theme === 'dark' ? 0 : 1, scale: theme === 'dark' ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <Sun className="h-5 w-5 text-axium-neon-gold" />
      </motion.div>
      
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ opacity: theme === 'dark' ? 1 : 0, scale: theme === 'dark' ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <Moon className="h-5 w-5 text-axium-neon-blue" />
      </motion.div>
    </Button>
  );
}
