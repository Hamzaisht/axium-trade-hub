
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  onRetry: () => void;
}

export const ErrorState = ({ onRetry }: ErrorStateProps) => {
  return (
    <div className="py-6 text-center text-axium-gray-500">
      <AlertCircle className="h-12 w-12 text-axium-error mx-auto mb-2" />
      <p className="mb-2">Failed to load external metrics</p>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRetry} 
        className="mt-2"
      >
        Try Again
      </Button>
    </div>
  );
};
