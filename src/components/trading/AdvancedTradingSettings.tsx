
import { useState } from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  SlidersHorizontal, 
  BarChart3, 
  LineChart, 
  CandlestickChart, 
  Globe,
  Lock,
  ShieldCheck,
  KeyRound,
  Building2,
  Network,
  Timer,
  AreaChart,
  BarChart4
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useAPIConfiguration, APIServiceStatus } from "@/hooks/useAPIConfiguration";
import { toast } from "@/components/ui/use-toast";

export interface TimeframeOption {
  label: string;
  value: string;
  interval?: string;
  days?: number;
  isYTD?: boolean;
}

export interface TechnicalIndicator {
  id: string;
  name: string;
  enabled: boolean;
}

interface RegionCompliance {
  region: 'US' | 'EU' | 'Asia' | 'Global';
  enabled: boolean;
  restrictedFeatures?: string[];
}

interface InstitutionalOption {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  requiresAccess: 'standard' | 'pro' | 'enterprise';
}

interface AdvancedTradingSettingsProps {
  timeframes: TimeframeOption[];
  selectedTimeframe: TimeframeOption;
  onTimeframeChange: (timeframe: TimeframeOption) => void;
  chartType: 'line' | 'candle';
  onChartTypeChange: (type: 'line' | 'candle') => void;
  technicalIndicators: TechnicalIndicator[];
  onTechnicalIndicatorToggle: (id: string, enabled: boolean) => void;
  className?: string;
}

