
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { IPOProvider } from './contexts/IPOContext';
import { TradingProvider } from './contexts/TradingContext';
import { PortfolioProvider } from './contexts/PortfolioContext';
import { ToastContainer } from './components/notifications/ToastContainer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Trading from './pages/Trading';
import CreatorDashboard from './pages/CreatorDashboard';
import LaunchIPO from './pages/LaunchIPO';
import ThemeProvider from './providers/ThemeProvider';
import SettingsPage from './pages/Settings';
import PortfolioPage from './pages/Portfolio';
import AIValuation from './pages/AIValuation';
import TokenRefresh from './auth/TokenRefresh';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <IPOProvider>
              <TradingProvider>
                <PortfolioProvider>
                  <TokenRefresh />
                  <ToastContainer />
                  <Routes>
                    <Route path="/" element={<App />}>
                      <Route index element={<Home />} />
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="login" element={<Login />} />
                      <Route path="register" element={<Register />} />
                      <Route
                        path="profile"
                        element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="trading"
                        element={
                          <ProtectedRoute>
                            <Trading />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="creator-dashboard"
                        element={
                          <ProtectedRoute requiredRole="creator">
                            <CreatorDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="launch-ipo"
                        element={
                          <ProtectedRoute requiredRole="creator">
                            <LaunchIPO />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="settings"
                        element={
                          <ProtectedRoute>
                            <SettingsPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="portfolio"
                        element={
                          <ProtectedRoute>
                            <PortfolioPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="ai-valuation"
                        element={
                          <ProtectedRoute>
                            <AIValuation />
                          </ProtectedRoute>
                        }
                      />
                    </Route>
                  </Routes>
                </PortfolioProvider>
              </TradingProvider>
            </IPOProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
