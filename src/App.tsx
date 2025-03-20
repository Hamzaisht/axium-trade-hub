
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
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

// Components
import "./App.css";

function App() {
  const { toasts } = useToast();

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
            <Toaster toasts={toasts} />
          </PortfolioProvider>
        </TradingProvider>
      </IPOProvider>
    </AuthProvider>
  );
}

export default App;
