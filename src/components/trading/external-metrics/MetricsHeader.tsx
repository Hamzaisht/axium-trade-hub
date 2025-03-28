
import { Instagram, DollarSign, ShoppingBag } from 'lucide-react';

interface MetricsHeaderProps {
  tabName: 'social' | 'revenue' | 'brands';
}

export function MetricsHeader({ tabName }: MetricsHeaderProps) {
  const getIcon = () => {
    switch (tabName) {
      case 'social':
        return <Instagram className="h-4 w-4 mr-1" />;
      case 'revenue':
        return <DollarSign className="h-4 w-4 mr-1" />;
      case 'brands':
        return <ShoppingBag className="h-4 w-4 mr-1" />;
    }
  };

  const getLabel = () => {
    switch (tabName) {
      case 'social':
        return 'Social';
      case 'revenue':
        return 'Revenue';
      case 'brands':
        return 'Brands';
    }
  };

  return (
    <>
      {getIcon()}
      <span className="hidden sm:inline">{getLabel()}</span>
    </>
  );
}
