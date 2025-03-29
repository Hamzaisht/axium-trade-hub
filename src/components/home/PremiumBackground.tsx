
import { useEffect, useState, useRef } from 'react';
import { PremiumScene } from './premium-head';

// Main component that renders the Canvas with enhanced visibility
export const PremiumBackground: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [buttonPress, setButtonPress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const bgRef = useRef<HTMLDivElement>(null);
  const recoveryAttempts = useRef(0);
  const maxRecoveryAttempts = 5;
  
  // Track scroll position for interactivity
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Track button clicks for interactivity
  useEffect(() => {
    const handleButtonClick = () => {
      setButtonPress(prev => prev + 1);
    };
    
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      button.addEventListener('click', handleButtonClick);
    });
    
    return () => {
      buttons.forEach(button => {
        button.removeEventListener('click', handleButtonClick);
      });
    };
  }, []);

  // Check if canvas is visible and handle WebGL issues with improved recovery
  useEffect(() => {
    if (!isVisible && recoveryAttempts.current < maxRecoveryAttempts) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        recoveryAttempts.current += 1;
        console.log(`Attempting to recover PremiumBackground (Attempt ${recoveryAttempts.current}/${maxRecoveryAttempts})`);
      }, 500); // Faster recovery

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  // Reset recovery attempts periodically
  useEffect(() => {
    const resetTimer = setInterval(() => {
      recoveryAttempts.current = 0;
    }, 60000); // Reset recovery attempts counter every minute
    
    return () => clearInterval(resetTimer);
  }, []);

  // Handle WebGL context loss with better recovery
  useEffect(() => {
    const handleContextLost = (e: Event) => {
      e.preventDefault(); // Prevent default browser handling
      console.log("WebGL context lost - attempting immediate recovery");
      setIsVisible(false);
      
      // Force immediate recovery attempt
      setTimeout(() => {
        setIsVisible(true);
        console.log("WebGL context recovery attempt initiated");
      }, 100);
    };
    
    // Use canvas element directly for more reliable context handling
    const canvasElements = document.querySelectorAll('canvas');
    canvasElements.forEach(canvas => {
      canvas.addEventListener('webglcontextlost', handleContextLost, false);
    });
    
    return () => {
      canvasElements.forEach(canvas => {
        canvas.removeEventListener('webglcontextlost', handleContextLost);
      });
    };
  }, []);

  // The PremiumScene component is rendered with a fixed position, full-screen with higher z-index
  return (
    <div 
      ref={bgRef} 
      className="fixed inset-0 w-full h-full -z-10 opacity-100"
      style={{ 
        pointerEvents: 'none',
        willChange: 'transform', // Optimize performance
      }}
    >
      {isVisible && <PremiumScene scrollY={scrollY} onButtonPress={buttonPress} />}
    </div>
  );
};

export default PremiumBackground;
