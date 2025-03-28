
import { Outlet } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { IPOProvider } from '@/contexts/IPOContext';
import { PortfolioProvider } from '@/contexts/PortfolioContext';
import { TradingProvider } from '@/contexts/TradingContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { DualToastProvider } from '@/components/ui/DualToastProvider';
import TokenRefreshProvider from '@/auth/TokenRefresh';
import './App.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TokenRefreshProvider>
            <IPOProvider>
              <PortfolioProvider>
                <TradingProvider>
                  <DualToastProvider />
                  <div className="flex flex-col min-h-screen">
                    <main className="flex-grow">
                      <Outlet />
                    </main>
                  </div>
                </TradingProvider>
              </PortfolioProvider>
            </IPOProvider>
          </TokenRefreshProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
