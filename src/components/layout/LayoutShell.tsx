
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
      "flex min-h-screen transition-all duration-500",
      "bg-[#F7F9FB] dark:bg-[#0B0F1A]",
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
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,207,255,0.1),transparent_70%)] pointer-events-none animate-pulse duration-[3000ms]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,255,208,0.15),transparent_70%)] pointer-events-none blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(227,78,255,0.1),transparent_70%)] pointer-events-none blur-2xl" />
          </>
        )}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
