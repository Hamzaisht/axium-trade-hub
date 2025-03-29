
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';

interface DemoModeContextType {
  isDemo: boolean;
  demoToast: () => void;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [isDemo, setIsDemo] = useState<boolean>(false);

  useEffect(() => {
    // Check URL for demo parameter
    const urlParams = new URLSearchParams(window.location.search);
    const demoParam = urlParams.get('demo');
    
    // Set isDemo to true if demo=true is in URL
    setIsDemo(demoParam === 'true');
    
    // Log status to console
    if (demoParam === 'true') {
      console.log('🚀 Running in DEMO MODE - All transactions are simulated');
    }
  }, []);

  // Function to show demo mode toast
  const demoToast = () => {
    toast.info('Demo Mode: Login to place real trades', {
      id: 'demo-mode-toast',
      duration: 3000,
    });
  };

  return (
    <DemoModeContext.Provider value={{ isDemo, demoToast }}>
      {children}
    </DemoModeContext.Provider>
  );
}

export function useDemoMode() {
  const context = useContext(DemoModeContext);
  if (context === undefined) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
}
