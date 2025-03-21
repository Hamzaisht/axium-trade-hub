import { useState } from "react";
import { 
  AlertTriangle, 
  Server, 
  Network, 
  Clock, 
  Fingerprint,
  Shield,
  Building
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const InfrastructureTab = () => {
  const [vpcEnabled, setVpcEnabled] = useState(true);
  const [coLocationEnabled, setCoLocationEnabled] = useState(false);
  const [fixProtocolEnabled, setFixProtocolEnabled] = useState(true);
  const [redundancyEnabled, setRedundancyEnabled] = useState(true);
  
  return (
    <div className="space-y-6">
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          FIX protocol integration is in maintenance mode. Scheduled upgrades in progress.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Infrastructure settings */}
        <div className="space-y-4">
          <h3 className="text-md font-medium flex items-center">
            <Server className="h-4 w-4 mr-1.5 text-axium-gray-500" />
            Connectivity Options
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="vpc" className="text-sm">VPC Direct Connect</Label>
                <p className="text-xs text-axium-gray-500">Secure private network connection</p>
              </div>
              <Switch 
                id="vpc" 
                checked={vpcEnabled}
                onCheckedChange={setVpcEnabled}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="colocation" className="text-sm">Exchange Co-Location</Label>
                <p className="text-xs text-axium-gray-500">Reduced latency trading servers</p>
              </div>
              <Switch 
                id="colocation" 
                checked={coLocationEnabled}
                onCheckedChange={setCoLocationEnabled}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="fix" className="text-sm">FIX Protocol API</Label>
                <p className="text-xs text-axium-gray-500">
                  Industry-standard financial information exchange
                </p>
              </div>
              <Switch 
                id="fix" 
                checked={fixProtocolEnabled}
                onCheckedChange={setFixProtocolEnabled}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="redundancy" className="text-sm">Geographic Redundancy</Label>
                <p className="text-xs text-axium-gray-500">Multi-region disaster recovery</p>
              </div>
              <Switch 
                id="redundancy" 
                checked={redundancyEnabled}
                onCheckedChange={setRedundancyEnabled}
              />
            </div>
          </div>
        </div>
        
        {/* Performance metrics */}
        <div className="space-y-4">
          <h3 className="text-md font-medium flex items-center">
            <Clock className="h-4 w-4 mr-1.5 text-axium-gray-500" />
            Performance Metrics
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm">Order Execution Latency</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-sm font-medium">12ms</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Average order execution time</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Progress value={12} max={100} className="h-2" />
              <p className="text-xs text-axium-gray-500">
                Industry average: 45ms
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm">API Uptime</Label>
                <span className="text-sm font-medium">99.98%</span>
              </div>
              <Progress value={99.98} max={100} className="h-2" />
              <p className="text-xs text-axium-gray-500">
                Last 30 days
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm">Market Data Freshness</Label>
                <span className="text-sm font-medium">5ms</span>
              </div>
              <Progress value={5} max={100} className="h-2" />
              <p className="text-xs text-axium-gray-500">
                Data propagation delay
              </p>
            </div>
          </div>
        </div>
        
        {/* Security & Compliance */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-md font-medium flex items-center">
            <Shield className="h-4 w-4 mr-1.5 text-axium-gray-500" />
            Security & Compliance
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 border rounded-md">
              <div className="flex items-center space-x-2 mb-2">
                <Fingerprint className="h-4 w-4 text-axium-blue" />
                <Label className="text-sm">MFA Enforcement</Label>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                Enforced
              </span>
            </div>
            
            <div className="p-3 border rounded-md">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="h-4 w-4 text-axium-blue" />
                <Label className="text-sm">Data Encryption</Label>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                AES-256
              </span>
            </div>
            
            <div className="p-3 border rounded-md">
              <div className="flex items-center space-x-2 mb-2">
                <Building className="h-4 w-4 text-axium-blue" />
                <Label className="text-sm">Regulation</Label>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                Compliant
              </span>
            </div>
            
            <div className="p-3 border rounded-md">
              <div className="flex items-center space-x-2 mb-2">
                <Network className="h-4 w-4 text-axium-blue" />
                <Label className="text-sm">IP Whitelisting</Label>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                Enabled
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
