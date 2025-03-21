
import { Landmark, Users, TrendingUp, BarChart } from "lucide-react";
import { LiquidityPool, formatNumber, formatPercent } from "./types";

interface PoolMetricsProps {
  pool: LiquidityPool;
}

export const PoolMetrics = ({ pool }: PoolMetricsProps) => {
  return (
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
  );
};
