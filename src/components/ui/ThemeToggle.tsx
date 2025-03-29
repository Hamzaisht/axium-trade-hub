
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
      className={`relative transition-all duration-500 overflow-hidden group ${className} hover:shadow-[0_0_15px_rgba(0,207,255,0.3)]`}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-[#00CFFF]/10 to-[#00FFD0]/10 dark:from-[#00FFD0]/20 dark:to-[#00CFFF]/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ 
          opacity: theme === 'dark' ? 0 : 1, 
          scale: theme === 'dark' ? 0 : 1,
          rotate: theme === 'dark' ? -45 : 0
        }}
        transition={{ duration: 0.4, type: "spring" }}
      >
        <Sun className="h-5 w-5 text-[#FFD700]" />
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
        <Moon className="h-5 w-5 text-[#00CFFF]" />
      </motion.div>
    </Button>
  );
}
