
import { formatCurrency, formatPercentage } from './utils';
import { BrandDeal } from '@/types/api';
import { formatCompactNumber } from '@/utils/formatters';

interface BrandDealsTabProps {
  brandDeals: BrandDeal[];
}

export function BrandDealsTab({ brandDeals }: BrandDealsTabProps) {
  const formatBrandDeals = () => {
    if (!brandDeals || brandDeals.length === 0) {
      return [
        { name: 'Nike', value: 150000, startDate: '01/01/2023', endDate: '12/31/2023', engagement: 4.2 },
        { name: 'Adidas', value: 120000, startDate: '03/15/2023', endDate: '09/15/2023', engagement: 3.8 },
        { name: 'Spotify', value: 100000, startDate: '02/01/2023', endDate: '08/01/2023', engagement: 5.1 }
      ];
    }
    
    return brandDeals.map(deal => ({
      name: deal.brand,
      value: deal.dealValue,
      startDate: new Date(deal.startDate).toLocaleDateString(),
      endDate: new Date(deal.endDate).toLocaleDateString(),
      engagement: deal.engagement
    })).sort((a, b) => b.value - a.value);
  };

  const deals = formatBrandDeals();

  return (
    <div>
      <div className="h-[180px] overflow-auto pr-2">
        <table className="w-full text-sm">
          <thead className="text-xs text-axium-gray-600">
            <tr>
              <th className="text-left py-2">Brand</th>
              <th className="text-right py-2">Value</th>
              <th className="text-right py-2">Engagement</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal, index) => (
              <tr key={index} className="border-t border-axium-gray-200">
                <td className="py-2">{deal.name}</td>
                <td className="text-right py-2">${formatCompactNumber(deal.value)}</td>
                <td className="text-right py-2">{deal.engagement}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="text-xs text-axium-gray-600 mt-2">
        Total brand deals: {brandDeals?.length || 0} • 
        Total value: ${formatCompactNumber(brandDeals?.reduce((sum, deal) => sum + deal.dealValue, 0) || 0)}
      </div>
    </div>
  );
}
