
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Pages
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Creators from "@/pages/Creators";
import Portfolio from "@/pages/Portfolio";
import Trading from "@/pages/Trading";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";

// Components
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Context Providers
import { AuthProvider } from "@/contexts/AuthContext";
import { IPOProvider } from "@/contexts/IPOContext";
import { TradingProvider } from "@/contexts/TradingContext";
import { PortfolioProvider } from "@/contexts/PortfolioContext";

// WebSocket connection
import { mockWebSocket } from "@/utils/mockWebSocket";

// Styles
import "./App.css";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  // Connect to the mock WebSocket when the app loads
  useEffect(() => {
    mockWebSocket.connect();
    
    // Attempt to reconnect if disconnection happens
    const handleConnectionChange = (data: { status: string }) => {
      if (data.status === 'disconnected') {
        setTimeout(() => mockWebSocket.reconnect(), 3000);
      }
    };
    
    mockWebSocket.on("connection", handleConnectionChange);
    
    return () => {
      mockWebSocket.off("connection", handleConnectionChange);
      mockWebSocket.disconnect();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <IPOProvider>
            <TradingProvider>
              <PortfolioProvider>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  
                  {/* Protected routes with role-based access */}
                  {/* Base protection - requires authentication */}
                  <Route element={<ProtectedRoute />}>
                    {/* Dashboard accessible to all authenticated users */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    
                    {/* Portfolio route - mostly for investors */}
                    <Route path="/portfolio" element={<Portfolio />} />
                    
                    {/* Creators section - for both creators and investors */}
                    <Route path="/creators" element={<Creators />} />
                    
                    {/* Trading dashboard - for authenticated users */}
                    <Route path="/trading" element={<Trading />} />
                  </Route>
                  
                  {/* Admin-only routes */}
                  <Route element={<ProtectedRoute requiredRole="admin" />}>
                    {/* Add admin routes here when needed */}
                  </Route>
                  
                  {/* Creator-specific routes */}
                  <Route element={<ProtectedRoute allowInvestor={false} />}>
                    {/* Add creator-only routes here when needed */}
                  </Route>
                  
                  {/* Investor-specific routes */}
                  <Route element={<ProtectedRoute allowCreator={false} />}>
                    {/* Add investor-only routes here when needed */}
                  </Route>
                  
                  {/* 404 route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <SonnerToaster position="top-right" closeButton />
                <Toaster />
              </PortfolioProvider>
            </TradingProvider>
          </IPOProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
