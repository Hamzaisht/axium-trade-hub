
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  onRetry: () => void;
}

export const ErrorState = ({ onRetry }: ErrorStateProps) => {
  return (
    <div className="text-center py-6">
      <AlertCircle className="h-8 w-8 text-axium-error mx-auto mb-2" />
      <h4 className="text-axium-error font-medium mb-1">Failed to load external data</h4>
      <p className="text-sm text-axium-gray-600 mb-4">
        There was an error loading external creator metrics
      </p>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRetry}
      >
        Retry
      </Button>
    </div>
  );
};
