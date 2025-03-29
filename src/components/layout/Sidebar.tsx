
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  LineChart, 
  Briefcase, 
  Star, 
  Settings,
  Menu,
  X,
  Bell,
  Users,
  Sun,
  Moon
} from "lucide-react";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon: Icon, label, href, isActive, onClick }: SidebarItemProps) => {
  return (
    <motion.a 
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.98 }}
      href={href} 
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-all",
        isActive 
          ? "bg-gradient-to-r dark:from-[#1A2747]/80 dark:to-[#1A2747]/10 from-blue-50 to-blue-50/20 text-blue-600 dark:text-[#3AA0FF] border-l-2 border-blue-600 dark:border-[#3AA0FF]" 
          : "text-gray-700 dark:text-[#8A9CCC] hover:bg-blue-50/50 dark:hover:bg-[#1A2747]/30 hover:text-blue-600 dark:hover:text-white"
      )}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{label}</span>
      
      {isActive && (
        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-[#3AA0FF]"></div>
      )}
    </motion.a>
  );
};

export function Sidebar() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);
  const { theme, toggleTheme } = useTheme();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsOpen(true);
      } else if (window.innerWidth < 768 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const navigationItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: LineChart, label: "Trading", href: "/trading" },
    { icon: Briefcase, label: "Portfolio", href: "/portfolio" },
    { icon: Star, label: "Creators", href: "/creators" },
    { icon: Users, label: "Social", href: "/social" },
    { icon: Bell, label: "Alerts", href: "/alerts" },
    { icon: Settings, label: "Settings", href: "/settings" }
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-4 left-4 z-50 md:hidden text-gray-800 dark:text-white" 
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <motion.aside 
        initial={{ x: isMobile ? -320 : 0 }}
        animate={{ x: (isMobile && !isOpen) ? -320 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-64 bg-white dark:bg-[#0D1424] border-r border-gray-200 dark:border-[#1A2747] shadow-xl",
          "md:relative md:shadow-none"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b border-gray-200 dark:border-[#1A2747] px-4 bg-gray-50 dark:bg-[#0A0E17]">
            <div className="flex items-center">
              <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600 dark:text-[#3AA0FF] mr-2">
                <path d="M14 3L25 20H3L14 3Z" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M14 8L20 18H8L14 8Z" fill="currentColor" />
              </svg>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-wider">AXIUM</h2>
            </div>
            
            {/* Theme toggle in sidebar header - visible on mobile when sidebar is open */}
            <button
              onClick={toggleTheme}
              className="ml-auto md:hidden p-1.5 rounded-full bg-gray-100 dark:bg-[#1A2747] hover:bg-gray-200 dark:hover:bg-[#243762]"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-[#FFD700]" />
              ) : (
                <Moon className="h-4 w-4 text-blue-600" />
              )}
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
            <div className="space-y-1.5">
              <h3 className="text-xs uppercase text-gray-500 dark:text-[#8A9CCC] font-semibold tracking-wider px-3">Main Navigation</h3>
              {navigationItems.slice(0, 4).map((item) => (
                <SidebarItem
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  isActive={location.pathname === item.href}
                  onClick={isMobile ? () => setIsOpen(false) : undefined}
                />
              ))}
            </div>
            
            <div className="space-y-1.5">
              <h3 className="text-xs uppercase text-gray-500 dark:text-[#8A9CCC] font-semibold tracking-wider px-3">Tools</h3>
              {navigationItems.slice(4).map((item) => (
                <SidebarItem
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  isActive={location.pathname === item.href}
                  onClick={isMobile ? () => setIsOpen(false) : undefined}
                />
              ))}
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-[#1A2747] p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-[#3AA0FF] dark:to-[#2D7DD2] flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Axium User</p>
                <p className="text-xs text-gray-500 dark:text-[#8A9CCC]">Pro Account</p>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
