
import { useQuery } from '@tanstack/react-query';

interface DividendPayout {
  date: string;
  amount: number;
}

export interface DividendInfo {
  annualYieldPercent: number;
  payoutFrequency: string;
  nextPayoutDate: string;
  nextEstimatedAmount: number;
  historicalPayouts: DividendPayout[];
}

// Mock API function to get dividend info
const fetchDividendInfo = async (ipoId: string): Promise<DividendInfo> => {
  // Simulate API request
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate consistent but seemingly random data based on creatorId
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
  const baseYield = (hash % 10) + 2; // Between 2-12%
  
  // Calculate next payout date (some time in the next 90 days)
  const nextPayoutDate = new Date();
  nextPayoutDate.setDate(nextPayoutDate.getDate() + (hash % 90) + 1);
  
  // Generate historical payouts (last 6 months)
  const historicalPayouts: DividendPayout[] = [];
  for (let i = 1; i <= 6; i++) {
    const payoutDate = new Date();
    payoutDate.setMonth(payoutDate.getMonth() - i);
    
    historicalPayouts.push({
      date: payoutDate.toISOString().split('T')[0],
      amount: ((hash % 5) + 0.5) * (1 + (i % 3) * 0.1)
    });
  }
  
  return {
    annualYieldPercent: baseYield,
    payoutFrequency: (hash % 4 === 0) ? 'Monthly' : 'Quarterly',
    nextPayoutDate: nextPayoutDate.toISOString(),
    nextEstimatedAmount: ((hash % 5) + 0.5),
    historicalPayouts
  };
};

export const useDividendInfo = (ipoId?: string) => {
  return useQuery({
    queryKey: ['dividend-info', ipoId],
    queryFn: () => fetchDividendInfo(ipoId!),
    enabled: !!ipoId,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};
