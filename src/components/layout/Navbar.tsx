
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import {
  User,
  LogOut,
  Settings,
  ChevronDown,
  BarChart2,
  Trophy,
  Globe,
  Rocket,
  GraduationCap,
  BrainCircuit
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for transparent to solid background effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Create dynamic classes for navbar based on current scroll position
  const navbarClasses = cn(
    'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
    {
      'bg-background/95 backdrop-blur-md shadow': isScrolled || location.pathname !== '/',
      'bg-transparent': !isScrolled && location.pathname === '/',
    }
  );

  const isHomePage = location.pathname === '/';
  const textColor = !isScrolled && isHomePage ? 'text-white' : 'text-foreground';

  return (
    <header className={navbarClasses}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className={cn('text-2xl font-bold flex items-center', textColor)}
          >
            <span className="text-primary">Axium</span>
          </Link>

          {/* Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    'bg-transparent',
                    !isScrolled && isHomePage ? 'text-white hover:text-white/80' : ''
                  )}
                >
                  Explore
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-axium-blue-600/40 to-axium-gray-700/70 p-6 no-underline outline-none focus:shadow-md"
                          href="/dashboard"
                        >
                          <div className="mt-4 mb-2 text-lg font-medium text-white">
                            Creator Markets
                          </div>
                          <p className="text-sm leading-tight text-white/90">
                            Discover, invest and trade creator tokens in the growing Axium marketplace.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <NavigationMenuItem className="block py-2 select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="flex items-center text-sm font-medium leading-none mb-1">
                        <BarChart2 className="h-4 w-4 mr-2" />
                        <Link to="/trading">Trading Platform</Link>
                      </div>
                      <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Advanced order types, charts, and analytics
                      </div>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="block py-2 select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="flex items-center text-sm font-medium leading-none mb-1">
                        <BrainCircuit className="h-4 w-4 mr-2" />
                        <Link to="/ai-valuation">AI Valuation</Link>
                      </div>
                      <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Real-time creator valuations powered by AI
                      </div>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="block py-2 select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="flex items-center text-sm font-medium leading-none mb-1">
                        <Trophy className="h-4 w-4 mr-2" />
                        <Link to="/leaderboard">Top Performers</Link>
                      </div>
                      <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        See the best-performing creator tokens
                      </div>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="block py-2 select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="flex items-center text-sm font-medium leading-none mb-1">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        <Link to="/learn">Learning Center</Link>
                      </div>
                      <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Educational resources and tutorials
                      </div>
                    </NavigationMenuItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/dashboard" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(navigationMenuTriggerStyle(), 'bg-transparent', 
                      !isScrolled && isHomePage ? 'text-white hover:text-white/80' : ''
                    )}
                  >
                    Dashboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    'bg-transparent',
                    !isScrolled && isHomePage ? 'text-white hover:text-white/80' : ''
                  )}
                >
                  Company
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:grid-cols-2">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex select-none flex-col gap-1 rounded-md p-4 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          href="/about"
                        >
                          <div className="flex items-center">
                            <Globe className="h-4 w-4 mr-2" />
                            <span className="text-sm font-medium leading-none">About Us</span>
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Learn more about our mission and vision
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          className="flex select-none flex-col gap-1 rounded-md p-4 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          href="/partnership"
                        >
                          <div className="flex items-center">
                            <Rocket className="h-4 w-4 mr-2" />
                            <span className="text-sm font-medium leading-none">Partnerships</span>
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Collaboration opportunities
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          className="flex select-none flex-col gap-1 rounded-md p-4 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          href="/careers"
                        >
                          <div className="flex items-center">
                            <Trophy className="h-4 w-4 mr-2" />
                            <span className="text-sm font-medium leading-none">Careers</span>
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Join our growing team
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Menu will go here */}
          <div className="md:hidden">
            {/* Mobile menu button */}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      'flex items-center',
                      !isScrolled && isHomePage ? 'text-white hover:text-white/80 hover:bg-white/10' : ''
                    )}
                  >
                    <User className="h-5 w-5 mr-1" />
                    <span className="hidden sm:inline">{user?.displayName || user?.username}</span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer w-full">
                      <User className="h-4 w-4 mr-2" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/portfolio" className="cursor-pointer w-full">
                      <BarChart2 className="h-4 w-4 mr-2" />
                      <span>Portfolio</span>
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === 'creator' && (
                    <DropdownMenuItem asChild>
                      <Link to="/creator-dashboard" className="cursor-pointer w-full">
                        <Trophy className="h-4 w-4 mr-2" />
                        <span>Creator Dashboard</span>
                        <Badge className="ml-auto" variant="outline">
                          Creator
                        </Badge>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => logout()}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    !isScrolled && isHomePage
                      ? 'text-white hover:text-white border-white hover:bg-white/10'
                      : ''
                  )}
                  asChild
                >
                  <Link to="/login">Log in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
