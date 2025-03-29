
import { Database } from "lucide-react";
import { DarkCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { DashboardShell } from "@/components/layout/DashboardShell";

export const NoAssetsState = () => {
  return (
    <LayoutShell>
      <DashboardShell>
        <div className="flex justify-center items-center min-h-[60vh]">
          <DarkCard className="p-8 max-w-md text-center">
            <Database className="h-16 w-16 mx-auto mb-4 text-[#3AA0FF]/50" />
            <h2 className="text-xl font-semibold mb-2 text-white">No Trading Assets Available</h2>
            <p className="text-[#8A9CCC] mb-6">We couldn't find any trading assets in your account. Please check back later or contact support.</p>
            <div className="flex space-x-4 justify-center">
              <Button variant="outline" className="border-[#1A2747] text-[#8A9CCC] hover:text-white">
                Contact Support
              </Button>
              <Button onClick={() => window.location.reload()} className="bg-[#3AA0FF] hover:bg-[#2D7DD2] text-white">
                Refresh
              </Button>
            </div>
          </DarkCard>
        </div>
      </DashboardShell>
    </LayoutShell>
  );
};
