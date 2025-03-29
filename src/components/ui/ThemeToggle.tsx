
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`relative transition-all duration-500 overflow-hidden group ${className} hover:shadow-[0_0_15px_rgba(0,207,255,0.3)]`}
    >
      {/* 3D effect on hover - interactive Oracle effect */}
      {isHovering && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-axium-neon-blue/20 to-axium-neon-mint/20 rounded-full z-0"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [0.8, 1.1, 1], 
            opacity: 1,
            rotateZ: [0, 10, 0, -10, 0],
            rotateY: [0, 30, 0, -30, 0]
          }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror" }}
        />
      )}
      
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-axium-neon-blue/10 to-axium-neon-mint/10 dark:from-axium-neon-blue/20 dark:to-axium-neon-mint/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Sun icon with animation */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ 
          opacity: theme === 'dark' ? 0 : 1, 
          scale: theme === 'dark' ? 0 : 1,
          rotate: theme === 'dark' ? -45 : 0,
          z: theme === 'dark' ? -10 : 10
        }}
        transition={{ duration: 0.4, type: "spring" }}
      >
        <Sun className="h-5 w-5 text-axium-neon-gold" />
      </motion.div>
      
      {/* Moon icon with animation */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ 
          opacity: theme === 'dark' ? 1 : 0, 
          scale: theme === 'dark' ? 1 : 0,
          rotate: theme === 'dark' ? 0 : 45,
          z: theme === 'dark' ? 10 : -10
        }}
        transition={{ duration: 0.4, type: "spring" }}
      >
        <Moon className="h-5 w-5 text-axium-neon-blue" />
      </motion.div>
      
      {/* 3D rotation on hover */}
      <motion.div 
        className="absolute inset-0 rounded-full"
        animate={isHovering ? { 
          rotateY: [0, 15, 0, -15, 0],
          rotateX: [0, 10, 0, -10, 0],
          z: 20
        } : {
          rotateY: 0,
          rotateX: 0,
          z: 0
        }}
        transition={{ duration: 2, repeat: isHovering ? Infinity : 0, repeatType: "mirror" }}
      />
      
      {/* Glow effect on hover (visible in dark mode) */}
      <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md bg-axium-neon-blue/20 dark:bg-axium-neon-blue/30"></div>
    </Button>
  );
}
