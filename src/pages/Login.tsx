
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";
import Navbar from "@/components/layout/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowLeft, Info, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const from = (location.state as any)?.from?.pathname || '/dashboard';
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate(from, { replace: true });
    return null;
  }
  
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
            
            <div className="max-w-lg w-full">
              <Tabs
                value={authMode}
                onValueChange={(value) => setAuthMode(value as "login" | "register")}
                className="w-full mb-6"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="register">Create Account</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="mt-6">
                  <h1 className="text-3xl font-bold text-center mb-6">Welcome Back</h1>
                  <p className="text-axium-gray-600 text-center max-w-md mx-auto mb-4">
                    Sign in to your account to access your dashboard, portfolio, and trading features.
                  </p>
                </TabsContent>
                
                <TabsContent value="register" className="mt-6">
                  <h1 className="text-3xl font-bold text-center mb-6">Get Started</h1>
                  <p className="text-axium-gray-600 text-center max-w-md mx-auto mb-4">
                    Create an account to start trading creator tokens and access exclusive insights.
                  </p>
                </TabsContent>
              </Tabs>
              
              <Alert variant="warning" className="max-w-md mx-auto mb-6">
                <Info className="h-4 w-4 mr-2" />
                <AlertDescription>
                  Authentication uses Supabase. Create an account to get started.
                </AlertDescription>
              </Alert>
              
              <div className="mb-8">
                <AuthForm mode={authMode} onSuccess={handleSuccess} />
              </div>
              
              <Alert className="max-w-md mx-auto bg-blue-50 border-blue-200">
                <ShieldCheck className="h-4 w-4 mr-2 text-blue-600" />
                <AlertTitle className="text-blue-800">Secure Authentication</AlertTitle>
                <AlertDescription className="text-blue-700 text-sm">
                  Your data is protected with enterprise-grade security. We never store or share your credentials.
                </AlertDescription>
              </Alert>
              
              <div className="text-center mt-4">
                {authMode === "login" ? (
                  <p className="text-axium-gray-600">
                    Don't have an account?{" "}
                    <button 
                      onClick={() => setAuthMode("register")} 
                      className="text-axium-blue hover:underline"
                    >
                      Create one now
                    </button>
                  </p>
                ) : (
                  <p className="text-axium-gray-600">
                    Already have an account?{" "}
                    <button 
                      onClick={() => setAuthMode("login")} 
                      className="text-axium-blue hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
