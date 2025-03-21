
import { cn } from '@/lib/utils';
import { APIServiceStatus } from '@/hooks/useAPIConfiguration';
import { Badge } from '@/components/ui/badge';
import { InfoIcon, WifiIcon, ShieldAlertIcon, ServerIcon } from 'lucide-react';

interface ApiStatusBadgeProps {
  status: APIServiceStatus;
  className?: string;
}

export const ApiStatusBadge = ({ status, className }: ApiStatusBadgeProps) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'live':
        return {
          icon: <WifiIcon className="h-3 w-3 mr-1" />,
          text: 'Live',
          variant: 'success'
        };
      case 'secure':
        return {
          icon: <ShieldAlertIcon className="h-3 w-3 mr-1" />,
          text: 'Secure',
          variant: 'warning'
        };
      case 'mixed':
        return {
          icon: <ServerIcon className="h-3 w-3 mr-1" />,
          text: 'Mixed',
          variant: 'secondary'
        };
      case 'mock':
      default:
        return {
          icon: <InfoIcon className="h-3 w-3 mr-1" />,
          text: 'Mock',
          variant: 'outline'
        };
    }
  };
  
  const { icon, text, variant } = getStatusInfo();
  
  return (
    <Badge 
      variant={variant as any}
      className={cn(
        "ml-2 text-xs px-1.5 py-0 h-5 font-normal", 
        variant === 'outline' && "border-dashed",
        className
      )}
    >
      {icon}
      {text}
    </Badge>
  );
};
