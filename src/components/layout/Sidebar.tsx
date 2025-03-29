
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
  X
} from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon: Icon, label, href, isActive, onClick }: SidebarItemProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <a 
      href={href} 
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-300 relative overflow-hidden group",
        isActive 
          ? "bg-primary/10 text-primary dark:bg-axium-neon-blue/20 dark:text-axium-neon-blue" 
          : "text-muted-foreground hover:bg-accent hover:text-foreground dark:hover:bg-axium-gray-800/60"
      )}
      onClick={onClick}
    >
      {isDark && isActive && (
        <span className="absolute inset-0 bg-gradient-to-r from-axium-neon-blue/10 to-transparent opacity-70"></span>
      )}
      <Icon className={cn(
        "h-5 w-5 transition-all duration-300",
        isDark && isActive && "text-axium-neon-blue drop-shadow-[0_0_3px_rgba(56,189,248,0.7)]"
      )} />
      <span className={cn(
        "transition-all duration-300",
        isDark && isActive && "text-axium-neon-blue font-medium"
      )}>{label}</span>
      
      {isDark && (
        <span className="absolute bottom-0 left-0 h-[2px] bg-axium-neon-blue/70 rounded-full transition-all duration-500 opacity-0 
          group-hover:opacity-100 w-0 group-hover:w-full"></span>
      )}
    </a>
  );
};

export function Sidebar() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navigationItems = [
    { icon: Home, label: "Home", href: "/dashboard" },
    { icon: LineChart, label: "Market", href: "/trading" },
    { icon: Briefcase, label: "Portfolio", href: "/portfolio" },
    { icon: Star, label: "Creators", href: "/creators" },
    { icon: Settings, label: "Settings", href: "/settings" }
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-4 left-4 z-50 md:hidden" 
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-64 border-r border-border transition-all duration-300",
          "bg-background/80 backdrop-blur-md dark:bg-axium-dark-bg/90",
          isDark && "cyberpunk-grid tech-border data-scanline",
          isMobile && !isOpen ? "-translate-x-full" : "translate-x-0",
          "md:relative md:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center justify-between border-b px-4 dark:border-axium-gray-800/80">
            <h2 className={cn(
              "text-lg font-semibold transition-all duration-300",
              isDark && "text-gradient-blue neon-text-blue"
            )}>
              Axium
              {isDark && (
                <span className="ml-1 text-axium-neon-gold text-sm font-normal">v2.0</span>
              )}
            </h2>
            <ThemeToggle className="md:hidden" />
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {navigationItems.map((item) => (
              <SidebarItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isActive={location.pathname === item.href}
                onClick={isMobile ? () => setIsOpen(false) : undefined}
              />
            ))}
          </nav>
          <div className={cn(
            "p-4 border-t border-border hidden md:block",
            isDark && "border-axium-gray-800/80"
          )}>
            <div className="flex items-center justify-between">
              <span className={cn(
                "text-sm text-muted-foreground",
                isDark && "text-axium-gray-400"
              )}>Theme</span>
              <ThemeToggle />
            </div>
            {isDark && (
              <div className="mt-4 pt-3 border-t border-axium-gray-800/60 text-center">
                <span className="text-xs text-axium-gray-500 block">Geek Studio Mode</span>
                <span className="text-xs text-axium-neon-blue animate-pulse block mt-1">CONNECTED</span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
