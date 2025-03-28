import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import { CreatorService, Creator } from "@/services/CreatorService";
import { useCreatorBySlug, useRecordTradeEvent } from "@/hooks/useCreator";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { CreatorHeader } from "@/components/market/CreatorHeader";
import { CreatorTradeHistory } from "@/components/creator/CreatorTradeHistory";
import TradePanel from "@/components/market/TradePanel";
import SentimentInsights from "@/components/trading/SentimentInsights";
import { ExternalMetricsCard } from "@/components/trading/external-metrics/ExternalMetricsCard";
import { RotateCw, AlertCircle, LayoutDashboard } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MetricCardSkeleton, 
  ChartSkeleton, 
  TradeFormSkeleton,
  SentimentInsightsSkeleton
} from "@/components/ui/skeleton-components";

const MOCK_CREATOR: Creator = {
  id: "demo-123",
  slug: "demo-creator",
  name: "Demo Creator",
  handle: "democreator",
  avatar_url: "https://api.dicebear.com/7.x/personas/svg?seed=demo",
  followers: 1200000,
  engagement: 4.2,
  monthly_income: 85000,
  sponsorships: 12,
  net_worth: 2500000,
  press_mentions: 48,
  stream_views: 15000000,
  ticket_sales: 25000
};

export default function CreatorProfile() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const isDemoMode = searchParams.get("demo") === "true";
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hasLoggedView, setHasLoggedView] = useState(false);
  
  const { 
    data: creator, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useCreatorBySlug(isDemoMode ? "" : slug);
  
  const recordTradeEvent = useRecordTradeEvent();

  const creatorData = isDemoMode ? MOCK_CREATOR : creator;

  useEffect(() => {
    if (creatorData && !hasLoggedView && !isDemoMode) {
      recordTradeEvent.mutate({
        creator_id: creatorData.id,
        event_type: "valuation_update",
        metadata: { action: "view_profile" }
      }, {
        onSuccess: () => {
          setHasLoggedView(true);
          console.log("Logged profile view for creator:", creatorData.slug);
        }
      });
    }
  }, [creatorData, hasLoggedView, isDemoMode, recordTradeEvent]);

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="container mx-auto p-4 space-y-6">
          <div className="h-24 bg-muted/30 animate-pulse rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <ChartSkeleton height="400px" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <MetricCardSkeleton key={i} />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <TradeFormSkeleton />
              <SentimentInsightsSkeleton />
            </div>
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (isError || !creatorData) {
    return (
      <DashboardShell>
        <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[70vh]">
          <Alert variant="destructive" className="max-w-lg mb-6">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Error Loading Creator Profile</AlertTitle>
            <AlertDescription>
              {error ? `${error}` : "Could not load the creator profile. The creator may not exist or there might be a connection issue."}
            </AlertDescription>
          </Alert>
          <div className="flex gap-4">
            <Button onClick={() => refetch()} variant="outline">
              <RotateCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
            <Button onClick={() => navigate("/creators")}>
              Back to Creators
            </Button>
          </div>
        </div>
      </DashboardShell>
    );
  }

  const generateEngagementScore = () => Math.min(99, Math.floor((creatorData.followers / 1000000) * 10 + (creatorData.engagement || 0) * 15));
  const generateAIScore = () => Math.min(95, Math.floor((creatorData.monthly_income / 50000) * 10 + (creatorData.followers / 1000000) * 5 + (creatorData.engagement || 0) * 10));

  return (
    <DashboardShell>
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <CreatorHeader creator={{
            id: creatorData.id,
            creatorName: creatorData.name,
            symbol: creatorData.handle || creatorData.slug,
            initialPrice: 10,
            currentPrice: 15,
            totalSupply: 1000000,
            availableSupply: 500000,
            engagementScore: generateEngagementScore(),
            aiScore: generateAIScore()
          }} />
          
          <Link to={`/creators/${creatorData.slug}/institutional`}>
            <Button variant="outline" size="sm" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Institutional View
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <ExternalMetricsCard creatorId={creatorData.id} />
          </div>
          
          <div className="space-y-6">
            <TradePanel 
              creatorId={creatorData.id} 
              currentPrice={15} 
              symbol={creatorData.handle || creatorData.name} 
            />
            
            <CreatorTradeHistory creatorId={creatorData.id} symbol={creatorData.handle || creatorData.name} />
            
            <SentimentInsights creatorId={creatorData.id} />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
