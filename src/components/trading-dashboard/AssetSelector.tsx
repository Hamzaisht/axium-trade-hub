
import { Button } from "@/components/ui/button";
import { IPO } from "@/utils/mockApi";

interface AssetSelectorProps {
  ipos: IPO[];
  selectedIPO: IPO | null;
  onSelectIPO: (ipoId: string) => void;
}

export const AssetSelector = ({ ipos, selectedIPO, onSelectIPO }: AssetSelectorProps) => {
  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
      {ipos.map(ipo => (
        <Button
          key={ipo.id}
          variant={selectedIPO?.id === ipo.id ? "default" : "outline"}
          className="whitespace-nowrap"
          onClick={() => onSelectIPO(ipo.id)}
        >
          {ipo.symbol} - {ipo.creatorName}
        </Button>
      ))}
    </div>
  );
};
