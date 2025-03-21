
import { useState, useEffect } from 'react';
import { useMarketAnomalies, getSeverityInfo, getSuggestedAction } from '@/hooks/ai/useAnomalyDetection';
import { GlassCard } from '@/components/ui/GlassCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { mockIPOAPI } from '@/utils/mockApi';
import { AnomalyType } from '@/utils/mockAIModels';
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Circle,
  Info,
  Eye,
  Ban,
  Activity,
  Clock
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// Component to display anomaly type icon
const AnomalyTypeIcon = ({ type }: { type: AnomalyType }) => {
  switch (type) {
    case AnomalyType.WASH_TRADING:
    case AnomalyType.CIRCULAR_TRADING:
      return <Activity className="h-5 w-5 text-amber-500" />;
    case AnomalyType.PUMP_AND_DUMP:
      return <TrendingUp className="h-5 w-5 text-red-500" />;
    case AnomalyType.UNUSUAL_VOLUME:
      return <Activity className="h-5 w-5 text-blue-500" />;
    case AnomalyType.RAPID_PRICE_CHANGE:
      return <TrendingDown className="h-5 w-5 text-orange-500" />;
    default:
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
  }
};

// Component to display severity level
const SeverityBadge = ({ severity }: { severity: number }) => {
  const { text, color } = getSeverityInfo(severity);
  
  return (
    <div className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      color === 'green' && "bg-green-100 text-green-800",
      color === 'yellow' && "bg-yellow-100 text-yellow-800",
      color === 'orange' && "bg-orange-100 text-orange-800",
      color === 'red' && "bg-red-100 text-red-800"
    )}>
      <Circle className={cn(
        "mr-1 h-2 w-2",
        color === 'green' && "text-green-600",
        color === 'yellow' && "text-yellow-600",
        color === 'orange' && "text-orange-600",
        color === 'red' && "text-red-600"
      )} />
      {text}
    </div>
  );
};

// Component for action buttons
const ActionButton = ({ action }: { action: string }) => {
  let Icon = Eye;
  let variant: 'default' | 'outline' | 'destructive' = 'outline';
  
  if (action.includes('Freeze')) {
    Icon = Ban;
    variant = 'destructive';
  } else if (action.includes('Alert')) {
    Icon = AlertTriangle;
    variant = 'default';
  } else if (action.includes('Monitor')) {
    Icon = Eye;
  }
  
  return (
    <Button variant={variant} size="sm" className="h-8">
      <Icon className="h-3.5 w-3.5 mr-1" />
      {action}
    </Button>
  );
};

