
import { PieChart, Lock } from "lucide-react";
import { formatNumber } from "./types";

interface TierRequirementsProps {
  minContribution: number;
  lockupPeriod: number;
}

export const TierRequirements = ({ minContribution, lockupPeriod }: TierRequirementsProps) => {
  return (
    <div className="border border-axium-gray-200 rounded-md p-3 mb-4 bg-axium-gray-50">
      <h3 className="text-sm font-medium mb-2 flex items-center">
        <PieChart className="h-4 w-4 mr-1 text-axium-gray-500" />
        Tier Requirements
      </h3>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-axium-gray-500">Min. Entry</span>
          <div className="font-medium">${formatNumber(minContribution)}</div>
        </div>
        
        <div>
          <span className="text-axium-gray-500">Lockup Period</span>
          <div className="font-medium flex items-center">
            <Lock className="h-3 w-3 mr-1 text-axium-gray-500" />
            {lockupPeriod} days
          </div>
        </div>
      </div>
    </div>
  );
};
