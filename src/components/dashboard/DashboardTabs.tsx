
import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  MessageSquare, 
  BrainCircuit,
  AlertTriangle,
  CircleDollarSign
} from "lucide-react";

interface DashboardTabsProps {
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
          <TrendingUp className="h-4 w-4 mr-2" />
          Trading
        </TabsTrigger>
        <TabsTrigger value="sentiment" className="flex-1 data-[state=active]:bg-white">
          <MessageSquare className="h-4 w-4 mr-2" />
          Sentiment
        </TabsTrigger>
        <TabsTrigger value="ai" className="flex-1 data-[state=active]:bg-white">
          <BrainCircuit className="h-4 w-4 mr-2" />
          AI Insights
        </TabsTrigger>
        <TabsTrigger value="risk" className="flex-1 data-[state=active]:bg-white">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Risk Center
        </TabsTrigger>
        <TabsTrigger value="dividends" className="flex-1 data-[state=active]:bg-white">
          <CircleDollarSign className="h-4 w-4 mr-2" />
          Smart Contract
        </TabsTrigger>
      </TabsList>
      
      {children}
    </Tabs>
  );
};
