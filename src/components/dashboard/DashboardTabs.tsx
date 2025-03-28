
import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  MessageSquare, 
  BrainCircuit,
  AlertTriangle,
  CircleDollarSign
} from "lucide-react";

export interface DashboardTabsProps {
  selectedTab: string;
  onTabChange: (tab: string) => void;
  children: ReactNode;
}

export const DashboardTabs = ({ 
  selectedTab, 
  onTabChange,
  children
}: DashboardTabsProps) => {
  return (
    <Tabs value={selectedTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="w-full bg-axium-gray-100 p-1">
        <TabsTrigger value="trading" className="flex-1 data-[state=active]:bg-white">
          <TrendingUp size={16} className="h-4 w-4 mr-2" />
          Trading
        </TabsTrigger>
        <TabsTrigger value="sentiment" className="flex-1 data-[state=active]:bg-white">
          <MessageSquare size={16} className="h-4 w-4 mr-2" />
          Sentiment
        </TabsTrigger>
        <TabsTrigger value="ai" className="flex-1 data-[state=active]:bg-white">
          <BrainCircuit size={16} className="h-4 w-4 mr-2" />
          AI Insights
        </TabsTrigger>
        <TabsTrigger value="risk" className="flex-1 data-[state=active]:bg-white">
          <AlertTriangle size={16} className="h-4 w-4 mr-2" />
          Risk Center
        </TabsTrigger>
        <TabsTrigger value="dividends" className="flex-1 data-[state=active]:bg-white">
          <CircleDollarSign size={16} className="h-4 w-4 mr-2" />
          Smart Contract
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value={selectedTab}>{children}</TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
