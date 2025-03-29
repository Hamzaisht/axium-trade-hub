
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "dark" | "blue" | "gold" | "mint";
  interactive?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  size?: "sm" | "md" | "lg" | "xl"; // Add size prop
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
  const baseClasses = cn(
    "rounded-lg p-4 transition-all duration-300",
    interactive && "cursor-pointer hover:translate-y-[-2px]",
    // Add size-based padding
    size === "sm" && "p-3",
    size === "md" && "p-4",
    size === "lg" && "p-5",
    size === "xl" && "p-6",
    className
  );
  
  const variantClasses = {
    default: "bg-white/70 backdrop-blur-md border border-axium-gray-200/50 shadow-glass dark:bg-axium-gray-800/40 dark:border-axium-gray-700/20",
    dark: "bg-axium-gray-800/70 backdrop-blur-md border border-axium-gray-700/30 shadow-glass dark:bg-black/40 dark:border-axium-gray-700/40",
    blue: "bg-white/70 backdrop-blur-md border border-axium-neon-blue/30 shadow-neon-blue dark:bg-axium-gray-800/40 dark:border-axium-neon-blue/40",
    gold: "bg-white/70 backdrop-blur-md border border-axium-neon-gold/30 shadow-neon-gold dark:bg-axium-gray-800/40 dark:border-axium-neon-gold/40",
    mint: "bg-white/70 backdrop-blur-md border border-axium-neon-mint/30 shadow-neon-mint dark:bg-axium-gray-800/40 dark:border-axium-neon-mint/40"
  };
  
  return (
    <div 
      className={cn(baseClasses, variantClasses[variant])}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
}

export type { GlassCardProps };
