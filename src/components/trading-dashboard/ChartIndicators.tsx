
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Activity, Layers, TrendingUp, BarChart2, LineChart } from "lucide-react";
import { motion } from "framer-motion";

interface ChartIndicatorsProps {
  showIndicators: {
    volume: boolean;
    sma7: boolean;
    sma30: boolean;
    bollingerBands: boolean;
    vwap: boolean;
  };
  onToggleIndicator: (indicator: keyof typeof showIndicators) => void;
}

export const ChartIndicators = ({
  showIndicators,
  onToggleIndicator
}: ChartIndicatorsProps) => {
  // Motion variants for button hover effects
  const buttonVariants = {
    inactive: { scale: 1, boxShadow: "0px 0px 0px rgba(30, 174, 219, 0)" },
    active: { scale: 1, boxShadow: "0px 0px 15px rgba(30, 174, 219, 0.5)" }
  };

  return (
    <motion.div 
      className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-axium-gray-700/30"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <motion.div
        className="flex items-center"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          size="sm"
          variant={showIndicators.volume ? "default" : "outline"}
          onClick={() => onToggleIndicator("volume")}
          className="h-7 mr-2 text-xs flex items-center space-x-1 relative overflow-hidden group"
          asChild
        >
          <motion.div
            animate={showIndicators.volume ? "active" : "inactive"}
            variants={buttonVariants}
            transition={{ duration: 0.3 }}
          >
            <BarChart2 className="w-3 h-3 mr-1" />
            <span>Volume</span>
            {showIndicators.volume && (
              <motion.div 
                className="absolute inset-0 -z-10 bg-gradient-to-r from-axium-blue/90 to-axium-neon-blue/90"
                layoutId="indicator-highlight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </motion.div>
        </Button>
      </motion.div>

      <motion.div
        className="flex items-center"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          size="sm"
          variant={showIndicators.sma7 ? "default" : "outline"}
          onClick={() => onToggleIndicator("sma7")}
          className="h-7 mr-2 text-xs flex items-center space-x-1 relative overflow-hidden"
          asChild
        >
          <motion.div
            animate={showIndicators.sma7 ? "active" : "inactive"}
            variants={buttonVariants}
            transition={{ duration: 0.3 }}
          >
            <Activity className="w-3 h-3 mr-1" />
            <span>SMA-7</span>
            {showIndicators.sma7 && (
              <motion.div 
                className="absolute inset-0 -z-10 bg-gradient-to-r from-green-600/90 to-green-400/90"
                layoutId="indicator-highlight-sma7"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </motion.div>
        </Button>
      </motion.div>

      <motion.div
        className="flex items-center"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          size="sm"
          variant={showIndicators.sma30 ? "default" : "outline"}
          onClick={() => onToggleIndicator("sma30")}
          className="h-7 mr-2 text-xs flex items-center space-x-1 relative overflow-hidden"
          asChild
        >
          <motion.div
            animate={showIndicators.sma30 ? "active" : "inactive"}
            variants={buttonVariants}
            transition={{ duration: 0.3 }}
          >
            <LineChart className="w-3 h-3 mr-1" />
            <span>SMA-30</span>
            {showIndicators.sma30 && (
              <motion.div 
                className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-600/90 to-purple-400/90"
                layoutId="indicator-highlight-sma30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </motion.div>
        </Button>
      </motion.div>

      <motion.div
        className="flex items-center"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          size="sm"
          variant={showIndicators.bollingerBands ? "default" : "outline"}
          onClick={() => onToggleIndicator("bollingerBands")}
          className="h-7 mr-2 text-xs flex items-center space-x-1 relative overflow-hidden"
          asChild
        >
          <motion.div
            animate={showIndicators.bollingerBands ? "active" : "inactive"}
            variants={buttonVariants}
            transition={{ duration: 0.3 }}
          >
            <Layers className="w-3 h-3 mr-1" />
            <span>Bollinger</span>
            {showIndicators.bollingerBands && (
              <motion.div 
                className="absolute inset-0 -z-10 bg-gradient-to-r from-axium-neon-blue/90 to-axium-neon-teal/90"
                layoutId="indicator-highlight-bb"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </motion.div>
        </Button>
      </motion.div>

      <motion.div
        className="flex items-center"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          size="sm"
          variant={showIndicators.vwap ? "default" : "outline"}
          onClick={() => onToggleIndicator("vwap")}
          className="h-7 mr-2 text-xs flex items-center space-x-1 relative overflow-hidden"
          asChild
        >
          <motion.div
            animate={showIndicators.vwap ? "active" : "inactive"}
            variants={buttonVariants}
            transition={{ duration: 0.3 }}
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            <span>VWAP</span>
            {showIndicators.vwap && (
              <motion.div 
                className="absolute inset-0 -z-10 bg-gradient-to-r from-amber-600/90 to-amber-400/90"
                layoutId="indicator-highlight-vwap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </motion.div>
        </Button>
      </motion.div>
    </motion.div>
  );
};
