import { useState } from 'react';
import CubeScene from '../three-d/CubeScene'; 
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Box, RotateCcw, ZoomIn } from 'lucide-react';

const AnimatedCubeExample = () => {
  const [cubeSize, setCubeSize] = useState(1.5);
  const [resetKey, setResetKey] = useState(0);
  
  const handleReset = () => {
    setCubeSize(1.5);
    setResetKey(prev => prev + 1);
  };
  
  const handleIncrease = () => {
    setCubeSize(prev => Math.min(prev + 0.2, 2.5));
  };
  
  const handleDecrease = () => {
    setCubeSize(prev => Math.max(prev - 0.2, 0.5));
  };
  
  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Interactive 3D Technology</h2>
          <p className="text-[#8A9CCC] md:text-lg">
            Axium leverages cutting-edge 3D visualization for intuitive creator market analysis
          </p>
        </div>
        
        <Card className="overflow-hidden bg-gradient-to-br from-[#0A0E17] to-[#141B2D] border border-[#1A2747]">
          <div className="p-1">
            <CubeScene 
              key={resetKey}
              height="300px"
              cubeSize={cubeSize}
              className="rounded-t-lg"
            />
          </div>
          
          <div className="p-4 flex flex-wrap items-center justify-between gap-4 border-t border-[#1A2747]">
            <div className="flex items-center space-x-2">
              <Box className="h-5 w-5 text-[#3AA0FF]" />
              <span className="text-sm text-white/80">Interactive Cube Demo</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                className="h-8 border-[#1A2747] bg-black/20"
                onClick={handleDecrease}
              >
                <ZoomIn className="h-3.5 w-3.5 mr-1" />
                <span>Smaller</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="h-8 border-[#1A2747] bg-black/20"
                onClick={handleIncrease}
              >
                <ZoomIn className="h-3.5 w-3.5 mr-1" />
                <span>Larger</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="h-8 border-[#1A2747] bg-black/20"
                onClick={handleReset}
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                <span>Reset</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default AnimatedCubeExample;
