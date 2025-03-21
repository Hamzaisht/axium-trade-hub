
import { Loader2 } from 'lucide-react';

export const LoadingState = () => {
  return (
    <div className="text-center py-6">
      <Loader2 className="h-6 w-6 text-axium-blue mx-auto animate-spin mb-2" />
      <p className="text-sm text-axium-gray-600">
        Loading external metrics data...
      </p>
    </div>
  );
};
