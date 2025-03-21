
import { Database } from 'lucide-react';

export const NoDataState = () => {
  return (
    <div className="py-6 text-center text-axium-gray-500">
      <Database className="h-12 w-12 text-axium-gray-400 mx-auto mb-2" />
      <p>No external data available</p>
    </div>
  );
};
