
import { Skeleton } from "@/components/ui/skeleton";
import { GlassCard } from "@/components/ui/GlassCard";

export const ChartSkeleton = ({ height = "400px" }: { height?: string }) => {
  return (
    <div className="w-full animate-pulse" style={{ height }}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="flex space-x-1">
          {Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-9 w-12" />
          ))}
        </div>
      </div>
      <Skeleton className="h-[calc(100%-48px)] w-full rounded-lg" />
    </div>
  );
};

export const MetricCardSkeleton = () => {
  return (
    <GlassCard className="sm:col-span-1 animate-pulse">
      <div className="flex items-center space-x-3 mb-4">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-5 w-32" />
      </div>
      <Skeleton className="h-8 w-24 mb-2" />
      <Skeleton className="h-4 w-32" />
    </GlassCard>
  );
};

export const TradeFormSkeleton = () => {
  return (
    <GlassCard className="w-full p-6 animate-pulse">
      <Skeleton className="h-8 w-32 mb-6" />
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        
        <div className="border-t border-axium-gray-200 pt-4 mt-4">
          <div className="flex justify-between mb-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex justify-between mb-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
        
        <Skeleton className="h-10 w-full mt-4" />
      </div>
    </GlassCard>
  );
};

export const SentimentInsightsSkeleton = () => {
  return (
    <GlassCard className="p-4 animate-pulse">
      <Skeleton className="h-6 w-40 mb-4" />
      
      <div className="flex flex-col items-center mb-4">
        <Skeleton className="h-12 w-24 mb-2" />
        <Skeleton className="h-6 w-32 mb-1" />
        <Skeleton className="h-4 w-40" />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-40 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-axium-gray-200">
        <div className="flex flex-wrap gap-2 justify-around">
          {Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-6 w-20" />
          ))}
        </div>
      </div>
    </GlassCard>
  );
};
