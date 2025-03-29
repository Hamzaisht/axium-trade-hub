
import { Loader2 } from "lucide-react";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { DashboardShell } from "@/components/layout/DashboardShell";

export const LoadingState = () => {
  return (
    <LayoutShell>
      <DashboardShell>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="flex flex-col items-center bg-black/20 backdrop-blur-lg p-12 rounded-xl border border-axium-neon-blue/20 shadow-[0_0_15px_rgba(30,174,219,0.2)]">
            <Loader2 className="h-14 w-14 text-axium-neon-blue animate-spin mb-4" />
            <div className="text-2xl font-medium text-white">Loading Trading Terminal...</div>
            <div className="text-sm text-[#8A9CCC] mt-2">
              Connecting to market data
              <span className="animate-pulse-subtle">...</span>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-x-8 gap-y-2 text-xs text-[#8A9CCC]/60">
              <div className="flex items-center">
                <div className="h-1 w-1 bg-axium-neon-blue/50 rounded-full mr-2 animate-pulse"></div>
                <span>Order book</span>
              </div>
              <div className="flex items-center">
                <div className="h-1 w-1 bg-axium-neon-blue/50 rounded-full mr-2 animate-pulse animation-delay-200"></div>
                <span>Price data</span>
              </div>
              <div className="flex items-center">
                <div className="h-1 w-1 bg-axium-neon-blue/50 rounded-full mr-2 animate-pulse animation-delay-400"></div>
                <span>Trading engine</span>
              </div>
              <div className="flex items-center">
                <div className="h-1 w-1 bg-axium-neon-blue/50 rounded-full mr-2 animate-pulse animation-delay-600"></div>
                <span>AI insights</span>
              </div>
              <div className="flex items-center">
                <div className="h-1 w-1 bg-axium-neon-blue/50 rounded-full mr-2 animate-pulse animation-delay-400"></div>
                <span>Market depth</span>
              </div>
              <div className="flex items-center">
                <div className="h-1 w-1 bg-axium-neon-blue/50 rounded-full mr-2 animate-pulse animation-delay-200"></div>
                <span>Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </DashboardShell>
    </LayoutShell>
  );
};
