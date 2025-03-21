
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";
import Navbar from "@/components/layout/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowLeft, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const from = (location.state as any)?.from?.pathname || '/dashboard';
  
  const handleSuccess = () => {
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-axium-gray-100/30">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            <Link to="/" className="flex items-center mb-8 text-axium-blue hover:underline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            
            <h1 className="text-3xl font-bold text-center mb-6">Welcome Back</h1>
            <p className="text-axium-gray-600 text-center max-w-md mb-4">
              Sign in to your account to access your dashboard, portfolio, and trading features.
            </p>
            
            <Alert variant="warning" className="max-w-md mb-6">
              <Info className="h-4 w-4 mr-2" />
              <AlertDescription>
                Authentication now uses Supabase. Create an account to get started.
              </AlertDescription>
            </Alert>
            
            <AuthForm mode="login" onSuccess={handleSuccess} />
            
            <p className="mt-8 text-axium-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-axium-blue hover:underline">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