// Main component for the Risk & Anomaly Center
const RiskAnomalyCenter = () => {
  const [ipoIds, setIpoIds] = useState<string[]>([]);
  const [ipoMap, setIpoMap] = useState<Record<string, any>>({});
  const [selectedTab, setSelectedTab] = useState<string>('all');
  
  // Fetch all IPOs to get their IDs
  useEffect(() => {
    const fetchIPOs = async () => {
      try {
        const ipos = await mockIPOAPI.getAllIPOs();
        setIpoIds(ipos.map(ipo => ipo.id));
        
        // Create a map of IPO ID to IPO data for easy lookup
        const map: Record<string, any> = {};
        ipos.forEach(ipo => {
          map[ipo.id] = ipo;
        });
        setIpoMap(map);
      } catch (error) {
        console.error('Error fetching IPOs for anomaly detection:', error);
      }
    };
    
    fetchIPOs();
  }, []);
  
  // Fetch anomalies across all IPOs
  const { data: marketAnomalies, isLoading, refetch } = useMarketAnomalies(ipoIds);
  
  // Get total anomaly count
  const totalAnomalies = marketAnomalies?.reduce(
    (count, item) => count + (item.anomalies?.length || 0), 
    0
  ) || 0;
  
  // Get high severity anomaly count (severity >= 7)
  const highSeverityCount = marketAnomalies?.reduce(
    (count, item) => count + (
      item.anomalies?.filter((a: any) => a.severity >= 7).length || 0
    ), 
    0
  ) || 0;
  
  // Filter anomalies based on selected tab
  const filteredAnomalies = marketAnomalies?.flatMap((item: any) => {
    if (!item.detected || !item.anomalies) return [];
    
    return item.anomalies.map((anomaly: any) => ({
      ...anomaly,
      ipoId: item.ipoId,
      ipoName: ipoMap[item.ipoId]?.creatorName || 'Unknown Creator',
      ipoSymbol: ipoMap[item.ipoId]?.symbol || '???'
    }));
  }).filter((anomaly: any) => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'high' && anomaly.severity >= 7) return true;
    if (selectedTab === 'wash' && (
      anomaly.type === AnomalyType.WASH_TRADING || 
      anomaly.type === AnomalyType.CIRCULAR_TRADING
    )) return true;
    if (selectedTab === 'price' && (
      anomaly.type === AnomalyType.RAPID_PRICE_CHANGE || 
      anomaly.type === AnomalyType.PUMP_AND_DUMP
    )) return true;
    if (selectedTab === 'volume' && anomaly.type === AnomalyType.UNUSUAL_VOLUME) return true;
    return false;
  });
  
  // Format anomaly type for display
  const formatAnomalyType = (type: AnomalyType): string => {
    switch (type) {
      case AnomalyType.WASH_TRADING:
        return 'Wash Trading';
      case AnomalyType.PUMP_AND_DUMP:
        return 'Pump & Dump';
      case AnomalyType.UNUSUAL_VOLUME:
        return 'Unusual Volume';
      case AnomalyType.RAPID_PRICE_CHANGE:
        return 'Rapid Price Change';
      case AnomalyType.CIRCULAR_TRADING:
        return 'Circular Trading';
      case AnomalyType.SPOOFING:
        return 'Order Spoofing';
      default:
        return 'Unknown';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <GlassCard className="w-full md:w-2/3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-axium-gray-900">Risk & Anomaly Center</h2>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <Clock className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
          
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>AI-Powered Anomaly Detection</AlertTitle>
            <AlertDescription>
              AI has detected {totalAnomalies} anomalies in the past 24 hrs across {marketAnomalies?.length || 0} creator tokens. 
              {highSeverityCount > 0 ? (
                <span className="font-medium"> {highSeverityCount} high severity issues require attention.</span>
              ) : (
                " No major market disruptions expected at this time."
              )}
            </AlertDescription>
          </Alert>
          
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="w-full">
              <TabsTrigger value="all">All Anomalies</TabsTrigger>
              <TabsTrigger value="high">High Severity</TabsTrigger>
              <TabsTrigger value="wash">Wash/Circular</TabsTrigger>
              <TabsTrigger value="price">Price Issues</TabsTrigger>
              <TabsTrigger value="volume">Volume Spikes</TabsTrigger>
            </TabsList>
            
            <TabsContent value={selectedTab} className="mt-4">
              {isLoading ? (
                <div className="py-8 text-center text-axium-gray-500">
                  Loading anomaly data...
                </div>
              ) : filteredAnomalies?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Creator</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Detected</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAnomalies.map((anomaly: any, index: number) => (
                      <TableRow key={`${anomaly.ipoId}-${anomaly.type}-${index}`}>
                        <TableCell className="font-medium">
                          {anomaly.ipoName}
                          <span className="text-axium-gray-500 text-xs block">${anomaly.ipoSymbol}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <AnomalyTypeIcon type={anomaly.type} />
                            <span>{formatAnomalyType(anomaly.type)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <SeverityBadge severity={anomaly.severity} />
                        </TableCell>
                        <TableCell>
                          {new Date(anomaly.timestamp).toLocaleTimeString()}
                        </TableCell>
                        <TableCell>
                          <ActionButton action={getSuggestedAction(anomaly.type, anomaly.severity)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-8 text-center text-axium-gray-500">
                  No anomalies detected in this category.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </GlassCard>
        
        <GlassCard className="w-full md:w-1/3">
          <h3 className="text-lg font-semibold mb-4">Market Risk Status</h3>
          
          <div className="space-y-4">
            <div className="p-3 border rounded-lg bg-gray-50">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Overall Risk Level</span>
                <SeverityBadge severity={highSeverityCount > 5 ? 9 : highSeverityCount > 2 ? 6 : 3} />
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full",
                    highSeverityCount > 5 ? "bg-red-500" : 
                    highSeverityCount > 2 ? "bg-yellow-500" : "bg-green-500"
                  )}
                  style={{ width: `${Math.min(100, (totalAnomalies / 10) * 100)}%` }}
                />
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Risk Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Circle className="h-3 w-3 text-red-500 mr-2" />
                    <span>Wash Trading</span>
                  </div>
                  <span className="font-medium">
                    {filteredAnomalies?.filter((a: any) => a.type === AnomalyType.WASH_TRADING).length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Circle className="h-3 w-3 text-orange-500 mr-2" />
                    <span>Price Manipulation</span>
                  </div>
                  <span className="font-medium">
                    {filteredAnomalies?.filter((a: any) => 
                      a.type === AnomalyType.PUMP_AND_DUMP || 
                      a.type === AnomalyType.RAPID_PRICE_CHANGE
                    ).length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Circle className="h-3 w-3 text-blue-500 mr-2" />
                    <span>Volume Anomalies</span>
                  </div>
                  <span className="font-medium">
                    {filteredAnomalies?.filter((a: any) => a.type === AnomalyType.UNUSUAL_VOLUME).length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Circle className="h-3 w-3 text-purple-500 mr-2" />
                    <span>Other Issues</span>
                  </div>
                  <span className="font-medium">
                    {filteredAnomalies?.filter((a: any) => 
                      a.type === AnomalyType.CIRCULAR_TRADING || 
                      a.type === AnomalyType.SPOOFING
                    ).length || 0}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <h4 className="text-sm font-medium mb-3">AI Insights</h4>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm">
                <div className="flex items-start">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-axium-gray-700">
                    {highSeverityCount > 5 ? (
                      "Market shows signs of significant manipulation. Multiple high-severity issues detected across creator tokens."
                    ) : highSeverityCount > 2 ? (
                      "Elevated activity detected in several tokens. Most anomalies appear to be isolated incidents rather than coordinated manipulation."
                    ) : (
                      "Market conditions appear normal. Minor anomalies detected are within expected parameters for a healthy creator economy."
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default RiskAnomalyCenter;
