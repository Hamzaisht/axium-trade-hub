
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
          <DarkCard className="p-8 max-w-md text-center bg-[#0D1424]/90 border border-[#1E375F]/40 shadow-[0_0_20px_rgba(30,55,95,0.1)]">
            <Database className="h-16 w-16 mx-auto mb-6 text-axium-neon-blue opacity-70" />
            <h2 className="text-2xl font-semibold mb-3 text-white">No Trading Assets Available</h2>
            <p className="text-[#8A9CCC] mb-6">We couldn't find any trading assets in your account. Please check back later or contact support.</p>
            <div className="flex space-x-4 justify-center">
              <Button variant="outline" className="border-[#1E375F] text-[#8A9CCC] hover:text-white hover:border-axium-neon-blue hover:bg-[#1E375F]/30">
                Contact Support
              </Button>
              <Button onClick={() => window.location.reload()} className="bg-axium-neon-blue hover:bg-axium-neon-blue/80 text-white shadow-[0_0_10px_rgba(30,174,219,0.3)]">
                Refresh
              </Button>
            </div>
          </DarkCard>
        </div>
      </DashboardShell>
    </LayoutShell>
  );
};
