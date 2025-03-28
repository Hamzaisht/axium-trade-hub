
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import App from './App.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Trading from './pages/Trading.tsx';
import Portfolio from './pages/Portfolio.tsx';
import AIValuation from './pages/AIValuation.tsx';
import NotFound from './pages/NotFound.tsx';
import Index from './pages/Index.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Home from './pages/Home.tsx';
import Creators from './pages/Creators.tsx';
import Profile from './pages/Profile.tsx';
import ProtectedRoute from './components/auth/ProtectedRoute.tsx';
import CreatorDashboard from './pages/CreatorDashboard.tsx';
import LaunchIPO from './pages/LaunchIPO.tsx';
import SettingsPage from './pages/Settings.tsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      {
        path: "/dashboard",
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
      },
      {
        path: "/trading",
        element: <ProtectedRoute><Trading /></ProtectedRoute>,
      },
      {
        path: "/portfolio",
        element: <ProtectedRoute><Portfolio /></ProtectedRoute>,
      },
      {
        path: "/valuation",
        element: <ProtectedRoute><AIValuation /></ProtectedRoute>,
      },
      {
        path: "/home",
        element: <ProtectedRoute><Home /></ProtectedRoute>,
      },
      {
        path: "/creators",
        element: <ProtectedRoute><Creators /></ProtectedRoute>,
      },
      {
        path: "/profile",
        element: <ProtectedRoute><Profile /></ProtectedRoute>,
      },
      {
        path: "/creator-dashboard",
        element: <ProtectedRoute><CreatorDashboard /></ProtectedRoute>,
      },
      {
        path: "/launch-ipo",
        element: <ProtectedRoute><LaunchIPO /></ProtectedRoute>,
      },
      {
        path: "/settings",
        element: <ProtectedRoute><SettingsPage /></ProtectedRoute>,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
