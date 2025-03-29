
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { IPOProvider } from "@/contexts/IPOContext";
import { TradingProvider } from "@/contexts/TradingContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Trading from "./pages/Trading";
import Portfolio from "./pages/Portfolio";
import CreatorProfile from "./pages/CreatorProfile";
import InstitutionalCreator from "./pages/InstitutionalCreator";
import Layout from "./components/layout/Layout";
import { ToastContainer } from "./components/notifications/ToastContainer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <IPOProvider>
              <TradingProvider>
                <div className="min-h-screen font-sans antialiased bg-background text-foreground transition-colors">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route element={<Layout />}>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/trading" element={<Trading />} />
                      <Route path="/portfolio" element={<Portfolio />} />
                      <Route path="/creator/:slug" element={<CreatorProfile />} />
                      <Route path="/institutional/:slug" element={<InstitutionalCreator />} />
                    </Route>
                  </Routes>
                  <ToastContainer />
                </div>
              </TradingProvider>
            </IPOProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
