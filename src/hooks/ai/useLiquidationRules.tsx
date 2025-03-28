
import { useQuery } from '@tanstack/react-query';

export interface LiquidationRules {
  inactivityThreshold: number; // days
  engagementMinimum: number;
  tokenBuybackPrice: number;
  liquidationProcess: string;
  warningThresholds?: {
    severe: number;
    moderate: number;
    mild: number;
  };
}

// Mock API function to get liquidation rules
const fetchLiquidationRules = async (ipoId: string): Promise<LiquidationRules> => {
  // Simulate API request
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate consistent but seemingly random data based on ipoId
  const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };
  
  const hash = hashCode(ipoId);
  
  const liquidationProcessOptions = [
    "Tokens will be bought back at the specified price after the inactivity threshold is reached.",
    "Creator will receive 3 warnings before liquidation process begins.",
    "Community governance vote required before liquidation can proceed.",
    "Smart contract automatically initiates buyback after conditions are met."
  ];
  
  return {
    inactivityThreshold: (hash % 60) + 30, // Between 30-90 days
    engagementMinimum: (hash % 30) + 20, // Between 20-50
    tokenBuybackPrice: parseFloat(((hash % 10) + 5).toFixed(2)), // Between $5-$15
    liquidationProcess: liquidationProcessOptions[hash % liquidationProcessOptions.length],
    warningThresholds: {
      severe: 30,
      moderate: 60,
      mild: 90
    }
  };
};

export const useLiquidationRules = (ipoId?: string) => {
  return useQuery({
    queryKey: ['liquidation-rules', ipoId],
    queryFn: () => fetchLiquidationRules(ipoId!),
    enabled: !!ipoId,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
