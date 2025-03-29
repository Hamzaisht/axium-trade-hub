
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
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
        isActive 
          ? "bg-primary/10 text-primary" 
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
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
          "fixed left-0 top-0 z-40 h-full w-64 bg-background border-r border-border transition-transform duration-300",
          isMobile && !isOpen ? "-translate-x-full" : "translate-x-0",
          "md:relative md:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4">
            <h2 className="text-lg font-semibold">Axium</h2>
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
        </div>
      </aside>
    </>
  );
}
