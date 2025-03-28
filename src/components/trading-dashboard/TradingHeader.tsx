
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, User, Settings, Search, HelpCircle, Monitor, SunMoon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface TradingHeaderProps {
  title: string;
  isConnected: boolean;
}

export const TradingHeader = ({ title, isConnected }: TradingHeaderProps) => {
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  
  return (
    <div className="flex flex-col space-y-2 mb-4">
      <div className="flex items-center justify-between bg-white dark:bg-axium-gray-800 rounded-lg shadow-sm px-4 py-2">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-2 p-2 h-9 w-9" 
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold tracking-tight hidden sm:block">
            {title}
          </h1>
          <div className="bg-axium-gray-100 dark:bg-axium-gray-700 rounded-md px-2 py-1 ml-3 flex items-center">
            <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
            <span className="text-xs font-medium">{isConnected ? 'Live' : 'Disconnected'}</span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center bg-axium-gray-100/50 dark:bg-axium-gray-800/50 rounded-md px-3 py-1.5">
          <span className="text-xs font-mono mr-3">{currentDate}</span>
          <span className="text-xs font-mono bg-axium-gray-200/80 dark:bg-axium-gray-700/80 px-2 py-0.5 rounded">
            {currentTime}
          </span>
          <Badge variant="outline" className="ml-3 text-[10px] font-normal px-1.5 py-0">GMT-04:00</Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative hidden lg:block">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-axium-gray-500" />
            <Input 
              placeholder="Search markets..." 
              className="h-9 pl-8 pr-3 w-[180px] text-sm"
            />
          </div>
          
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <SunMoon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <HelpCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 hidden sm:flex">
            <User className="h-4 w-4" />
            <span>Account</span>
          </Button>
        </div>
      </div>
      
      <div className="flex overflow-x-auto bg-white dark:bg-axium-gray-800 rounded-lg shadow-sm px-3 py-1.5 text-xs font-medium scrollbar-none">
        <div className="flex items-center space-x-6 text-axium-gray-600">
          <div className="flex items-center">
            <span className="text-green-500 mr-1.5">SPX</span>
            <span>4,783.45</span>
            <span className="text-green-500 ml-1">+0.22%</span>
          </div>
          <div className="flex items-center">
            <span className="text-green-500 mr-1.5">DJIA</span>
            <span>38,239.98</span>
            <span className="text-green-500 ml-1">+0.56%</span>
          </div>
          <div className="flex items-center">
            <span className="text-red-500 mr-1.5">NASDAQ</span>
            <span>16,920.79</span>
            <span className="text-red-500 ml-1">-0.41%</span>
          </div>
          <div className="flex items-center">
            <span className="text-green-500 mr-1.5">EUR/USD</span>
            <span>1.0865</span>
            <span className="text-green-500 ml-1">+0.15%</span>
          </div>
          <div className="flex items-center">
            <span className="text-red-500 mr-1.5">BTC/USD</span>
            <span>68,752.21</span>
            <span className="text-red-500 ml-1">-1.23%</span>
          </div>
          <div className="flex items-center">
            <span className="text-green-500 mr-1.5">ETH/USD</span>
            <span>3,452.88</span>
            <span className="text-green-500 ml-1">+2.17%</span>
          </div>
          <div className="flex items-center">
            <span className="text-green-500 mr-1.5">Gold</span>
            <span>2,385.63</span>
            <span className="text-green-500 ml-1">+0.32%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
