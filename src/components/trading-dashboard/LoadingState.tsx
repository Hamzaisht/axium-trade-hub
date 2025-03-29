
import { Loader2 } from "lucide-react";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { DashboardShell } from "@/components/layout/DashboardShell";

export const LoadingState = () => {
  return (
    <LayoutShell>
      <DashboardShell>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="flex flex-col items-center">
            <Loader2 className="h-14 w-14 text-axium-neon-blue animate-spin mb-4" />
            <div className="text-xl font-medium text-white">Loading Trading Terminal...</div>
            <div className="text-sm text-[#8A9CCC] mt-2">
              Connecting to market data
              <span className="animate-pulse-subtle">...</span>
            </div>
          </div>
        </div>
      </DashboardShell>
    </LayoutShell>
  );
};
