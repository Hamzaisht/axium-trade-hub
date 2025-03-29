
import { Sidebar } from "@/components/layout/Sidebar";
import { ReactNode } from "react";

interface LayoutShellProps {
  children: ReactNode;
}

export function LayoutShell({ children }: LayoutShellProps) {
  return (
    <div className="flex min-h-screen bg-axium-dark-bg relative">
      {/* Background grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(11,15,26,0.3)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(11,15,26,0.3)_1.5px,transparent_1.5px)] bg-[size:30px_30px] opacity-20 pointer-events-none z-0"></div>
      
      {/* Ambient glow effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-axium-blue/5 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-axium-neon-blue/5 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
      
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 relative z-10">
        {children}
      </div>
    </div>
  );
}
