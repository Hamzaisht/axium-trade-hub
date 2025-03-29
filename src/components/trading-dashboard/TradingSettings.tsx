
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export const TradingSettings = () => {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Trading Settings</h3>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Configure
        </Button>
      </div>
      <div className="space-y-2 text-sm text-axium-gray-600">
        <div className="flex justify-between">
          <span>Execution Mode</span>
          <span className="font-medium">Standard</span>
        </div>
        <div className="flex justify-between">
          <span>Default Order Type</span>
          <span className="font-medium">Limit</span>
        </div>
        <div className="flex justify-between">
          <span>Confirmation</span>
          <span className="font-medium">Required</span>
        </div>
        <div className="flex justify-between">
          <span>Price Alerts</span>
          <span className="font-medium">Enabled</span>
        </div>
      </div>
    </GlassCard>
  );
};
