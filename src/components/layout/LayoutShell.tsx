
import { Sidebar } from "@/components/layout/Sidebar";
import { ReactNode } from "react";

interface LayoutShellProps {
  children: ReactNode;
}

export function LayoutShell({ children }: LayoutShellProps) {
  return (
    <div className="flex min-h-screen bg-[#080B14] text-white">
      <Sidebar />
      <div className="flex-1 overflow-hidden flex flex-col">
        {children}
      </div>
    </div>
  );
}
