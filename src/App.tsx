import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { IPOProvider } from '@/contexts/IPOContext';
import { PortfolioProvider } from '@/contexts/PortfolioContext';
import { TradingProvider } from '@/contexts/TradingContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { DualToastProvider } from '@/components/ui/DualToastProvider';
import TokenRefreshProvider from '@/auth/TokenRefresh';
import ErrorBoundary from '@/components/common/ErrorBoundary';

// Pages
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Portfolio from '@/pages/Portfolio';
import Creators from '@/pages/Creators';
import Trading from '@/pages/Trading';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import NotFound from '@/pages/NotFound';
import './App.css';

// Create a client for React Query with enhanced error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: import.meta.env.PROD, // Only in production
      onError: (error) => {
        console.error('Query error:', error);
      }
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        console.error('Mutation error:', error);
      }
    }
  },
});

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="light">
        <QueryClientProvider client={queryClient}>
          <Router>
            <AuthProvider>
              <TokenRefreshProvider>
                <IPOProvider>
                  <PortfolioProvider>
                    <TradingProvider>
                      <DualToastProvider />
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        
                        <Route 
                          path="/dashboard" 
                          element={
                            <ProtectedRoute>
                              <ErrorBoundary>
                                <Dashboard />
                              </ErrorBoundary>
                            </ProtectedRoute>
                          } 
                        />
                        
                        <Route 
                          path="/portfolio" 
                          element={
                            <ProtectedRoute>
                              <ErrorBoundary>
                                <Portfolio />
                              </ErrorBoundary>
                            </ProtectedRoute>
                          } 
                        />
                        
                        <Route 
                          path="/creators" 
                          element={
                            <ProtectedRoute>
                              <ErrorBoundary>
                                <Creators />
                              </ErrorBoundary>
                            </ProtectedRoute>
                          } 
                        />
                        
                        <Route 
                          path="/trading" 
                          element={
                            <ProtectedRoute>
                              <ErrorBoundary>
                                <Trading />
                              </ErrorBoundary>
                            </ProtectedRoute>
                          } 
                        />
                        
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </TradingProvider>
                  </PortfolioProvider>
                </IPOProvider>
              </TokenRefreshProvider>
            </AuthProvider>
          </Router>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
