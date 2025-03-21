
import { DatabaseIcon } from 'lucide-react';

export const NoDataState = () => {
  return (
    <div className="text-center py-6">
      <DatabaseIcon className="h-6 w-6 text-axium-gray-400 mx-auto mb-2" />
      <p className="text-sm text-axium-gray-600">
        No external metrics data available for this creator
      </p>
    </div>
  );
};
