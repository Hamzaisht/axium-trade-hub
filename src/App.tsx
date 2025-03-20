
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";

import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Creators from "@/pages/Creators";
import Portfolio from "@/pages/Portfolio";
import NotFound from "@/pages/NotFound";

// Context Providers
import { AuthProvider } from "@/contexts/AuthContext";
import { IPOProvider } from "@/contexts/IPOContext";
import { TradingProvider } from "@/contexts/TradingContext";
import { PortfolioProvider } from "@/contexts/PortfolioContext";

// WebSocket connection
import { mockWebSocket } from "@/utils/mockWebSocket";

// Components
import "./App.css";

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
    <AuthProvider>
      <IPOProvider>
        <TradingProvider>
          <PortfolioProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/creators" element={<Creators />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
            <SonnerToaster position="top-right" closeButton />
            <Toaster />
          </PortfolioProvider>
        </TradingProvider>
      </IPOProvider>
    </AuthProvider>
  );
}

export default App;
