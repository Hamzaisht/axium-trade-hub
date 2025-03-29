
import { GlassCard } from "@/components/ui/GlassCard";
import SentimentInsights from "@/components/trading/SentimentInsights";
import { ExternalMetricsCard } from "@/components/trading/external-metrics";
import { ClaudeInsightsCard } from "@/components/market/ClaudeInsightsCard";

interface MetricsGridProps {
  creatorId: string;
}

export const MetricsGrid = ({ creatorId }: MetricsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <SentimentInsights creatorId={creatorId} className="h-full" />
        <ClaudeInsightsCard creatorId={creatorId} className="h-full" />
      </div>
      <ExternalMetricsCard creatorId={creatorId} className="h-full" />
    </div>
  );
};
