
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { TradingProvider } from "./contexts/TradingContext";
import { IPOProvider } from "./contexts/IPOContext";
import { UserActivityProvider } from "./contexts/UserActivityContext";
import { ThemeProvider } from "./contexts/ThemeContext";

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
                  <Toaster position="top-right" />
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
