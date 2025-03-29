
import { ReactNode } from "react";
import { PriceTickerScroll } from "@/components/market/PriceTickerScroll";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  children: ReactNode;
  className?: string;
}

export function DashboardShell({ children, className = "" }: DashboardShellProps) {
  return (
    <TooltipProvider>
      <div className={cn(
        "flex flex-col min-h-screen transition-colors duration-500",
        "bg-[#F7F9FB] dark:bg-[#0B0F1A]",
        className
      )}>
        <div className="bg-[#161B22] border-b border-[#292F36] py-2">
          <div className="flex items-center gap-3 h-12 px-6 max-w-[1400px] mx-auto">
            <div className="flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" 
                className="text-[#00CFFF] animate-pulse">
                <path d="M14 3L25 20H3L14 3Z" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M14 8L20 18H8L14 8Z" fill="currentColor" />
              </svg>
              <span className="text-sm font-bold tracking-wider bg-gradient-to-r from-[#00CFFF] to-[#00FFD0] bg-clip-text text-transparent">
                AXIUM TRADING
              </span>
            </div>
            <div className="h-6 w-[1px] bg-[#292F36] mx-2" />
            <span className="text-xs text-[#B0B6BE] tracking-wider">NEXT-GEN CREATOR ECONOMY</span>
          </div>
        </div>
        
        <PriceTickerScroll className="backdrop-blur-md bg-white/5 border-b border-[#292F36]" />
        
        <div className="flex-1 container mx-auto px-4 md:px-6 py-4 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,207,255,0.07),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,255,208,0.05),transparent_50%)]" />
          <div className="relative z-10">
            {children}
          </div>
        </div>
        
        <Toaster />
      </div>
    </TooltipProvider>
  );
}
