
import { Loader2 } from "lucide-react";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { DashboardShell } from "@/components/layout/DashboardShell";

export const LoadingState = () => {
  return (
    <LayoutShell>
      <DashboardShell>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-[#3AA0FF] animate-spin mb-4" />
            <div className="text-lg font-medium text-white">Loading Trading Terminal...</div>
            <div className="text-sm text-[#8A9CCC] mt-2">Connecting to market data</div>
          </div>
        </div>
      </DashboardShell>
    </LayoutShell>
  );
};
