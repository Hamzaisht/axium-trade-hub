
import { Droplets } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getTierColor } from "./types";

interface PoolHeaderProps {
  tier: 'standard' | 'enhanced' | 'premium';
}

export const PoolHeader = ({ tier }: PoolHeaderProps) => {
  return (
    <h2 className="text-lg font-semibold flex items-center">
      <Droplets className="h-5 w-5 mr-2 text-axium-blue" />
      Liquidity Pool
      <Badge variant="outline" className="ml-2 text-xs">
        {tier}
      </Badge>
    </h2>
  );
};
