
import { TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderButtonsProps {
  symbol: string;
  onBuyClick: () => void;
  onSellClick: () => void;
}

export const OrderButtons = ({ symbol, onBuyClick, onSellClick }: OrderButtonsProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 mt-6">
      <Button 
        onClick={onBuyClick}
        className="w-full bg-axium-success hover:bg-axium-success/90 rounded-2xl backdrop-blur-md"
      >
        <TrendingUp className="h-4 w-4 mr-2" />
        Buy {symbol}
      </Button>
      <Button 
        onClick={onSellClick}
        className="w-full bg-axium-error hover:bg-axium-error/90 rounded-2xl backdrop-blur-md"
      >
        <TrendingDown className="h-4 w-4 mr-2" />
        Sell {symbol}
      </Button>
    </div>
  );
};
