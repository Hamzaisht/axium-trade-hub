
import { Link, useNavigate } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";
import Navbar from "@/components/layout/Navbar";
import { ArrowLeft, Shield, Lock, Fingerprint } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Register = () => {
  const navigate = useNavigate();
  
  const handleSuccess = () => {
    navigate('/dashboard', { replace: true });
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
            
            <h1 className="text-3xl font-bold text-center mb-4">Create Your Account</h1>
            <p className="text-axium-gray-600 text-center max-w-md mb-8">
              Sign up to start trading creator tokens and access exclusive insights.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-7 gap-8 w-full max-w-6xl">
              <div className="md:col-span-4">
                <AuthForm mode="register" onSuccess={handleSuccess} />
                
                <p className="mt-8 text-axium-gray-600 text-center">
                  Already have an account?{" "}
                  <Link to="/login" className="text-axium-blue hover:underline">
                    Sign in instead
                  </Link>
                </p>
              </div>
              
              <div className="md:col-span-3">
                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center mb-4">
                    <Shield className="h-5 w-5 text-axium-blue mr-2" />
                    <h3 className="text-lg font-semibold">Secure Platform</h3>
                  </div>
                  
                  <Separator className="mb-4" />
                  
                  <div className="space-y-4">
                    <div className="flex">
                      <Lock className="h-4 w-4 text-axium-blue mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-axium-gray-600">
                        <span className="font-medium text-axium-gray-800">End-to-End Encryption</span><br />
                        All your data is encrypted in transit and at rest
                      </p>
                    </div>
                    
                    <div className="flex">
                      <Fingerprint className="h-4 w-4 text-axium-blue mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-axium-gray-600">
                        <span className="font-medium text-axium-gray-800">Privacy First</span><br />
                        We never sell your data or share it with third parties
                      </p>
                    </div>
                    
                    <div className="flex">
                      <Shield className="h-4 w-4 text-axium-blue mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-axium-gray-600">
                        <span className="font-medium text-axium-gray-800">Role-Based Access</span><br />
                        Strict permissions ensure you only see data you're authorized to access
                      </p>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <p className="text-xs text-axium-gray-500 mt-2">
                    By creating an account, you agree to our Terms of Service and Privacy Policy.
                    You can manage your data and privacy settings at any time from your account dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
