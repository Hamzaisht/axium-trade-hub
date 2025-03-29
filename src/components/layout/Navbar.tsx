
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative w-8 h-8">
                <svg width="32" height="32" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" 
                  className="text-axium-neon-blue group-hover:animate-pulse transition-all duration-300">
                  <path d="M14 3L25 20H3L14 3Z" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path d="M14 8L20 18H8L14 8Z" fill="currentColor" />
                </svg>
                {isDark && (
                  <div className="absolute inset-0 bg-axium-neon-blue/20 blur-lg rounded-full animate-pulse-subtle"></div>
                )}
              </div>
              <span className="text-xl font-bold tracking-wider bg-gradient-to-r from-axium-neon-blue to-axium-neon-mint bg-clip-text text-transparent">
                Axium<span className="text-foreground">.</span><span className="text-axium-neon-blue">io</span>
              </span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground/80 hover:text-axium-neon-blue transition-colors relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-axium-neon-blue transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <div className="relative group">
              <button className="flex items-center text-foreground/80 hover:text-axium-neon-blue transition-colors">
                <span>Features</span>
                <ChevronDown className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 mt-2 w-48 py-2 bg-background/80 backdrop-blur-md rounded-md shadow-lg border border-axium-neon-blue/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <Link to="#" className="block px-4 py-2 text-sm text-foreground/80 hover:bg-axium-neon-blue/10 hover:text-axium-neon-blue">
                  Creator Tokens
                </Link>
                <Link to="#" className="block px-4 py-2 text-sm text-foreground/80 hover:bg-axium-neon-blue/10 hover:text-axium-neon-blue">
                  AI Valuations
                </Link>
                <Link to="#" className="block px-4 py-2 text-sm text-foreground/80 hover:bg-axium-neon-blue/10 hover:text-axium-neon-blue">
                  Trading Platform
                </Link>
              </div>
            </div>
            <Link to="#" className="text-foreground/80 hover:text-axium-neon-mint transition-colors relative group">
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-axium-neon-mint transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="#" className="text-foreground/80 hover:text-axium-neon-gold transition-colors relative group">
              About
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-axium-neon-gold transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            <div className="hidden md:flex items-center space-x-3">
              <Link to="/login">
                <Button variant="outline" className="border-axium-neon-blue/50 text-foreground hover:bg-axium-neon-blue/10 hover:text-axium-neon-blue">
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-axium-neon-blue hover:bg-axium-neon-blue/90 text-black dark:text-black font-medium hover-glow-blue">
                  Sign Up
                </Button>
              </Link>
            </div>
            
            <button 
              className="md:hidden text-foreground hover:text-axium-neon-blue transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background/95 backdrop-blur-lg border-t border-axium-neon-blue/20"
          >
            <div className="px-4 py-4 space-y-4">
              <Link to="/" className="block text-foreground/80 hover:text-axium-neon-blue py-2">
                Home
              </Link>
              <div className="border-t border-border/30 pt-2">
                <button className="flex items-center justify-between w-full text-foreground/80 hover:text-axium-neon-blue py-2">
                  <span>Features</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="pl-4 mt-1 space-y-2">
                  <Link to="#" className="block text-sm text-foreground/70 hover:text-axium-neon-blue py-2">
                    Creator Tokens
                  </Link>
                  <Link to="#" className="block text-sm text-foreground/70 hover:text-axium-neon-blue py-2">
                    AI Valuations
                  </Link>
                  <Link to="#" className="block text-sm text-foreground/70 hover:text-axium-neon-blue py-2">
                    Trading Platform
                  </Link>
                </div>
              </div>
              <div className="border-t border-border/30 pt-2">
                <Link to="#" className="block text-foreground/80 hover:text-axium-neon-mint py-2">
                  Pricing
                </Link>
              </div>
              <div className="border-t border-border/30 pt-2">
                <Link to="#" className="block text-foreground/80 hover:text-axium-neon-gold py-2">
                  About
                </Link>
              </div>
              <div className="border-t border-border/30 pt-2 flex flex-col space-y-3">
                <Link to="/login">
                  <Button variant="outline" className="w-full border-axium-neon-blue/50 text-foreground hover:bg-axium-neon-blue/10 hover:text-axium-neon-blue">
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="w-full bg-axium-neon-blue hover:bg-axium-neon-blue/90 text-black dark:text-black font-medium">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
