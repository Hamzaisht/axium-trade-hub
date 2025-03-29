
import { ReactNode } from "react";
import { PriceTickerScroll } from "@/components/market/PriceTickerScroll";
import { LiveChart } from "@/components/market/LiveChart";
import { MarketFeed } from "@/components/market/MarketFeed";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

interface DashboardShellProps {
  children: ReactNode;
  className?: string;
}

export function DashboardShell({ children, className = "" }: DashboardShellProps) {
  return (
    <TooltipProvider>
      <div className={`flex flex-col min-h-screen bg-zinc-900 text-white ${className}`}>
        <div className="bg-zinc-800 border-b border-zinc-700 py-1 px-2">
          <div className="flex items-center gap-2 h-10 px-4">
            <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cyan-400">
              <path d="M14 3L25 20H3L14 3Z" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M14 8L20 18H8L14 8Z" fill="currentColor" />
            </svg>
            <span className="text-sm font-semibold tracking-wide text-cyan-400">AXIUM TRADING DASHBOARD</span>
          </div>
        </div>
        
        <PriceTickerScroll className="mb-4" />
        
        <div className="flex-1 container mx-auto px-4 md:px-6 py-4">
          {children}
        </div>
        
        <Toaster />
      </div>
    </TooltipProvider>
  );
}
