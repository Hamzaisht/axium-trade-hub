
export interface LiquidityPool {
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

export const formatNumber = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatPercent = (num: number) => {
  return `${num.toFixed(2)}%`;
};

export const getTierColor = (tier: 'standard' | 'enhanced' | 'premium') => {
  switch (tier) {
    case 'standard':
      return "bg-axium-gray-500";
    case 'enhanced':
      return "bg-axium-blue";
    case 'premium':
      return "bg-amber-500";
  }
};
