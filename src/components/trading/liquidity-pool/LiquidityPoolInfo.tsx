
import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Droplets, Info } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { PoolHeader } from "./PoolHeader";
import { PoolMetrics } from "./PoolMetrics";
import { UtilizationRate } from "./UtilizationRate";
import { TierRequirements } from "./TierRequirements";
import { LiquidityPool } from "./types";

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
  
  return (
    <GlassCard className={cn("p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <PoolHeader tier={pool.tier} />
        
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
      
      <PoolMetrics pool={pool} />
      
      <UtilizationRate utilizationRate={pool.utilizationRate} />
      
      <TierRequirements minContribution={pool.minContribution} lockupPeriod={pool.lockupPeriod} />
      
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
