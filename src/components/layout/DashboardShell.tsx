
import { ReactNode } from "react";
import { PriceTickerScroll } from "@/components/market/PriceTickerScroll";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";

interface DashboardShellProps {
  children: ReactNode;
  className?: string;
}

export function DashboardShell({ children, className = "" }: DashboardShellProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <TooltipProvider>
      <div className={cn(
        "flex flex-col min-h-screen transition-colors duration-500",
        "bg-[#F7F9FB] dark:bg-[#0B0F1A]",
        className
      )}>
        <header className="bg-[#161B22] border-b border-[#292F36] py-2 relative">
          {isDark && (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-axium-neon-blue/5 via-transparent to-axium-neon-mint/5 opacity-30"></div>
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-axium-neon-blue/30 to-transparent"></div>
            </>
          )}
          
          <div className="flex items-center gap-3 h-12 px-6 max-w-[1400px] mx-auto relative z-10">
            <div className="flex items-center gap-3">
              <motion.svg 
                width="24" 
                height="24" 
                viewBox="0 0 28 28" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-axium-neon-blue"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <path d="M14 3L25 20H3L14 3Z" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M14 8L20 18H8L14 8Z" fill="currentColor" />
              </motion.svg>
              <span className="text-sm font-bold tracking-wider bg-gradient-to-r from-axium-neon-blue to-axium-neon-mint bg-clip-text text-transparent">
                AXIUM TRADING
              </span>
            </div>
            <div className="h-6 w-[1px] bg-[#292F36] mx-2"></div>
            <span className="text-xs text-[#B0B6BE] tracking-wider">NEXT-GEN CREATOR ECONOMY</span>
          </div>
        </header>
        
        <PriceTickerScroll className="backdrop-blur-md bg-white/5 border-b border-[#292F36]" />
        
        <div className="flex-1 container mx-auto px-4 md:px-6 py-4 relative">
          {isDark && (
            <>
              {/* Dynamic animated cyberpunk background elements */}
              <motion.div 
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,207,255,0.07),transparent_50%)]"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,255,208,0.05),transparent_50%)]"
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
              <motion.div 
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(227,78,255,0.03),transparent_70%)]"
                animate={{ opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              />
              
              {/* Digital noise overlay */}
              <div className="absolute inset-0 digital-noise opacity-5 pointer-events-none"></div>
              
              {/* Grid pattern */}
              <div className="absolute inset-0 cyberpunk-grid opacity-30 pointer-events-none"></div>
            </>
          )}
          <div className="relative z-10">
            {children}
          </div>
        </div>
        
        <Toaster />
      </div>
    </TooltipProvider>
  );
}
