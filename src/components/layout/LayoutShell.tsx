
import { Sidebar } from "@/components/layout/Sidebar";
import { ReactNode } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface LayoutShellProps {
  children: ReactNode;
  className?: string;
}

export function LayoutShell({ children, className = "" }: LayoutShellProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div className={cn(
      "flex min-h-screen transition-colors duration-500",
      "bg-axium-gray-100/30 dark:bg-axium-dark-bg/90",
      isDark && "cyberpunk-grid",
      className
    )}>
      <Sidebar />
      <div className={cn(
        "flex-1 overflow-auto p-4 md:p-6 transition-all duration-300",
        isDark && "relative"
      )}>
        {isDark && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.15),transparent_70%)] pointer-events-none"></div>
        )}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
