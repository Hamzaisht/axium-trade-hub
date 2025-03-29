
import { Sidebar } from "@/components/layout/Sidebar";
import { ReactNode } from "react";

interface LayoutShellProps {
  children: ReactNode;
}

export function LayoutShell({ children }: LayoutShellProps) {
  return (
    <div className="flex min-h-screen bg-[#0B0F1A] text-white">
      <Sidebar />
      <div className="flex-1 p-3 md:p-4">
        {children}
      </div>
    </div>
  );
}
