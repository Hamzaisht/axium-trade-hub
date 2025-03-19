
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Twitter, Instagram, Linkedin, Github } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-axium-gray-200 bg-axium-gray-100/50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 font-bold text-2xl mb-4">
              <span className="text-axium-blue">Axium</span>
              <span className="text-axium-gray-800">.io</span>
            </Link>
            <p className="text-axium-gray-600 mb-6 max-w-md">
              Real-time AI-powered trading platform where fans and investors can buy and 
              sell Creator-Linked Tokens, turning a creator's brand value into a tradable 
              financial asset.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-axium-gray-500 hover:text-axium-blue transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-axium-gray-500 hover:text-axium-blue transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-axium-gray-500 hover:text-axium-blue transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-axium-gray-500 hover:text-axium-blue transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-axium-gray-800">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/dashboard" className="text-axium-gray-600 hover:text-axium-blue transition-colors">
                  Trading Dashboard
                </Link>
              </li>
              <li>
                <Link to="/creators" className="text-axium-gray-600 hover:text-axium-blue transition-colors">
                  Creator Tokens
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-axium-gray-600 hover:text-axium-blue transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="#" className="text-axium-gray-600 hover:text-axium-blue transition-colors">
                  IPO Calendar
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-axium-gray-800">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="#" className="text-axium-gray-600 hover:text-axium-blue transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="#" className="text-axium-gray-600 hover:text-axium-blue transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="#" className="text-axium-gray-600 hover:text-axium-blue transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="#" className="text-axium-gray-600 hover:text-axium-blue transition-colors">
                  Press Kit
                </Link>
              </li>
              <li>
                <Link to="#" className="text-axium-gray-600 hover:text-axium-blue transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-axium-gray-200 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center text-axium-gray-500 text-sm">
          <p>© 2023 Axium.io. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="#" className="hover:text-axium-blue transition-colors">
              Terms of Service
            </Link>
            <Link to="#" className="hover:text-axium-blue transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="hover:text-axium-blue transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
