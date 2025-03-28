
import { useQuery } from '@tanstack/react-query';

export interface VestingRules {
  creatorVesting: {
    initialUnlock: number; // percentage
    monthlyUnlock: number; // percentage
    vestingPeriod: number; // months
    cliffPeriod?: number; // months
  };
  investorStaking: {
    minStakingPeriod: number; // days
    stakingRewards: number; // percentage
    earlyUnstakePenalty: number; // percentage
  };
  tokenLockupSchedule?: {
    month: number;
    unlockPercentage: number;
    label: string;
  }[];
}

// Mock API function to get vesting rules
const fetchVestingRules = async (ipoId: string): Promise<VestingRules> => {
  // Simulate API request
  await new Promise(resolve => setTimeout(resolve, 900));
  
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
  const initialUnlock = (hash % 30) + 10; // Between 10-40%
  const monthlyUnlock = ((hash % 10) + 5); // Between 5-15%
  
  // Generate the unlock schedule
  const tokenLockupSchedule = [];
  
  // Initial unlock
  tokenLockupSchedule.push({
    month: 0,
    unlockPercentage: initialUnlock,
    label: 'Initial'
  });
  
  let totalUnlocked = initialUnlock;
  // Monthly unlocks
  for (let i = 1; i <= 12; i++) {
    // Cliff period calculation
    if (i <= (hash % 3)) {
      tokenLockupSchedule.push({
        month: i,
        unlockPercentage: 0,
        label: `Month ${i} (Cliff)`
      });
    } else {
      tokenLockupSchedule.push({
        month: i,
        unlockPercentage: monthlyUnlock,
        label: `Month ${i}`
      });
      totalUnlocked += monthlyUnlock;
    }
    
    // Cap at 100%
    if (totalUnlocked >= 100) break;
  }
  
  return {
    creatorVesting: {
      initialUnlock: initialUnlock,
      monthlyUnlock: monthlyUnlock,
      vestingPeriod: (hash % 12) + 12, // Between 12-24 months
      cliffPeriod: hash % 3 // Between 0-2 months
    },
    investorStaking: {
      minStakingPeriod: (hash % 60) + 30, // Between 30-90 days
      stakingRewards: (hash % 15) + 5, // Between 5-20%
      earlyUnstakePenalty: (hash % 20) + 10 // Between 10-30%
    },
    tokenLockupSchedule
  };
};

export const useVestingRules = (ipoId?: string) => {
  return useQuery({
    queryKey: ['vesting-rules', ipoId],
    queryFn: () => fetchVestingRules(ipoId!),
    enabled: !!ipoId,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
