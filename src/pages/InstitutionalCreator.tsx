
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCreatorBySlug } from "@/hooks/useCreator";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { CreatorHeader } from "@/components/market/CreatorHeader";
import { LiveChart } from "@/components/market/LiveChart";
import { TradePanel } from "@/components/market/TradePanel";
import { OrderBookTable } from "@/components/market/OrderBookTable";
import { TabbedPanel } from "@/components/market/TabbedPanel";
import { Sidebar } from "@/components/layout/Sidebar";
import { IPO } from "@/utils/mockApi";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MetricCardSkeleton, 
  ChartSkeleton, 
  TradeFormSkeleton 
} from "@/components/ui/skeleton-components";

export default function InstitutionalCreator() {
  const { slug } = useParams<{ slug: string }>();
  const { data: creator, isLoading, isError } = useCreatorBySlug(slug);
  
  // Generate engagement and AI scores for the creator
  const generateEngagementScore = (creatorData: any) => 
    Math.min(99, Math.floor((creatorData?.followers / 1000000) * 10 + (creatorData?.engagement || 0) * 15));
    
  const generateAIScore = (creatorData: any) => 
    Math.min(95, Math.floor((creatorData?.monthly_income / 50000) * 10 + (creatorData?.followers / 1000000) * 5 + (creatorData?.engagement || 0) * 10));

  // Mock IPO data based on creator data
  const creatorIPO: IPO | null = creator ? {
    id: creator.id,
    creatorName: creator.name,
    symbol: creator.handle || creator.slug,
    initialPrice: 10,
    currentPrice: 15,
    totalSupply: 1000000,
    availableSupply: 500000,
    engagementScore: generateEngagementScore(creator),
    aiScore: generateAIScore(creator)
  } : null;

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="grid grid-cols-[250px_1fr_350px] h-screen gap-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-sm">
            <Skeleton className="h-full" />
          </div>
          <div className="space-y-4">
            <ChartSkeleton height="200px" />
            <ChartSkeleton height="400px" />
          </div>
          <div>
            <TradeFormSkeleton />
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (isError || !creator) {
    return (
      <DashboardShell>
        <div className="grid place-items-center h-screen">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">Error Loading Creator</h2>
            <p className="text-muted-foreground">Could not load creator information.</p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell className="p-0 overflow-hidden">
      <div className="grid grid-cols-[250px_1fr_350px] h-screen overflow-hidden">
        {/* Left Sidebar */}
        <div className="overflow-y-auto border-r border-zinc-800 bg-zinc-900/50">
          <Sidebar />
        </div>
        
        {/* Center Trading Interface */}
        <div className="overflow-y-auto p-4 space-y-4">
          <CreatorHeader creator={creatorIPO} />
          
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-sm p-4 transition-all hover:border-zinc-600">
            <LiveChart creatorId={creator.id} symbol={creatorIPO?.symbol} />
          </div>
          
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-sm p-4 transition-all hover:border-zinc-600">
            <OrderBookTable creatorId={creator.id} symbol={creatorIPO?.symbol} />
          </div>
        </div>
        
        {/* Right Panel */}
        <div className="overflow-y-auto p-4 space-y-4 border-l border-zinc-800 bg-zinc-900/50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-sm transition-all hover:border-zinc-600">
            <TradePanel 
              creatorId={creator.id} 
              currentPrice={creatorIPO?.currentPrice} 
              symbol={creatorIPO?.symbol} 
            />
          </div>
          
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-sm transition-all hover:border-zinc-600">
            <TabbedPanel creatorId={creator.id} />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
