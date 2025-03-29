
import { GlassCard } from "@/components/ui/GlassCard";
import SentimentInsights from "@/components/trading/SentimentInsights";
import { ExternalMetricsCard } from "@/components/trading/external-metrics";
import { ClaudeInsightsCard } from "@/components/market/ClaudeInsightsCard";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { getCreatorById } from "@/mock/creatorData";

interface MetricsGridProps {
  creatorId: string;
}

export const MetricsGrid = ({ creatorId }: MetricsGridProps) => {
  const { isDemo } = useDemoMode();
  
  // For demo mode, get mock creator data
  const mockCreator = isDemo ? getCreatorById(creatorId) : undefined;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <SentimentInsights creatorId={creatorId} className="h-full" />
        <ClaudeInsightsCard 
          creatorId={creatorId} 
          creator={mockCreator}
          className="h-full" 
        />
      </div>
      <ExternalMetricsCard creatorId={creatorId} className="h-full" />
    </div>
  );
};