export const AdvancedTradingSettings = ({
  timeframes,
  selectedTimeframe,
  onTimeframeChange,
  chartType,
  onChartTypeChange,
  technicalIndicators,
  onTechnicalIndicatorToggle,
  className
}: AdvancedTradingSettingsProps) => {
  const [isIndicatorsOpen, setIsIndicatorsOpen] = useState(false);
  const [isComplianceOpen, setIsComplianceOpen] = useState(false);
  const [isInstitutionalOpen, setIsInstitutionalOpen] = useState(false);
  const [institutionalMode, setInstitutionalMode] = useState(false);
  
  const { user } = useAuth();
  const { apiServiceStatus } = useAPIConfiguration();
  
  // Simulated compliance settings
  const [complianceSettings, setComplianceSettings] = useState<RegionCompliance[]>([
    { region: 'US', enabled: true, restrictedFeatures: ['AI trading automation'] },
    { region: 'EU', enabled: true, restrictedFeatures: ['Creator tokens without prospectus'] },
    { region: 'Asia', enabled: false, restrictedFeatures: ['Dividend-yielding tokens'] },
    { region: 'Global', enabled: true }
  ]);
  
  // Institutional-grade trading options
  const [institutionalOptions, setInstitutionalOptions] = useState<InstitutionalOption[]>([
    { 
      id: 'hft', 
      name: 'High-Frequency Trading', 
      description: 'Low-latency co-location for ultra-fast execution',
      enabled: false,
      requiresAccess: 'enterprise'
    },
    { 
      id: 'dma', 
      name: 'Direct Market Access', 
      description: 'Direct order routing to liquidity pools',
      enabled: false,
      requiresAccess: 'pro'
    },
    { 
      id: 'sor', 
      name: 'Smart Order Routing', 
      description: 'Automatic best-price execution across pools',
      enabled: true,
      requiresAccess: 'pro'
    },
    { 
      id: 'darkpool', 
      name: 'Dark Pool Access', 
      description: 'Hidden liquidity for large orders',
      enabled: false,
      requiresAccess: 'enterprise'
    },
    { 
      id: 'twap', 
      name: 'TWAP/VWAP Execution', 
      description: 'Time/Volume-weighted execution algorithms',
      enabled: false,
      requiresAccess: 'pro'
    }
  ]);
  
  // Toggle compliance for a region
  const toggleRegionCompliance = (region: 'US' | 'EU' | 'Asia' | 'Global') => {
    setComplianceSettings(prev => 
      prev.map(setting => 
        setting.region === region 
          ? { ...setting, enabled: !setting.enabled } 
          : setting
      )
    );
  };
  
  // Toggle institutional trading features
  const toggleInstitutionalOption = (id: string) => {
    const option = institutionalOptions.find(opt => opt.id === id);
    
    if (option) {
      // Check if user has access to this feature
      const hasAccess = 
        (option.requiresAccess === 'standard') || 
        (option.requiresAccess === 'pro' && (user?.role === 'admin' || user?.role === 'investor')) ||
        (option.requiresAccess === 'enterprise' && user?.role === 'admin');
        
      if (!hasAccess) {
        toast({
          title: "Access Restricted",
          description: `${option.name} requires ${option.requiresAccess} access. Please upgrade your account.`,
          variant: "destructive"
        });
        return;
      }
      
      setInstitutionalOptions(prev => 
        prev.map(opt => 
          opt.id === id 
            ? { ...opt, enabled: !opt.enabled } 
            : opt
        )
      );
      
      // Show confirmation toast
      toast({
        title: option.enabled ? `${option.name} Disabled` : `${option.name} Enabled`,
        description: option.enabled 
          ? `You've turned off ${option.name}`
          : `You've activated ${option.name}. This may affect your trading experience.`,
      });
    }
  };
  
  // Service API status indicator
  const renderAPIStatusBadge = () => {
    switch (apiServiceStatus) {
      case 'live':
        return (
          <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
            Live API
          </Badge>
        );
      case 'secure':
        return (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            Secure API
          </Badge>
        );
      case 'mock':
        return (
          <Badge variant="outline" className="border-gray-300 text-gray-600">
            Mock Data
          </Badge>
        );
      case 'mixed':
        return (
          <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
            Mixed APIs
          </Badge>
        );
    }
  };
  
  // Calculate timeframes to display based on user access level
  const visibleTimeframes = timeframes.filter(tf => {
    // Simple users don't get access to very fine-grained timeframes
    if ((tf.value === '1m' || tf.value === '5m') && !user?.role) {
      return false;
    }
    return true;
  });
  
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <div className="flex items-center space-x-1 overflow-x-auto thin-scrollbar">
        {visibleTimeframes.map((timeframe) => (
          <Button
            key={timeframe.value}
            variant="ghost"
            size="sm"
            className={cn(
              "px-3 py-1 h-8",
              selectedTimeframe.value === timeframe.value
                ? "bg-axium-blue text-white hover:bg-axium-blue"
                : "text-axium-gray-600 hover:text-axium-blue"
            )}
            onClick={() => onTimeframeChange(timeframe)}
          >
            {timeframe.label}
          </Button>
        ))}
      </div>
      
      <div className="flex border-l border-gray-200 pl-2 ml-1">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "px-3 py-1 h-8",
            chartType === 'line'
              ? "bg-axium-blue text-white hover:bg-axium-blue"
              : "text-axium-gray-600 hover:text-axium-blue"
          )}
          onClick={() => onChartTypeChange('line')}
        >
          <LineChart className="h-4 w-4 mr-1" />
          Line
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "px-3 py-1 h-8",
            chartType === 'candle'
              ? "bg-axium-blue text-white hover:bg-axium-blue"
              : "text-axium-gray-600 hover:text-axium-blue"
          )}
          onClick={() => onChartTypeChange('candle')}
        >
          <CandlestickChart className="h-4 w-4 mr-1" />
          Candle
        </Button>
      </div>
      
      <DropdownMenu open={isIndicatorsOpen} onOpenChange={setIsIndicatorsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <SlidersHorizontal className="h-4 w-4 mr-1" />
            Indicators
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 p-4">
          <DropdownMenuLabel>Technical Indicators</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="space-y-3 mt-2">
            {technicalIndicators.map((indicator) => (
              <div key={indicator.id} className="flex items-center justify-between">
                <Label htmlFor={indicator.id}>{indicator.name}</Label>
                <Switch 
                  id={indicator.id} 
                  checked={indicator.enabled} 
                  onCheckedChange={(checked) => 
                    onTechnicalIndicatorToggle(indicator.id, checked)
                  }
                />
              </div>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <DropdownMenu open={isComplianceOpen} onOpenChange={setIsComplianceOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <Globe className="h-4 w-4 mr-1" />
            Compliance
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 p-4">
          <DropdownMenuLabel>Regional Compliance</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="space-y-3 mt-2">
            {complianceSettings.map((region) => (
              <div key={region.region} className="flex items-center justify-between">
                <div>
                  <Label htmlFor={`region-${region.region}`} className="flex items-center">
                    {region.region}
                    {region.restrictedFeatures && region.enabled && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        {region.restrictedFeatures.length} restrictions
                      </Badge>
                    )}
                  </Label>
                  {region.restrictedFeatures && region.enabled && (
                    <p className="text-axium-gray-500 text-xs mt-1">
                      {region.restrictedFeatures[0]}{region.restrictedFeatures.length > 1 ? '...' : ''}
                    </p>
                  )}
                </div>
                <Switch 
                  id={`region-${region.region}`} 
                  checked={region.enabled} 
                  onCheckedChange={() => toggleRegionCompliance(region.region)}
                />
              </div>
            ))}
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator className="my-3" />
          
          <DropdownMenuLabel className="flex items-center">
            <Lock className="h-4 w-4 mr-1 text-axium-gray-500" />
            Security Settings
          </DropdownMenuLabel>
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="2fa" className="text-sm">2FA Required</Label>
              <Switch id="2fa" checked={true} disabled />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="trade-limit" className="text-sm">Trade Limits</Label>
              <Switch id="trade-limit" checked={true} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="kyc" className="text-sm">KYC Verified</Label>
              <Switch id="kyc" checked={user?.kycVerified || false} disabled />
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* New Institutional Features Dropdown */}
      <DropdownMenu open={isInstitutionalOpen} onOpenChange={setIsInstitutionalOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <Network className="h-4 w-4 mr-1" />
            Advanced
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72 p-4">
          <DropdownMenuLabel className="flex items-center">
            <Timer className="h-4 w-4 mr-2 text-axium-gray-500" />
            Execution Options
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="space-y-3 mt-2">
            {institutionalOptions.filter(opt => 
              opt.id === 'hft' || opt.id === 'dma' || opt.id === 'sor'
            ).map((option) => (
              <div key={option.id} className="flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor={option.id} className="flex items-center">
                    {option.name}
                    {option.requiresAccess !== 'standard' && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        {option.requiresAccess}
                      </Badge>
                    )}
                  </Label>
                  <Switch 
                    id={option.id} 
                    checked={option.enabled} 
                    onCheckedChange={() => toggleInstitutionalOption(option.id)}
                    disabled={
                      (option.requiresAccess === 'pro' && !(user?.role === 'admin' || user?.role === 'investor')) ||
                      (option.requiresAccess === 'enterprise' && user?.role !== 'admin')
                    }
                  />
                </div>
                <p className="text-xs text-axium-gray-500">{option.description}</p>
              </div>
            ))}
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator className="my-3" />
          
          <DropdownMenuLabel className="flex items-center">
            <AreaChart className="h-4 w-4 mr-2 text-axium-gray-500" />
            Advanced Order Types
          </DropdownMenuLabel>
          <DropdownMenuGroup className="space-y-3 mt-2">
            {institutionalOptions.filter(opt => 
              opt.id === 'darkpool' || opt.id === 'twap'
            ).map((option) => (
              <div key={option.id} className="flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor={option.id} className="flex items-center">
                    {option.name}
                    {option.requiresAccess !== 'standard' && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        {option.requiresAccess}
                      </Badge>
                    )}
                  </Label>
                  <Switch 
                    id={option.id} 
                    checked={option.enabled} 
                    onCheckedChange={() => toggleInstitutionalOption(option.id)}
                    disabled={
                      (option.requiresAccess === 'pro' && !(user?.role === 'admin' || user?.role === 'investor')) ||
                      (option.requiresAccess === 'enterprise' && user?.role !== 'admin')
                    }
                  />
                </div>
                <p className="text-xs text-axium-gray-500">{option.description}</p>
              </div>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Institutional features */}
      {user?.role === 'admin' || user?.role === 'investor' ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" size="sm" className="h-8 bg-axium-blue">
              <Building2 className="h-4 w-4 mr-1" />
              Axium Pro
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64">
            <DropdownMenuLabel className="flex items-center">
              <KeyRound className="h-4 w-4 mr-1 text-axium-blue" />
              Institutional Features
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <ShieldCheck className="h-4 w-4 mr-2 text-axium-gray-500" />
              Liquidity Provider Tools
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BarChart3 className="h-4 w-4 mr-2 text-axium-gray-500" />
              Market Making Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BarChart4 className="h-4 w-4 mr-2 text-axium-gray-500" />
              Volume Rebate Tiers
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Globe className="h-4 w-4 mr-2 text-axium-gray-500" />
                API Access
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>Trading API Keys</DropdownMenuItem>
                  <DropdownMenuItem>Data Feed Access</DropdownMenuItem>
                  <DropdownMenuItem>Webhook Configuration</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="institutional-mode" className="text-sm font-medium">
                  Pro Trading Mode
                </Label>
                <Switch 
                  id="institutional-mode" 
                  checked={institutionalMode}
                  onCheckedChange={setInstitutionalMode}
                />
              </div>
              {renderAPIStatusBadge()}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  );
};

export default AdvancedTradingSettings;
