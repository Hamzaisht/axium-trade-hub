
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Menu, 
  X, 
  Home, 
  BarChart2, 
  DollarSign, 
  Users, 
  TrendingUp,
  Brain
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, signOut } = useAuth();
  const location = useLocation();

  // Track scroll position for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Check if a nav link is active
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md dark:bg-axium-gray-900' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-axium-gray-900 dark:text-white">Axium</span>
              <span className="ml-2 text-sm px-2 py-0.5 bg-axium-blue text-white rounded">BETA</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" isActive={isActive('/dashboard')}>
                  <Home className="h-4 w-4 mr-1" />
                  Dashboard
                </NavLink>
                <NavLink to="/portfolio" isActive={isActive('/portfolio')}>
                  <BarChart2 className="h-4 w-4 mr-1" />
                  Portfolio
                </NavLink>
                <NavLink to="/creators" isActive={isActive('/creators')}>
                  <Users className="h-4 w-4 mr-1" />
                  Creators
                </NavLink>
                <NavLink to="/trading" isActive={isActive('/trading')}>
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Trading
                </NavLink>
                <NavLink to="/ai-insights" isActive={isActive('/ai-insights')}>
                  <Brain className="h-4 w-4 mr-1" />
                  AI Insights
                </NavLink>
                
                <ThemeToggle className="ml-4" />
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="ml-4 flex items-center">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatarUrl || undefined} />
                        <AvatarFallback>{user?.name?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/" className="mx-2 px-3 py-2 rounded-md text-axium-gray-800 dark:text-axium-gray-200 hover:bg-axium-gray-100 dark:hover:bg-axium-gray-800">
                  Home
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="mr-2">
                    Log in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Sign up</Button>
                </Link>
                <ThemeToggle className="ml-4" />
              </>
            )}
          </div>

          {/* Mobile Navigation Button */}
          <div className="flex items-center md:hidden">
            <ThemeToggle />
            <button
              className="ml-4 text-axium-gray-800 dark:text-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-axium-gray-900 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated ? (
              <>
                <MobileNavLink to="/dashboard" isActive={isActive('/dashboard')}>
                  <Home className="h-5 w-5 mr-2" />
                  Dashboard
                </MobileNavLink>
                <MobileNavLink to="/portfolio" isActive={isActive('/portfolio')}>
                  <BarChart2 className="h-5 w-5 mr-2" />
                  Portfolio
                </MobileNavLink>
                <MobileNavLink to="/creators" isActive={isActive('/creators')}>
                  <Users className="h-5 w-5 mr-2" />
                  Creators
                </MobileNavLink>
                <MobileNavLink to="/trading" isActive={isActive('/trading')}>
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Trading
                </MobileNavLink>
                <MobileNavLink to="/ai-insights" isActive={isActive('/ai-insights')}>
                  <Brain className="h-5 w-5 mr-2" />
                  AI Insights
                </MobileNavLink>
                <div className="pt-4 pb-3 border-t border-axium-gray-200 dark:border-axium-gray-700">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.avatarUrl || undefined} />
                        <AvatarFallback>{user?.name?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-axium-gray-800 dark:text-white">{user?.name || user?.email}</div>
                      {user?.name && <div className="text-sm font-medium text-axium-gray-500 dark:text-axium-gray-400">{user.email}</div>}
                    </div>
                  </div>
                  <div className="mt-3 px-2 space-y-1">
                    <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-axium-gray-700 dark:text-axium-gray-200 hover:bg-axium-gray-100 dark:hover:bg-axium-gray-800">
                      Profile
                    </button>
                    <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-axium-gray-700 dark:text-axium-gray-200 hover:bg-axium-gray-100 dark:hover:bg-axium-gray-800">
                      Settings
                    </button>
                    <button
                      onClick={signOut}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-axium-gray-700 dark:text-axium-gray-200 hover:bg-axium-gray-100 dark:hover:bg-axium-gray-800"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <MobileNavLink to="/" isActive={isActive('/')}>
                  Home
                </MobileNavLink>
                <MobileNavLink to="/login" isActive={isActive('/login')}>
                  Log in
                </MobileNavLink>
                <MobileNavLink to="/register" isActive={isActive('/register')}>
                  Sign up
                </MobileNavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  isActive: boolean;
  children: React.ReactNode;
}

const NavLink = ({ to, isActive, children }: NavLinkProps) => (
  <Link
    to={to}
    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
      isActive
        ? 'bg-axium-blue text-white'
        : 'text-axium-gray-800 dark:text-axium-gray-200 hover:bg-axium-gray-100 dark:hover:bg-axium-gray-800'
    }`}
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, isActive, children }: NavLinkProps) => (
  <Link
    to={to}
    className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
      isActive
        ? 'bg-axium-blue text-white'
        : 'text-axium-gray-700 dark:text-axium-gray-200 hover:bg-axium-gray-100 dark:hover:bg-axium-gray-800'
    }`}
  >
    {children}
  </Link>
);

export default Navbar;
