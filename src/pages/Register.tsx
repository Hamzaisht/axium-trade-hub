
import { Link, useNavigate } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";
import Navbar from "@/components/layout/Navbar";
import { ArrowLeft } from "lucide-react";

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
            
            <h1 className="text-3xl font-bold text-center mb-6">Create Your Account</h1>
            <p className="text-axium-gray-600 text-center max-w-md mb-10">
              Sign up to start trading creator tokens and access exclusive insights.
            </p>
            
            <AuthForm mode="register" onSuccess={handleSuccess} />
            
            <p className="mt-8 text-axium-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-axium-blue hover:underline">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
