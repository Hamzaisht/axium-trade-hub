
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
          className={selectedIPO?.id === ipo.id 
            ? "whitespace-nowrap bg-axium-neon-blue text-white shadow-[0_0_10px_rgba(30,174,219,0.3)]" 
            : "whitespace-nowrap border-[#1E375F] text-[#8A9CCC] hover:bg-[#1A2747] hover:text-white"}
          onClick={() => onSelectIPO(ipo.id)}
        >
          <span className="font-semibold">{ipo.symbol}</span>
          <span className="opacity-70 ml-1">- {ipo.creatorName}</span>
        </Button>
      ))}
    </div>
  );
};
