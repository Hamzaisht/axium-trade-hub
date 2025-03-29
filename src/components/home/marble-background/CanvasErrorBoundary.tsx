
import React, { useState, useEffect } from 'react';

interface CanvasErrorBoundaryProps {
  children: React.ReactNode;
}

// Error boundary for Canvas
export const CanvasErrorBoundary: React.FC<CanvasErrorBoundaryProps> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    const handleError = () => {
      setHasError(true);
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  
  if (hasError) {
    return (
      <div className="fixed inset-0 w-full h-full -z-10 bg-gradient-to-b from-[#0A0E17] via-[#0D1424] to-[#0A0E17]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,174,219,0.1),transparent_70%)]"></div>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default CanvasErrorBoundary;
