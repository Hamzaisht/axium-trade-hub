
import { Sidebar } from "@/components/layout/Sidebar";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface LayoutShellProps {
  children: ReactNode;
}

export function LayoutShell({ children }: LayoutShellProps) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#080B14] text-gray-900 dark:text-white transition-colors duration-300">
      <Sidebar />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex-1 overflow-hidden flex flex-col"
      >
        {children}
      </motion.div>
    </div>
  );
}
