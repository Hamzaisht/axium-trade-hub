
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "dark" | "blue" | "gold" | "mint" | "magenta";
  interactive?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  size?: "sm" | "md" | "lg" | "xl";
  animateIn?: boolean;
}

export function GlassCard({ 
  children, 
  className = "", 
  variant = "default", 
  interactive = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  size = "md",
  animateIn = false
}: GlassCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const baseClasses = cn(
    "rounded-2xl transition-all duration-300 relative overflow-hidden backdrop-blur-md",
    interactive && "cursor-pointer hover:translate-y-[-2px] hover:bg-opacity-90",
    // Add size-based padding
    size === "sm" && "p-3",
    size === "md" && "p-4",
    size === "lg" && "p-5",
    size === "xl" && "p-6",
    isDark && interactive && "hover:shadow-[0_0_20px_rgba(0,207,255,0.3)]",
    className
  );
  
  // Enhanced variants with more cyberpunk styling in dark mode
  const variantClasses = {
    default: cn(
      "bg-white/70 backdrop-blur-md border border-zinc-200 shadow-glass",
      "dark:bg-axium-gray-800/40 dark:border-white/10 dark:shadow-glass-strong"
    ),
    dark: cn(
      "bg-axium-gray-800/70 backdrop-blur-md border border-white/10 shadow-glass",
      "dark:bg-black/40 dark:border-white/10 dark:shadow-glass-blue"
    ),
    blue: cn(
      "bg-white/70 backdrop-blur-md border border-axium-neon-blue/30 shadow-neon-blue",
      "dark:bg-axium-gray-800/30 dark:border-axium-neon-blue/40 dark:shadow-neon-blue"
    ),
    gold: cn(
      "bg-white/70 backdrop-blur-md border border-axium-neon-gold/30 shadow-neon-gold",
      "dark:bg-axium-gray-800/30 dark:border-axium-neon-gold/50 dark:shadow-neon-gold"
    ),
    mint: cn(
      "bg-white/70 backdrop-blur-md border border-axium-neon-mint/30 shadow-neon-mint",
      "dark:bg-axium-gray-800/30 dark:border-axium-neon-mint/50 dark:shadow-neon-mint"
    ),
    magenta: cn(
      "bg-white/70 backdrop-blur-md border border-axium-neon-magenta/30 shadow-neon-magenta",
      "dark:bg-axium-gray-800/30 dark:border-axium-neon-magenta/50 dark:shadow-neon-magenta"
    )
  };
  
  const cardContent = (
    <>
      {isDark && variant !== 'default' && (
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20"></div>
      )}
      
      {isDark && variant === 'blue' && (
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-axium-neon-blue/70 to-transparent"></div>
      )}
      
      {isDark && variant === 'gold' && (
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-axium-neon-gold/70 to-transparent"></div>
      )}
      
      {isDark && variant === 'mint' && (
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-axium-neon-mint/70 to-transparent"></div>
      )}
      
      {isDark && variant === 'magenta' && (
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-axium-neon-magenta/70 to-transparent"></div>
      )}
      
      {/* Digital noise overlay in dark mode */}
      {isDark && (
        <div className="absolute inset-0 digital-noise opacity-5 pointer-events-none"></div>
      )}
      
      <div className="relative z-10">{children}</div>
    </>
  );
  
  // If animateIn is true, wrap with motion.div
  if (animateIn) {
    return (
      <motion.div
        className={cn(baseClasses, variantClasses[variant])}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {cardContent}
      </motion.div>
    );
  }
  
  return (
    <div 
      className={cn(baseClasses, variantClasses[variant])}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {cardContent}
    </div>
  );
}

export type { GlassCardProps };
