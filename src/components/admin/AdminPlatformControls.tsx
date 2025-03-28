
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { 
  Save,
  AlertTriangle,
  Lock,
  Unlock,
  HelpCircle
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const AdminPlatformControls = () => {
  // Platform fee settings
  const [platformFees, setPlatformFees] = useState({
    ipoFee: 3.5,
    transactionFee: 1.0,
    withdrawalFee: 0.5,
    tradingFee: 0.25,
    creatorRoyalty: 5.0
  });

  // Platform status controls
  const [platformStatus, setPlatformStatus] = useState({
    tradingEnabled: true,
    newIPOsEnabled: true,
    withdrawalsEnabled: true,
    maintenanceMode: false,
    emergencyLock: false
  });

  // Risk management settings
  const [riskSettings, setRiskSettings] = useState({
    maxDailyWithdrawal: 10000,
    maxSingleTransaction: 25000,
    priceChangeThreshold: 25,
    minAIScoreForApproval: 60,
    requiredKYCLevel: 'basic'
  });

  const handleSaveChanges = () => {
    toast.success('Platform settings saved successfully');
  };

  const handleEmergencyLock = () => {
    setPlatformStatus({
      ...platformStatus,
      emergencyLock: !platformStatus.emergencyLock,
      tradingEnabled: platformStatus.emergencyLock, // Enable if we're unlocking
      withdrawalsEnabled: platformStatus.emergencyLock, // Enable if we're unlocking
      newIPOsEnabled: platformStatus.emergencyLock // Enable if we're unlocking
    });
    
    toast({
      description: platformStatus.emergencyLock
        ? "Platform emergency lockdown lifted. All platform operations have been resumed."
        : "EMERGENCY LOCKDOWN ACTIVATED. All trading, withdrawals, and IPO launches have been suspended."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Platform Controls</h2>
        <Button onClick={handleSaveChanges} className="flex gap-1">
          <Save className="h-4 w-4" />
          <span>Save All Changes</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Fee Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Fee Structure</CardTitle>
            <CardDescription>Configure platform-wide fees and revenue sharing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="ipo-fee">IPO Launch Fee (%)</Label>
                  <span className="text-sm text-gray-500">{platformFees.ipoFee}%</span>
                </div>
                <Slider
                  id="ipo-fee"
                  min={0}
                  max={10}
                  step={0.1}
                  value={[platformFees.ipoFee]}
                  onValueChange={(value) => setPlatformFees({...platformFees, ipoFee: value[0]})}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="transaction-fee">Transaction Fee (%)</Label>
                  <span className="text-sm text-gray-500">{platformFees.transactionFee}%</span>
                </div>
                <Slider
                  id="transaction-fee"
                  min={0}
                  max={5}
                  step={0.1}
                  value={[platformFees.transactionFee]}
                  onValueChange={(value) => setPlatformFees({...platformFees, transactionFee: value[0]})}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="withdrawal-fee">Withdrawal Fee (%)</Label>
                  <span className="text-sm text-gray-500">{platformFees.withdrawalFee}%</span>
                </div>
                <Slider
                  id="withdrawal-fee"
                  min={0}
                  max={3}
                  step={0.1}
                  value={[platformFees.withdrawalFee]}
                  onValueChange={(value) => setPlatformFees({...platformFees, withdrawalFee: value[0]})}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="trading-fee">Trading Fee (%)</Label>
                  <span className="text-sm text-gray-500">{platformFees.tradingFee}%</span>
                </div>
                <Slider
                  id="trading-fee"
                  min={0}
                  max={2}
                  step={0.05}
                  value={[platformFees.tradingFee]}
                  onValueChange={(value) => setPlatformFees({...platformFees, tradingFee: value[0]})}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="creator-royalty">Creator Royalty (%)</Label>
                  <span className="text-sm text-gray-500">{platformFees.creatorRoyalty}%</span>
                </div>
                <Slider
                  id="creator-royalty"
                  min={0}
                  max={15}
                  step={0.5}
                  value={[platformFees.creatorRoyalty]}
                  onValueChange={(value) => setPlatformFees({...platformFees, creatorRoyalty: value[0]})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Status Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Status</CardTitle>
            <CardDescription>Control platform-wide operations and access</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="trading-enabled">Enable Trading</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-60">When disabled, all trading operations will be paused. Existing orders will not be processed.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Switch
                  id="trading-enabled"
                  checked={platformStatus.tradingEnabled}
                  onCheckedChange={(checked) => {
                    setPlatformStatus({...platformStatus, tradingEnabled: checked});
                    toast.info(checked ? "Trading has been enabled" : "Trading has been disabled");
                  }}
                  disabled={platformStatus.emergencyLock}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="new-ipos-enabled">Allow New IPOs</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-60">When disabled, new IPO applications and launches will be paused. Existing IPOs will not be affected.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Switch
                  id="new-ipos-enabled"
                  checked={platformStatus.newIPOsEnabled}
                  onCheckedChange={(checked) => {
                    setPlatformStatus({...platformStatus, newIPOsEnabled: checked});
                    toast.info(checked ? "New IPO submissions enabled" : "New IPO submissions disabled");
                  }}
                  disabled={platformStatus.emergencyLock}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="withdrawals-enabled">Allow Withdrawals</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-60">When disabled, users cannot withdraw funds from the platform. Deposits will still be allowed.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Switch
                  id="withdrawals-enabled"
                  checked={platformStatus.withdrawalsEnabled}
                  onCheckedChange={(checked) => {
                    setPlatformStatus({...platformStatus, withdrawalsEnabled: checked});
                    toast.info(checked ? "Withdrawals enabled" : "Withdrawals disabled");
                  }}
                  disabled={platformStatus.emergencyLock}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="maintenance-mode" className="flex items-center gap-1">
                    Maintenance Mode
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-60">When enabled, only admin users can access the platform. All other users will see a maintenance message.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                </div>
                <Switch
                  id="maintenance-mode"
                  checked={platformStatus.maintenanceMode}
                  onCheckedChange={(checked) => {
                    setPlatformStatus({...platformStatus, maintenanceMode: checked});
                    toast.info(checked ? "Maintenance mode activated" : "Maintenance mode deactivated");
                  }}
                  disabled={platformStatus.emergencyLock}
                />
              </div>
            </div>

            <div className="pt-2 border-t">
              <Button 
                variant={platformStatus.emergencyLock ? "outline" : "destructive"}
                size="sm"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleEmergencyLock}
              >
                {platformStatus.emergencyLock ? (
                  <>
                    <Unlock className="h-4 w-4" />
                    <span>Release Emergency Lockdown</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Activate Emergency Lockdown</span>
                  </>
                )}
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Emergency lockdown halts all platform operations instantly.
                Use only in critical situations.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Risk Management Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Management</CardTitle>
            <CardDescription>Configure risk thresholds and safety measures</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="max-daily-withdrawal">Max Daily Withdrawal ($)</Label>
                <div className="flex gap-2">
                  <Input
                    id="max-daily-withdrawal"
                    type="number"
                    value={riskSettings.maxDailyWithdrawal}
                    onChange={(e) => setRiskSettings({
                      ...riskSettings, 
                      maxDailyWithdrawal: parseInt(e.target.value) || 0
                    })}
                  />
                  <Button variant="outline" size="icon">
                    <AlertTriangle className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-transaction">Max Single Transaction ($)</Label>
                <div className="flex gap-2">
                  <Input
                    id="max-transaction"
                    type="number"
                    value={riskSettings.maxSingleTransaction}
                    onChange={(e) => setRiskSettings({
                      ...riskSettings, 
                      maxSingleTransaction: parseInt(e.target.value) || 0
                    })}
                  />
                  <Button variant="outline" size="icon">
                    <AlertTriangle className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="price-change-threshold">Price Change Alert Threshold (%)</Label>
                  <span className="text-sm text-gray-500">{riskSettings.priceChangeThreshold}%</span>
                </div>
                <Slider
                  id="price-change-threshold"
                  min={5}
                  max={50}
                  step={1}
                  value={[riskSettings.priceChangeThreshold]}
                  onValueChange={(value) => setRiskSettings({...riskSettings, priceChangeThreshold: value[0]})}
                />
                <p className="text-xs text-gray-500">
                  Alert when a token price changes by this percentage within 24 hours
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="min-ai-score">Minimum AI Score for Auto-Approval</Label>
                  <span className="text-sm text-gray-500">{riskSettings.minAIScoreForApproval}/100</span>
                </div>
                <Slider
                  id="min-ai-score"
                  min={0}
                  max={100}
                  step={5}
                  value={[riskSettings.minAIScoreForApproval]}
                  onValueChange={(value) => setRiskSettings({...riskSettings, minAIScoreForApproval: value[0]})}
                />
                <p className="text-xs text-gray-500">
                  IPOs with AI scores below this threshold will require manual review
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KYC & Compliance Settings */}
        <Card>
          <CardHeader>
            <CardTitle>KYC & Compliance</CardTitle>
            <CardDescription>Configure user verification and compliance settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="required-kyc-level">Required KYC Level for Trading</Label>
                <select 
                  id="required-kyc-level"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={riskSettings.requiredKYCLevel}
                  onChange={(e) => setRiskSettings({
                    ...riskSettings, 
                    requiredKYCLevel: e.target.value
                  })}
                >
                  <option value="none">None - No verification required</option>
                  <option value="basic">Basic - Email and phone verification</option>
                  <option value="intermediate">Intermediate - ID verification</option>
                  <option value="advanced">Advanced - ID and address verification</option>
                  <option value="full">Full - ID, address, and source of funds</option>
                </select>
              </div>

              <div className="space-y-3 pt-3 border-t">
                <h3 className="font-medium">Compliance Monitoring</h3>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="monitor-large-transactions">Flag Large Transactions</Label>
                  <Switch id="monitor-large-transactions" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="monitor-suspicious-patterns">Detect Suspicious Patterns</Label>
                  <Switch id="monitor-suspicious-patterns" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="restrict-high-risk">Restrict High-Risk Countries</Label>
                  <Switch id="restrict-high-risk" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="aml-screening">AML Screening</Label>
                  <Switch id="aml-screening" defaultChecked />
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <Button variant="outline" size="sm">Configure Compliance Rules</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

