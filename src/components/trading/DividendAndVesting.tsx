
import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAIValuation } from '@/hooks/useAIValuation';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { cn } from '@/lib/utils';
import { Calendar, CoinsIcon, Clock, Shield, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DividendAndVestingProps {
  ipoId?: string;
  symbol?: string;
}

export const DividendAndVesting = ({ ipoId, symbol = 'EMW' }: DividendAndVestingProps) => {
  const [activeTab, setActiveTab] = useState('dividends');
  
  const { 
    dividendInfo, 
    vestingRules, 
    liquidationRules,
    isDividendInfoLoading,
    isVestingRulesLoading,
    isLiquidationRulesLoading
  } = useAIValuation({ ipoId });
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Render dividend information
  const renderDividendInfo = () => {
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
          <p>No dividend data available</p>
        </div>
      );
    }
    
    // Process payout history data for chart
    const payoutHistory = [...dividendInfo.historicalPayouts]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(payout => ({
        date: formatDate(payout.date),
        amount: payout.amount
      }));
    
    // Add future payout if available
    if (dividendInfo.nextPayoutDate) {
      payoutHistory.push({
        date: formatDate(dividendInfo.nextPayoutDate),
        amount: dividendInfo.nextEstimatedAmount,
        isFuture: true
      });
    }
    
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-axium-blue/5 rounded-lg p-3">
            <div className="text-sm text-axium-gray-600 mb-1">Annual Yield</div>
            <div className="text-2xl font-semibold text-axium-blue">
              {dividendInfo.annualYieldPercent}%
            </div>
          </div>
          
          <div className="bg-axium-gray-50 rounded-lg p-3">
            <div className="text-sm text-axium-gray-600 mb-1">Payout Frequency</div>
            <div className="text-lg font-medium capitalize">
              {dividendInfo.payoutFrequency}
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Calendar className="h-4 w-4 text-axium-gray-500" />
            <h3 className="text-sm font-medium">Next Payout</h3>
          </div>
          
          <div className="bg-axium-gray-50 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-axium-gray-700">{formatDate(dividendInfo.nextPayoutDate)}</span>
              <span className="text-lg font-semibold">${dividendInfo.nextEstimatedAmount}M</span>
            </div>
            <div className="text-xs text-axium-gray-500 mt-1">
              Estimated total payout pool in millions
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <CoinsIcon className="h-4 w-4 text-axium-gray-500" />
              <h3 className="text-sm font-medium">Payout History</h3>
            </div>
          </div>
          
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={payoutHistory}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10 }}
                  tickMargin={10}
                />
                <YAxis 
                  tickFormatter={(value) => `$${value}M`}
                  tick={{ fontSize: 10 }}
                  width={40}
                />
                <Tooltip 
                  formatter={(value) => [`$${value}M`, 'Payout']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#0050FF" 
                  strokeWidth={2}
                  dot={{ stroke: '#0050FF', strokeWidth: 2, r: 4, fill: 'white' }}
                  activeDot={{ r: 6, stroke: '#0050FF', strokeWidth: 2, fill: '#0050FF' }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };
  
  // Render vesting and staking rules
  const renderVestingRules = () => {
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
          <p>No vesting data available</p>
        </div>
      );
    }
    
    // Process vesting schedule for chart
    const vestingSchedule = vestingRules.tokenLockupSchedule.map(item => ({
      date: formatDate(item.date),
      unlocked: item.unlockPercent,
      locked: 100 - item.unlockPercent
    }));
    
    return (
      <div className="space-y-5">
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Clock className="h-4 w-4 text-axium-gray-500" />
            <h3 className="text-sm font-medium">Creator Vesting Schedule</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-axium-gray-50 rounded-lg p-2">
              <div className="text-xs text-axium-gray-600 mb-1">Initial Unlock</div>
              <div className="text-lg font-medium">{vestingRules.creatorVesting.initialUnlock}%</div>
            </div>
            
            <div className="bg-axium-gray-50 rounded-lg p-2">
              <div className="text-xs text-axium-gray-600 mb-1">Vesting Period</div>
              <div className="text-lg font-medium">{vestingRules.creatorVesting.vestingPeriod} mo</div>
            </div>
            
            <div className="bg-axium-gray-50 rounded-lg p-2">
              <div className="text-xs text-axium-gray-600 mb-1">Monthly Unlock</div>
              <div className="text-lg font-medium">{vestingRules.creatorVesting.monthlyUnlock}%</div>
            </div>
          </div>
          
          <div className="h-[180px] mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={vestingSchedule}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10 }}
                  tickMargin={10}
                />
                <YAxis 
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fontSize: 10 }}
                  width={35}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Unlocked']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="unlocked" 
                  stroke="#0050FF" 
                  strokeWidth={2}
                  dot={{ stroke: '#0050FF', strokeWidth: 2, r: 3, fill: 'white' }}
                  activeDot={{ r: 5, stroke: '#0050FF', strokeWidth: 2, fill: '#0050FF' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Shield className="h-4 w-4 text-axium-gray-500" />
            <h3 className="text-sm font-medium">Investor Staking Rules</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-axium-blue/5 rounded-lg p-2">
              <div className="text-xs text-axium-gray-600 mb-1">Min Period</div>
              <div className="text-lg font-medium">{vestingRules.investorStaking.minStakingPeriod} days</div>
            </div>
            
            <div className="bg-axium-error/5 rounded-lg p-2">
              <div className="text-xs text-axium-gray-600 mb-1">Early Penalty</div>
              <div className="text-lg font-medium">{vestingRules.investorStaking.earlyUnstakePenalty}%</div>
            </div>
            
            <div className="bg-axium-success/5 rounded-lg p-2">
              <div className="text-xs text-axium-gray-600 mb-1">Annual Rewards</div>
              <div className="text-lg font-medium">{vestingRules.investorStaking.stakingRewards}%</div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render liquidation rules
  const renderLiquidationRules = () => {
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
          <p>No liquidation data available</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <div className="bg-axium-error/5 p-3 rounded-lg border border-axium-error/20">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-axium-error" />
            <h3 className="text-sm font-medium text-axium-error">Liquidation Conditions</h3>
          </div>
          
          <div className="text-sm text-axium-gray-700 mb-3">
            {liquidationRules.liquidationProcess}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/50 rounded p-2">
              <div className="text-xs text-axium-gray-600 mb-1">Inactivity Threshold</div>
              <div className="text-lg font-medium">{liquidationRules.inactivityThreshold} days</div>
            </div>
            
            <div className="bg-white/50 rounded p-2">
              <div className="text-xs text-axium-gray-600 mb-1">Minimum Engagement</div>
              <div className="text-lg font-medium">{liquidationRules.engagementMinimum}/100</div>
            </div>
          </div>
          
          <div className="mt-3 p-2 bg-axium-gray-100/50 rounded">
            <div className="text-xs text-axium-gray-600 mb-1">Token Buyback Price</div>
            <div className="text-xl font-semibold">${liquidationRules.tokenBuybackPrice}</div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Warning Thresholds</h3>
          
          {liquidationRules.warningThresholds.map((threshold, idx) => (
            <div key={idx} className="mb-2 last:mb-0 p-2 bg-axium-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">{threshold.metric}</span>
                <Badge variant="outline" className={cn(
                  idx === 0 ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                  idx === 1 ? "bg-orange-50 text-orange-700 border-orange-200" :
                  "bg-red-50 text-red-700 border-red-200"
                )}>
                  {threshold.threshold}
                </Badge>
              </div>
              <div className="text-xs text-axium-gray-600">{threshold.action}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <GlassCard className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <CoinsIcon className="text-axium-blue mr-2 h-5 w-5" />
          Smart Contract {symbol && <span className="text-axium-gray-500 font-normal ml-1">({symbol})</span>}
        </h2>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="dividends">Dividends</TabsTrigger>
          <TabsTrigger value="vesting">Vesting</TabsTrigger>
          <TabsTrigger value="liquidation">Liquidation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dividends" className="pt-2">
          {renderDividendInfo()}
        </TabsContent>
        
        <TabsContent value="vesting" className="pt-2">
          {renderVestingRules()}
        </TabsContent>
        
        <TabsContent value="liquidation" className="pt-2">
          {renderLiquidationRules()}
        </TabsContent>
      </Tabs>
    </GlassCard>
  );
};

export default DividendAndVesting;
