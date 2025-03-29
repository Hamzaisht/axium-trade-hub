
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ThemeProvider } from "./contexts/ThemeContext";
import MarbleBackground from "./components/home/MarbleBackground";

// Pages
import Index from "./pages/Index";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Trading from "./pages/Trading";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Portfolio from "./pages/Portfolio";
import Creators from "./pages/Creators";
import CreatorProfile from "./pages/CreatorProfile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Providers - imported after Router so useNavigate works
import { AuthProvider } from "./contexts/AuthContext";
import { TradingProvider } from "./contexts/TradingContext";
import { IPOProvider } from "./contexts/IPOContext";
import { UserActivityProvider } from "./contexts/UserActivityContext";

// Styles
import "./App.css";

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <TradingProvider>
              <IPOProvider>
                <UserActivityProvider>
                  {/* Animated background - placed here so it's available on all pages */}
                  <MarbleBackground />
                  
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/index" element={<Index />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/trading" element={<Trading />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/creators" element={<Creators />} />
                    <Route path="/creators/:slug" element={<CreatorProfile />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Toaster position="top-right" toastOptions={{
                    style: {
                      background: 'rgba(13, 20, 36, 0.95)',
                      border: '1px solid rgba(54, 118, 255, 0.3)',
                      backdropFilter: 'blur(8px)',
                      color: 'white',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2), 0 0 15px rgba(54, 118, 255, 0.3)'
                    }
                  }} />
                </UserActivityProvider>
              </IPOProvider>
            </TradingProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
