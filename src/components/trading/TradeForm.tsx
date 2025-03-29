
import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { IPO } from "@/utils/mockApi";
import { TradeForm as TradeFormImplementation } from "./trade-form";

interface TradeFormProps {
  ipo: IPO;
  onSuccess?: () => void;
}

const TradeForm = ({ ipo, onSuccess }: TradeFormProps) => {
  return (
    <GlassCard className="w-full p-4">
      <TradeFormImplementation ipo={ipo} onSuccess={onSuccess} />
    </GlassCard>
  );
};

export default TradeForm;
