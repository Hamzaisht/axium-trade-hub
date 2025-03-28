
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { IPOProvider } from '@/contexts/IPOContext';
import { PortfolioProvider } from '@/contexts/PortfolioContext';
import { TradingProvider } from '@/contexts/TradingContext';
import { APIConfigurationProvider } from '@/hooks/useAPIConfiguration';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { DualToastProvider } from '@/components/ui/DualToastProvider';
import TokenRefreshProvider from '@/auth/TokenRefresh';

// Pages
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Portfolio from '@/pages/Portfolio';
import Creators from '@/pages/Creators';
import Trading from '@/pages/Trading';
import CreatorProfile from '@/pages/CreatorProfile';
import AIInsights from '@/pages/AIInsights';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import NotFound from '@/pages/NotFound';
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
        <Router>
          <AuthProvider>
            <TokenRefreshProvider>
              <IPOProvider>
                <PortfolioProvider>
                  <TradingProvider>
                    <APIConfigurationProvider>
                      <DualToastProvider />
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        
                        <Route 
                          path="/dashboard" 
                          element={
                            <ProtectedRoute>
                              <Dashboard />
                            </ProtectedRoute>
                          } 
                        />
                        
                        <Route 
                          path="/portfolio" 
                          element={
                            <ProtectedRoute>
                              <Portfolio />
                            </ProtectedRoute>
                          } 
                        />
                        
                        <Route 
                          path="/creators" 
                          element={
                            <ProtectedRoute>
                              <Creators />
                            </ProtectedRoute>
                          } 
                        />
                        
                        <Route 
                          path="/creator/:id" 
                          element={
                            <ProtectedRoute>
                              <CreatorProfile />
                            </ProtectedRoute>
                          } 
                        />
                        
                        <Route 
                          path="/trading" 
                          element={
                            <ProtectedRoute>
                              <Trading />
                            </ProtectedRoute>
                          } 
                        />
                        
                        <Route 
                          path="/ai-insights" 
                          element={
                            <ProtectedRoute>
                              <AIInsights />
                            </ProtectedRoute>
                          } 
                        />
                        
                        <Route 
                          path="/ai-insights/:id" 
                          element={
                            <ProtectedRoute>
                              <AIInsights />
                            </ProtectedRoute>
                          } 
                        />
                        
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </APIConfigurationProvider>
                  </TradingProvider>
                </PortfolioProvider>
              </IPOProvider>
            </TokenRefreshProvider>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
