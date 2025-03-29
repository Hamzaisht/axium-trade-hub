
import { Sidebar } from "@/components/layout/Sidebar";
import { ReactNode } from "react";

interface LayoutShellProps {
  children: ReactNode;
  className?: string;
}

export function LayoutShell({ children, className = "" }: LayoutShellProps) {
  return (
    <div className="flex min-h-screen bg-axium-gray-100/30 dark:bg-axium-dark-bg/70 transition-colors duration-300">
      <Sidebar />
      <div className={`flex-1 overflow-auto p-4 md:p-6 ${className}`}>
        {children}
      </div>
    </div>
  );
}
