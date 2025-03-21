
import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Droplets, 
  BarChart, 
  TrendingUp, 
  Landmark, 
  Users, 
  PieChart, 
  Info, 
  Lock
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

// Simulated liquidity pool data structure
interface LiquidityPool {
  id: string;
  symbol: string;
  totalLiquidity: number;
  utilizationRate: number;
  providerCount: number;
  apr: number;
  tier: 'standard' | 'enhanced' | 'premium';
  rebateRate: number;
  minContribution: number;
  lockupPeriod: number; // in days
}

interface LiquidityPoolInfoProps {
  symbol: string;
  className?: string;
}

export const LiquidityPoolInfo = ({ 
  symbol = "$AXM",
  className 
}: LiquidityPoolInfoProps) => {
  const { user } = useAuth();
  const isInstitutional = user?.role === 'admin' || user?.role === 'investor';
  
  // Simulated liquidity pool data
  const [pool, setPool] = useState<LiquidityPool>({
    id: "pool-1",
    symbol,
    totalLiquidity: 3750000,
    utilizationRate: 68,
    providerCount: 47,
    apr: 8.2,
    tier: 'enhanced',
    rebateRate: 0.15,
    minContribution: 25000,
    lockupPeriod: 30
  });
  
  // Format large numbers with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Format percentage
  const formatPercent = (num: number) => {
    return `${num.toFixed(2)}%`;
  };
  
  // Handle liquidity provision
  const handleProvideLiquidity = () => {
    if (!isInstitutional) {
      toast({
        title: "Access Restricted",
        description: "Liquidity provision requires institutional access. Please upgrade your account.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Liquidity Provision",
      description: "The liquidity provision form will open in a separate dialog.",
    });
  };
  
  // Get tier color
  const getTierColor = (tier: 'standard' | 'enhanced' | 'premium') => {
    switch (tier) {
      case 'standard':
        return "bg-axium-gray-500";
      case 'enhanced':
        return "bg-axium-blue";
      case 'premium':
        return "bg-amber-500";
    }
  };
  
  return (
    <GlassCard className={cn("p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <Droplets className="h-5 w-5 mr-2 text-axium-blue" />
          Liquidity Pool
          <Badge variant="outline" className="ml-2 text-xs">
            {pool.tier}
          </Badge>
        </h2>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="p-1 h-auto">
                <Info className="h-4 w-4 text-axium-gray-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">
                Liquidity pools stabilize trading by providing order depth. 
                Providers earn APR and reduced fees.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
        <div>
          <div className="text-xs text-axium-gray-500">Total Liquidity</div>
          <div className="font-semibold flex items-center">
            <Landmark className="h-4 w-4 mr-1 text-axium-gray-500" />
            ${formatNumber(pool.totalLiquidity)}
          </div>
        </div>
        
        <div>
          <div className="text-xs text-axium-gray-500">Providers</div>
          <div className="font-semibold flex items-center">
            <Users className="h-4 w-4 mr-1 text-axium-gray-500" />
            {pool.providerCount}
          </div>
        </div>
        
        <div>
          <div className="text-xs text-axium-gray-500">Current APR</div>
          <div className="font-semibold flex items-center text-axium-success">
            <TrendingUp className="h-4 w-4 mr-1" />
            {formatPercent(pool.apr)}
          </div>
        </div>
        
        <div>
          <div className="text-xs text-axium-gray-500">Fee Rebate</div>
          <div className="font-semibold flex items-center">
            <BarChart className="h-4 w-4 mr-1 text-axium-gray-500" />
            {formatPercent(pool.rebateRate)}
          </div>
        </div>
      </div>
      
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1 text-sm">
          <span>Utilization Rate</span>
          <span className="font-medium">{formatPercent(pool.utilizationRate)}</span>
        </div>
        <Progress value={pool.utilizationRate} className="h-2" />
      </div>
      
      <div className="border border-axium-gray-200 rounded-md p-3 mb-4 bg-axium-gray-50">
        <h3 className="text-sm font-medium mb-2 flex items-center">
          <PieChart className="h-4 w-4 mr-1 text-axium-gray-500" />
          Tier Requirements
        </h3>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-axium-gray-500">Min. Entry</span>
            <div className="font-medium">${formatNumber(pool.minContribution)}</div>
          </div>
          
          <div>
            <span className="text-axium-gray-500">Lockup Period</span>
            <div className="font-medium flex items-center">
              <Lock className="h-3 w-3 mr-1 text-axium-gray-500" />
              {pool.lockupPeriod} days
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <Button 
          onClick={handleProvideLiquidity} 
          className="w-full" 
          variant={isInstitutional ? "default" : "outline"}
          disabled={!isInstitutional}
        >
          <Droplets className="h-4 w-4 mr-2" />
          Provide Liquidity
        </Button>
        
        {!isInstitutional && (
          <p className="text-xs text-axium-gray-500 text-center mt-2">
            Institutional access required
          </p>
        )}
      </div>
    </GlassCard>
  );
};

export default LiquidityPoolInfo;
