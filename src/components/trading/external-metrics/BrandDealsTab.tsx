
import { formatCurrency, formatPercentage } from './utils';

interface BrandDeal {
  brand: string;
  dealValue: number;
  startDate: string;
  endDate: string;
  engagement: number;
}

interface BrandDealsTabProps {
  brandDeals: BrandDeal[];
}

export const BrandDealsTab = ({ brandDeals }: BrandDealsTabProps) => {
  if (brandDeals.length === 0) {
    return (
      <div className="py-6 text-center text-axium-gray-500">
        <p>No brand deals data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {brandDeals.map((deal, index) => (
        <div key={`${deal.brand}-${index}`} className="bg-white/50 p-3 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <div className="font-medium">{deal.brand}</div>
            <div className="font-semibold text-axium-blue">
              {formatCurrency(deal.dealValue)}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <p className="text-axium-gray-600">Start</p>
              <p className="font-semibold">{deal.startDate}</p>
            </div>
            <div>
              <p className="text-axium-gray-600">End</p>
              <p className="font-semibold">{deal.endDate}</p>
            </div>
            <div>
              <p className="text-axium-gray-600">Engagement</p>
              <p className="font-semibold">{formatPercentage(deal.engagement)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
