
import { AlertCircle, Shield, Database } from 'lucide-react';
import { APIServiceStatus } from '@/hooks/useAPIConfiguration';

interface ApiStatusBadgeProps {
  status: APIServiceStatus;
}

export const ApiStatusBadge = ({ status }: ApiStatusBadgeProps) => {
  switch (status) {
    case 'mock':
      return (
        <div className="ml-2 flex items-center text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
          <AlertCircle className="h-3 w-3 mr-1" />
          Mock Data
        </div>
      );
    case 'live':
      return (
        <div className="ml-2 flex items-center text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
          <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
          Live APIs
        </div>
      );
    case 'secure':
      return (
        <div className="ml-2 flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
          <Shield className="h-3 w-3 mr-1" />
          Secure APIs
        </div>
      );
    case 'mixed':
      return (
        <div className="ml-2 flex items-center text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
          <Database className="h-3 w-3 mr-1" />
          Mixed APIs
        </div>
      );
    default:
      return null;
  }
};
