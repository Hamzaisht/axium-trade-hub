
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
  Users
} from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon: Icon, label, href, isActive, onClick }: SidebarItemProps) => {
  return (
    <a 
      href={href} 
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-all hover:translate-x-1",
        isActive 
          ? "bg-gradient-to-r from-[#1A2747]/80 to-[#1A2747]/10 text-[#3AA0FF] border-l-2 border-[#3AA0FF]" 
          : "text-[#8A9CCC] hover:bg-[#1A2747]/30 hover:text-white"
      )}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{label}</span>
      
      {isActive && (
        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[#3AA0FF]"></div>
      )}
    </a>
  );
};

export function Sidebar() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

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
        className="fixed top-4 left-4 z-50 md:hidden text-white" 
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-64 bg-[#0D1424] border-r border-[#1A2747] transition-transform duration-300 shadow-xl",
          isMobile && !isOpen ? "-translate-x-full" : "translate-x-0",
          "md:relative md:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b border-[#1A2747] px-4 bg-[#0A0E17]">
            <div className="flex items-center">
              <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#3AA0FF] mr-2">
                <path d="M14 3L25 20H3L14 3Z" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M14 8L20 18H8L14 8Z" fill="currentColor" />
              </svg>
              <h2 className="text-lg font-bold text-white tracking-wider">AXIUM</h2>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
            <div className="space-y-1.5">
              <h3 className="text-xs uppercase text-[#8A9CCC] font-semibold tracking-wider px-3">Main Navigation</h3>
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
              <h3 className="text-xs uppercase text-[#8A9CCC] font-semibold tracking-wider px-3">Tools</h3>
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
          
          <div className="border-t border-[#1A2747] p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#3AA0FF] to-[#2D7DD2] flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Axium User</p>
                <p className="text-xs text-[#8A9CCC]">Pro Account</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
