
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, ChevronRight } from "lucide-react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Creators", path: "/creators" },
  { name: "Portfolio", path: "/portfolio" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
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
  
  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8",
      isScrolled ? "py-3 bg-white/80 backdrop-blur-md shadow-sm" : "py-5 bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 font-bold text-xl">
          <span className="text-axium-blue">Axium</span>
          <span className="text-axium-gray-800">.io</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "font-medium transition-colors duration-200 hover:text-axium-blue",
                  location.pathname === link.path 
                    ? "text-axium-blue" 
                    : "text-axium-gray-700"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              className="font-medium border-axium-gray-200 text-axium-gray-800 hover:bg-axium-gray-100"
            >
              Log In
            </Button>
            <Button className="font-medium bg-axium-blue hover:bg-axium-blue/90">
              Sign Up <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-axium-gray-800"
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
      
      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden absolute left-0 right-0 top-full bg-white/95 backdrop-blur-md shadow-md transition-all duration-300 overflow-hidden",
        isMenuOpen ? "max-h-screen py-4" : "max-h-0 py-0"
      )}>
        <div className="px-4 space-y-3 flex flex-col">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "font-medium py-2 px-3 rounded-md transition-colors",
                location.pathname === link.path 
                  ? "bg-axium-blue/10 text-axium-blue" 
                  : "text-axium-gray-700 hover:bg-axium-gray-100"
              )}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex flex-col space-y-2 pt-2">
            <Button 
              variant="outline" 
              className="w-full justify-center font-medium border-axium-gray-200"
            >
              Log In
            </Button>
            <Button className="w-full justify-center font-medium bg-axium-blue">
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
