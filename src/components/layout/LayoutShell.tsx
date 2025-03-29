
import { Sidebar } from "@/components/layout/Sidebar";
import { ReactNode } from "react";

interface LayoutShellProps {
  children: ReactNode;
}

export function LayoutShell({ children }: LayoutShellProps) {
  return (
    <div className="flex min-h-screen bg-axium-gray-100/30">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6">
        {children}
      </div>
    </div>
  );
}
