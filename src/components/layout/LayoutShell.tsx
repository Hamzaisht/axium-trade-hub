
import { Sidebar } from "@/components/layout/Sidebar";
import { ReactNode } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LayoutShellProps {
  children: ReactNode;
  className?: string;
}

export function LayoutShell({ children, className = "" }: LayoutShellProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div className={cn(
      "flex min-h-screen transition-all duration-500",
      "bg-[#F7F9FB] dark:bg-[#0A0A0D]", // Updated to obsidian black in dark mode
      isDark && [
        "cyberpunk-grid",
        "bg-[linear-gradient(to_right,rgba(0,207,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,207,255,0.03)_1px,transparent_1px)]",
        "bg-[size:24px_24px]"
      ].join(' '),
      className
    )}>
      <Sidebar />
      <div className={cn(
        "flex-1 overflow-auto p-4 md:p-6 transition-all duration-300 relative",
        isDark && "bg-[radial-gradient(ellipse_at_top_right,rgba(0,207,255,0.07),transparent_70%)]"
      )}>
        {isDark && (
          <>
            {/* Dynamic animated cyberpunk background elements */}
            <motion.div 
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,207,255,0.1),transparent_70%)] pointer-events-none"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,255,208,0.15),transparent_70%)] pointer-events-none blur-3xl"
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.div 
              className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(227,78,255,0.1),transparent_70%)] pointer-events-none blur-2xl"
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
            
            {/* Subtle animated scan lines */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <motion.div 
                className="w-full h-[1px] bg-axium-neon-blue/10"
                animate={{ top: ["0%", "100%"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{ position: "absolute" }}
              />
            </div>
          </>
        )}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
