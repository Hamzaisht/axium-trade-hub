
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "dark" | "blue" | "gold" | "mint";
  interactive?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  size?: "sm" | "md" | "lg" | "xl";
}

export function GlassCard({ 
  children, 
  className = "", 
  variant = "default", 
  interactive = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  size = "md"
}: GlassCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const baseClasses = cn(
    "rounded-lg transition-all duration-300 relative overflow-hidden",
    interactive && "cursor-pointer hover:translate-y-[-2px]",
    // Add size-based padding
    size === "sm" && "p-3",
    size === "md" && "p-4",
    size === "lg" && "p-5",
    size === "xl" && "p-6",
    isDark && interactive && "hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]",
    className
  );
  
  const variantClasses = {
    default: cn(
      "bg-white/70 backdrop-blur-md border border-axium-gray-200/50 shadow-glass",
      "dark:bg-axium-gray-800/40 dark:border-axium-gray-700/20 dark:shadow-glass-strong"
    ),
    dark: cn(
      "bg-axium-gray-800/70 backdrop-blur-md border border-axium-gray-700/30 shadow-glass",
      "dark:bg-black/40 dark:border-axium-gray-700/40 dark:shadow-glass-blue"
    ),
    blue: cn(
      "bg-white/70 backdrop-blur-md border border-axium-neon-blue/30 shadow-neon-blue",
      "dark:bg-axium-gray-800/40 dark:border-axium-neon-blue/40 dark:shadow-neon-blue"
    ),
    gold: cn(
      "bg-white/70 backdrop-blur-md border border-axium-neon-gold/30 shadow-neon-gold",
      "dark:bg-axium-gray-800/40 dark:border-axium-neon-gold/50 dark:shadow-neon-gold"
    ),
    mint: cn(
      "bg-white/70 backdrop-blur-md border border-axium-neon-mint/30 shadow-neon-mint",
      "dark:bg-axium-gray-800/40 dark:border-axium-neon-mint/50 dark:shadow-neon-mint"
    )
  };
  
  return (
    <div 
      className={cn(baseClasses, variantClasses[variant])}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {isDark && variant !== 'default' && (
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10"></div>
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
      
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export type { GlassCardProps };
