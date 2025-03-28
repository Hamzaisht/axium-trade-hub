
import { ReactNode } from "react";
import { PriceTickerScroll } from "@/components/market/PriceTickerScroll";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

interface DashboardShellProps {
  children: ReactNode;
  className?: string;
}

export function DashboardShell({ children, className = "" }: DashboardShellProps) {
  return (
    <TooltipProvider>
      <div className={`flex flex-col min-h-screen bg-axium-dark-bg text-white ${className}`}>
        <div className="bg-zinc-800/80 border-b border-zinc-700 py-1 px-2">
          <div className="flex items-center gap-2 h-10 px-4">
            <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-axium-neon-blue">
              <path d="M14 3L25 20H3L14 3Z" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M14 8L20 18H8L14 8Z" fill="currentColor" />
            </svg>
            <span className="text-sm font-semibold tracking-wide text-axium-neon-blue">AXIUM TRADING DASHBOARD</span>
          </div>
        </div>
        
        <PriceTickerScroll className="mb-0" />
        
        <div className="flex-1 container mx-auto px-2 py-3">
          {children}
        </div>
        
        <Toaster />
      </div>
    </TooltipProvider>
  );
}
