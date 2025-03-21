
import { Progress } from "@/components/ui/progress";
import { formatPercent } from "./types";

interface UtilizationRateProps {
  utilizationRate: number;
}

export const UtilizationRate = ({ utilizationRate }: UtilizationRateProps) => {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-1 text-sm">
        <span>Utilization Rate</span>
        <span className="font-medium">{formatPercent(utilizationRate)}</span>
      </div>
      <Progress value={utilizationRate} className="h-2" />
    </div>
  );
};
