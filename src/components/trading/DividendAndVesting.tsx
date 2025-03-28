import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/badge';
import { CircleDollarSign, Lock, AlertTriangle } from 'lucide-react';
import { useAIValuation } from '@/hooks/ai/useAIValuation';
import { useEffect } from 'react';

interface LiquidationRules {
  inactivityThreshold: number;
  engagementMinimum: number;
  liquidationProcess: string;
  tokenBuybackPrice: number;
  warningThresholds?: {
    severe: number;
    moderate: number;
    mild: number;
  };
}

interface DividendAndVestingProps {
  ipoId?: string;
  symbol?: string;
}

export const DividendAndVesting = ({ ipoId, symbol = 'EMW' }: DividendAndVestingProps) => {
  const { 
    dividendInfo, 
    vestingRules, 
    liquidationRules,
    isDividendInfoLoading,
    isVestingRulesLoading,
    isLiquidationRulesLoading
  } = useAIValuation({ ipoId });

  useEffect(() => {
    console.log("DividendAndVesting component loaded with ipoId:", ipoId);
  }, [ipoId]);

  const renderDividendSection = () => {
    if (isDividendInfoLoading) {
      return (
        <div className="flex items-center justify-center h-40">
          <div className="animate-pulse flex space-x-4">
            <div className="h-4 w-32 bg-axium-gray-200 rounded"></div>
          </div>
        </div>
      );
    }
    
    if (!dividendInfo) {
      return (
        <div className="text-center py-10 text-axium-gray-500">
          <p>No dividend information available</p>
        </div>
      );
    }

    // Default values for missing properties
    const nextPayoutDate = dividendInfo.nextPayoutDate ? new Date(dividendInfo.nextPayoutDate) : new Date();
    const now = new Date();
    const daysUntilPayout = Math.ceil((nextPayoutDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    // Handle missing historicalPayouts safely
    const historicalPayouts = dividendInfo.historicalPayouts || [];
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Dividends</h3>
            <p className="text-axium-gray-500 text-sm">
              Earn passive income by holding {symbol} tokens
            </p>
          </div>
          <div className="text-right">
            <div className="text-xl font-semibold">{dividendInfo.annualYieldPercent || 0}%</div>
            <div className="text-axium-gray-500 text-sm">Annual Yield</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Badge className="bg-axium-blue/10 text-axium-blue hover:bg-axium-blue/20 mb-2">
              Next Payout
            </Badge>
            <div className="text-sm text-axium-gray-600">
              {daysUntilPayout} days
            </div>
            <div className="text-sm text-axium-gray-600">
              {nextPayoutDate.toLocaleDateString()}
            </div>
          </div>
          
          <div>
            <Badge className="bg-axium-blue/10 text-axium-blue hover:bg-axium-blue/20 mb-2">
              Estimated Amount
            </Badge>
            <div className="text-sm text-axium-gray-600">
              ${dividendInfo.nextEstimatedAmount || 0}M
            </div>
            <div className="text-sm text-axium-gray-600">
              Payout Frequency: {dividendInfo.payoutFrequency || 'Quarterly'}
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold mb-2">Historical Payouts</h4>
          {historicalPayouts.length > 0 ? (
            <ul className="space-y-2">
              {historicalPayouts.map((payout, idx) => (
                <li key={idx} className="flex items-center justify-between text-sm text-axium-gray-600">
                  <span>{payout.date}</span>
                  <span>${payout.amount}M</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-axium-gray-500">No historical data available</div>
          )}
        </div>
      </div>
    );
  };

  const renderVestingSection = () => {
    if (isVestingRulesLoading) {
      return (
        <div className="flex items-center justify-center h-40">
          <div className="animate-pulse flex space-x-4">
            <div className="h-4 w-32 bg-axium-gray-200 rounded"></div>
          </div>
        </div>
      );
    }
    
    if (!vestingRules) {
      return (
        <div className="text-center py-10 text-axium-gray-500">
          <p>No vesting rules available</p>
        </div>
      );
    }
    
    // Generate lockup schedule data if property is missing
    const tokenLockupSchedule = vestingRules.tokenLockupSchedule || generateTokenLockupSchedule(vestingRules);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Vesting Rules</h3>
            <p className="text-axium-gray-500 text-sm">
              Understand token lockup and release schedule
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Badge className="bg-axium-blue/10 text-axium-blue hover:bg-axium-blue/20 mb-2">
              Initial Unlock
            </Badge>
            <div className="text-sm text-axium-gray-600">
              {vestingRules.creatorVesting.initialUnlock}%
            </div>
            <div className="text-sm text-axium-gray-600">
              Unlocked at launch
            </div>
          </div>
          
          <div>
            <Badge className="bg-axium-blue/10 text-axium-blue hover:bg-axium-blue/20 mb-2">
              Vesting Period
            </Badge>
            <div className="text-sm text-axium-gray-600">
              {vestingRules.creatorVesting.vestingPeriod} months
            </div>
            <div className="text-sm text-axium-gray-600">
              Total vesting duration
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold mb-2">Token Lockup Schedule</h4>
          <ul className="space-y-2">
            {tokenLockupSchedule.map((lockup, idx) => (
              <li key={idx} className="flex items-center justify-between text-sm text-axium-gray-600">
                <span>{lockup.label}</span>
                <span>{lockup.unlockPercentage}%</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold mb-2">Investor Staking</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Badge className="bg-axium-blue/10 text-axium-blue hover:bg-axium-blue/20 mb-2">
                Min Staking Period
              </Badge>
              <div className="text-sm text-axium-gray-600">
                {vestingRules.investorStaking.minStakingPeriod} days
              </div>
            </div>
            
            <div>
              <Badge className="bg-axium-blue/10 text-axium-blue hover:bg-axium-blue/20 mb-2">
                Early Unstake Penalty
              </Badge>
              <div className="text-sm text-axium-gray-600">
                {vestingRules.investorStaking.earlyUnstakePenalty}%
              </div>
            </div>
            
            <div>
              <Badge className="bg-axium-blue/10 text-axium-blue hover:bg-axium-blue/20 mb-2">
                Staking Rewards
              </Badge>
              <div className="text-sm text-axium-gray-600">
                {vestingRules.investorStaking.stakingRewards}%
              </div>
              <div className="text-sm text-axium-gray-600">
                Annual percentage
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLiquidationSection = () => {
    if (isLiquidationRulesLoading) {
      return (
        <div className="flex items-center justify-center h-40">
          <div className="animate-pulse flex space-x-4">
            <div className="h-4 w-32 bg-axium-gray-200 rounded"></div>
          </div>
        </div>
      );
    }
    
    if (!liquidationRules) {
      return (
        <div className="text-center py-10 text-axium-gray-500">
          <p>No liquidation rules available</p>
        </div>
      );
    }
    
    // Handle missing warningThresholds safely with default values
    const warningThresholds = (liquidationRules as LiquidationRules).warningThresholds || {
      severe: 30,
      moderate: 60,
      mild: 90
    };
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Liquidation Rules</h3>
            <p className="text-axium-gray-500 text-sm">
              Understand conditions for token liquidation
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Badge className="bg-axium-blue/10 text-axium-blue hover:bg-axium-blue/20 mb-2">
              Inactivity Threshold
            </Badge>
            <div className="text-sm text-axium-gray-600">
              {(liquidationRules as LiquidationRules).inactivityThreshold || 180} days
            </div>
            <div className="text-sm text-axium-gray-600">
              Days of inactivity before liquidation
            </div>
          </div>
          
          <div>
            <Badge className="bg-axium-blue/10 text-axium-blue hover:bg-axium-blue/20 mb-2">
              Engagement Minimum
            </Badge>
            <div className="text-sm text-axium-gray-600">
              {(liquidationRules as LiquidationRules).engagementMinimum || 10}
            </div>
            <div className="text-sm text-axium-gray-600">
              Minimum engagement score
            </div>
          </div>
        </div>
        
        <div>
          <Badge className="bg-axium-blue/10 text-axium-blue hover:bg-axium-blue/20 mb-2">
            Token Buyback Price
          </Badge>
          <div className="text-sm text-axium-gray-600">
            ${(liquidationRules as LiquidationRules).tokenBuybackPrice || 0}
          </div>
          <div className="text-sm text-axium-gray-600">
            Price at which tokens will be bought back
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold mb-2">Liquidation Process</h4>
          <p className="text-sm text-axium-gray-600">
            {(liquidationRules as LiquidationRules).liquidationProcess || 'Standard liquidation process applies.'}
          </p>
        </div>
      </div>
    );
  };

  const generateTokenLockupSchedule = (vestingRules) => {
    const { creatorVesting } = vestingRules;
    const schedule = [];
    
    // Initial unlock
    schedule.push({
      month: 0,
      unlockPercentage: creatorVesting.initialUnlock,
      label: 'Initial'
    });
    
    // Monthly unlocks
    for (let i = 1; i <= 12; i++) {
      schedule.push({
        month: i,
        unlockPercentage: creatorVesting.monthlyUnlock,
        label: `Month ${i}`
      });
    }
    
    return schedule;
  };

  return (
    <GlassCard className="space-y-6">
      <div className="flex items-center space-x-3 mb-4">
        <CircleDollarSign className="h-5 w-5 text-axium-blue" />
        <h2 className="text-lg font-semibold">Dividends & Vesting</h2>
      </div>
      
      {renderDividendSection()}
      {renderVestingSection()}
      {renderLiquidationSection()}
    </GlassCard>
  );
};

export default DividendAndVesting;
