
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white">
      <div className="text-center bg-zinc-800 p-12 rounded-xl border border-zinc-700 shadow-2xl">
        <h1 className="text-6xl font-bold mb-4 text-cyan-400">404</h1>
        <p className="text-2xl text-zinc-300 mb-6">Page not found.</p>
        <p className="text-zinc-500 mb-8">
          The page you're looking for seems to have drifted into the digital void.
        </p>
        <Button 
          onClick={() => navigate('/dashboard')} 
          className="bg-cyan-500 text-white hover:bg-cyan-600 transition-colors"
        >
          <Home className="mr-2 h-5 w-5" />
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
