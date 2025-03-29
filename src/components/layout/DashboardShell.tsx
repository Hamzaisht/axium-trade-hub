
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
      <div className={`flex flex-col min-h-screen bg-[#0A0E17] text-white ${className}`}>
        <header className="bg-[#0D1424]/90 border-b border-[#1A2747] py-1 px-2 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center justify-between h-10 px-4">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#3AA0FF]">
                <path d="M14 3L25 20H3L14 3Z" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M14 8L20 18H8L14 8Z" fill="currentColor" />
              </svg>
              <span className="text-sm font-bold tracking-wide text-[#3AA0FF]">AXIUM TERMINAL</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-xs text-[#3AA0FF] bg-[#1A2747]/50 px-2 py-1 rounded">
                <span className="mr-1">●</span>LIVE
              </div>
              <div className="text-xs text-[#8A9CCC] bg-[#1A2747]/50 px-2 py-1 rounded hidden md:block">
                Market Status: <span className="text-green-400">Open</span>
              </div>
            </div>
          </div>
        </header>
        
        <PriceTickerScroll className="mb-0 border-b border-[#1A2747] bg-[#0D1424]" />
        
        <div className="flex-1 px-2 py-3 overflow-auto">
          {children}
        </div>
        
        <footer className="bg-[#0D1424] border-t border-[#1A2747] py-1 px-4 text-xs text-[#8A9CCC]">
          <div className="flex justify-between items-center">
            <div>Axium Trading Platform v1.0</div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-400 mr-1"></span>
                API Connected
              </div>
              <div>Last Update: {new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </footer>
        
        <Toaster />
      </div>
    </TooltipProvider>
  );
}
