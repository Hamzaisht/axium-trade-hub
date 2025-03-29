
import { OrderType } from "./types";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Clock,
  Check,
  ShieldAlert,
  XCircle,
  ArrowRightLeft,
  BarChart3,
  Timer
} from "lucide-react";

interface OrderTypeSelectorProps {
  value: OrderType;
  onChange: (value: OrderType) => void;
  isInstitutional: boolean;
}

export const OrderTypeSelector = ({ value, onChange, isInstitutional }: OrderTypeSelectorProps) => {
  const getOrderTypeIcon = (type: OrderType) => {
    switch (type) {
      case 'market': return <Clock className="h-4 w-4" />;
      case 'limit': return <Check className="h-4 w-4" />;
      case 'stop': return <ShieldAlert className="h-4 w-4" />;
      case 'stop-limit': return <XCircle className="h-4 w-4" />;
      case 'oco': return <ArrowRightLeft className="h-4 w-4" />;
      case 'iceberg': return <BarChart3 className="h-4 w-4" />;
      case 'bracket': return <ArrowRightLeft className="h-4 w-4" />;
      case 'twap': return <Timer className="h-4 w-4" />;
      case 'vwap': return <BarChart3 className="h-4 w-4" />;
      default: return <Check className="h-4 w-4" />;
    }
  };

  const getOrderTypeDescription = (type: OrderType) => {
    switch (type) {
      case 'market': return "Executes immediately at the best available price.";
      case 'limit': return "Execute at the specified price or better.";
      case 'stop': return "Triggers a market order when the stop price is reached.";
      case 'stop-limit': return "Triggers a limit order when the stop price is reached.";
      case 'oco': return "One-Cancels-Other: Place stop loss and take profit simultaneously.";
      case 'iceberg': return "Large orders divided into smaller visible portions.";
      case 'bracket': return "Entry order with stop loss and take profit attached.";
      case 'twap': return "Time-Weighted Average Price: Executes over time intervals.";
      case 'vwap': return "Volume-Weighted Average Price: Executes based on volume profile.";
      default: return "";
    }
  };

  return (
    <div className="mb-6">
      <Label htmlFor="order-type" className="mb-2 block">Order Type</Label>
      <Select
        value={value}
        onValueChange={(value) => onChange(value as OrderType)}
      >
        <SelectTrigger id="order-type" className="w-full">
          <SelectValue placeholder="Select order type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="market">Market</SelectItem>
          <SelectItem value="limit">Limit</SelectItem>
          <SelectItem value="stop">Stop</SelectItem>
          <SelectItem value="stop-limit">Stop-Limit</SelectItem>
          <SelectItem value="oco">OCO (One-Cancels-Other)</SelectItem>
          {isInstitutional && (
            <>
              <SelectItem value="iceberg">Iceberg</SelectItem>
              <SelectItem value="bracket">Bracket</SelectItem>
              <SelectItem value="twap">TWAP</SelectItem>
              <SelectItem value="vwap">VWAP</SelectItem>
            </>
          )}
        </SelectContent>
      </Select>
      
      {/* Help text for the selected order type */}
      <div className="mt-2 text-xs text-axium-gray-500 flex items-start">
        <div className="mr-2 mt-0.5">
          {getOrderTypeIcon(value)}
        </div>
        <p>{getOrderTypeDescription(value)}</p>
      </div>
    </div>
  );
};
