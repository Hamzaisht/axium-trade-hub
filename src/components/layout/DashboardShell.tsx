
import { ReactNode } from "react";
import { PriceTickerScroll } from "@/components/market/PriceTickerScroll";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

interface DashboardShellProps {
  children: ReactNode;
  className?: string;
}

export function DashboardShell({ children, className = "" }: DashboardShellProps) {
  const { theme } = useTheme();
  
  return (
    <TooltipProvider>
      <div className={`flex flex-col min-h-screen bg-gray-50 dark:bg-[#080B14] text-gray-900 dark:text-white transition-colors duration-300 ${className}`}>
        <header className="bg-white/95 dark:bg-[#0C1221]/95 border-b border-gray-200 dark:border-[#1E375F] py-1 px-2 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center justify-between h-10 px-4">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600 dark:text-[#3676FF]">
                <path d="M14 3L25 20H3L14 3Z" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M14 8L20 18H8L14 8Z" fill="currentColor" />
              </svg>
              <span className="text-sm font-bold tracking-wide text-blue-600 dark:text-[#3676FF]">AXIUM TERMINAL</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-xs text-blue-600 dark:text-[#3676FF] bg-blue-50 dark:bg-[#1E375F]/70 px-2 py-1 rounded">
                <span className="mr-1">●</span>LIVE
              </div>
              <div className="text-xs text-gray-600 dark:text-[#8A9CCC] bg-gray-100 dark:bg-[#1E375F]/70 px-2 py-1 rounded hidden md:block">
                Market Status: <span className="text-green-600 dark:text-[#00C076]">Open</span>
              </div>
            </div>
          </div>
        </header>
        
        <PriceTickerScroll className="mb-0 border-b border-gray-200 dark:border-[#1E375F] bg-white/95 dark:bg-[#0C1221]" />
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 px-2 py-3 overflow-auto"
        >
          {children}
        </motion.div>
        
        <footer className="bg-white/95 dark:bg-[#0C1221] border-t border-gray-200 dark:border-[#1E375F] py-1 px-4 text-xs text-gray-600 dark:text-[#8A9CCC]">
          <div className="flex justify-between items-center">
            <div>Axium Trading Platform v1.0</div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-500 dark:bg-[#00C076] mr-1"></span>
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
