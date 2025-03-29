
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, ChevronRight, LogOut, User, Bell, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Dashboard", path: "/dashboard", protected: true },
  { name: "Creators", path: "/creators", protected: true },
  { name: "Portfolio", path: "/portfolio", protected: true },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { ThemeToggle } = useTheme();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Close mobile menu when navigating to a new page
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  
  // Filter protected links for non-authenticated users
  const filteredNavLinks = navLinks.filter(link => 
    !link.protected || isAuthenticated
  );
  
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8",
        isScrolled 
          ? "py-3 bg-white/80 dark:bg-[#0D1424]/80 backdrop-blur-md shadow-sm" 
          : "py-5 bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          {/* Axium Logo */}
          <div className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600 dark:text-axium-blue">
              <path d="M14 3L25 20H3L14 3Z" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M14 8L20 18H8L14 8Z" fill="currentColor" />
            </svg>
            <div className="font-bold text-xl">
              <span className="text-blue-600 dark:text-axium-blue">Axium</span>
              <span className="text-gray-800 dark:text-axium-gray-800">.io</span>
            </div>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex items-center space-x-6">
            {filteredNavLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "font-medium transition-colors duration-200 hover:text-blue-600 dark:hover:text-axium-blue",
                  location.pathname === link.path 
                    ? "text-blue-600 dark:text-axium-blue" 
                    : "text-gray-700 dark:text-axium-gray-300"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Theme toggle button */}
            <ThemeToggle />
            
            {isAuthenticated ? (
              <>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="bg-white dark:bg-[#1A2747] dark:text-white dark:border-[#243762]"
                >
                  <Bell className="h-5 w-5 text-gray-600 dark:text-white" />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="bg-white dark:bg-[#1A2747] dark:text-white dark:border-[#243762]"
                    >
                      <User className="h-5 w-5 text-gray-600 dark:text-white" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="dark:bg-[#0D1424] dark:border-[#1A2747]">
                    <DropdownMenuLabel className="dark:text-white">
                      {user?.name || 'My Account'}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="dark:bg-[#1A2747]" />
                    <DropdownMenuItem 
                      className="cursor-pointer dark:text-white dark:focus:bg-[#1A2747]"
                      onClick={() => navigate('/account')}
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="cursor-pointer dark:text-white dark:focus:bg-[#1A2747]"
                      onClick={() => navigate('/settings')}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="dark:bg-[#1A2747]" />
                    <DropdownMenuItem 
                      className="cursor-pointer text-red-600 dark:text-red-400 dark:focus:bg-[#1A2747]"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="font-medium border-gray-200 dark:border-[#1A2747] text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-[#1A2747]/70"
                  onClick={() => navigate('/login')}
                >
                  Log In
                </Button>
                <Button 
                  className="font-medium bg-blue-600 dark:bg-axium-blue hover:bg-blue-700 dark:hover:bg-axium-blue/90"
                  onClick={() => navigate('/register')}
                >
                  Sign Up <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-3">
          <ThemeToggle />
          <button
            className="text-gray-800 dark:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <motion.div 
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isMenuOpen ? 1 : 0,
          height: isMenuOpen ? "auto" : 0
        }}
        transition={{ duration: 0.3 }}
        className={cn(
          "md:hidden absolute left-0 right-0 top-full bg-white/95 dark:bg-[#0D1424]/95 backdrop-blur-md shadow-md overflow-hidden"
        )}
      >
        <div className="px-4 space-y-3 flex flex-col py-4">
          {filteredNavLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "font-medium py-2 px-3 rounded-md transition-colors",
                location.pathname === link.path 
                  ? "bg-blue-50 dark:bg-[#1A2747] text-blue-600 dark:text-axium-blue" 
                  : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-[#1A2747]/50"
              )}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex flex-col space-y-2 pt-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-[#1A2747] rounded-md">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 dark:bg-axium-blue rounded-full flex items-center justify-center text-white">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="ml-2 font-medium dark:text-white">{user?.name || 'User'}</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full justify-center font-medium dark:text-white dark:border-[#1A2747]"
                  onClick={() => navigate('/account')}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-center font-medium text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="w-full justify-center font-medium dark:text-white dark:border-[#1A2747]"
                  onClick={() => navigate('/login')}
                >
                  Log In
                </Button>
                <Button 
                  className="w-full justify-center font-medium bg-blue-600 dark:bg-axium-blue"
                  onClick={() => navigate('/register')}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
