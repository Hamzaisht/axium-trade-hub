
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const RestrictedAccess = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Lock className="h-10 w-10 text-axium-gray-400 mb-3" />
      <h3 className="text-lg font-medium text-axium-gray-700 mb-2">Institutional Access Required</h3>
      <p className="text-sm text-axium-gray-500 text-center max-w-md mb-4">
        Axium Pro provides institutional-grade trading features, including advanced order types,
        liquidity pool access, and high-frequency trading infrastructure.
      </p>
      <Button variant="default">
        Request Access
      </Button>
    </div>
  );
};
