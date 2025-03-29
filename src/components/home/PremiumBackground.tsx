
import { useEffect, useState, useRef } from 'react';
import { PremiumScene } from './premium-head';

// Main component that renders the Canvas with enhanced visibility
export const PremiumBackground: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [buttonPress, setButtonPress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const bgRef = useRef<HTMLDivElement>(null);
  
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

  // Check if canvas is visible and handle WebGL issues
  useEffect(() => {
    // Forcibly reset the component if it fails to render
    const timer = setTimeout(() => {
      if (bgRef.current && !isVisible) {
        setIsVisible(true);
        console.log("Attempting to recover PremiumBackground");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isVisible]);

  // Handle WebGL context loss
  useEffect(() => {
    const handleContextLost = () => {
      console.log("WebGL context lost - attempting recovery");
      setIsVisible(false);
      setTimeout(() => setIsVisible(true), 1000);
    };

    window.addEventListener('webglcontextlost', handleContextLost, false);
    return () => window.removeEventListener('webglcontextlost', handleContextLost);
  }, []);

  // The PremiumScene component is rendered with a fixed position, full-screen
  return (
    <div 
      ref={bgRef} 
      className="fixed inset-0 w-full h-full -z-10 opacity-100"
      style={{ pointerEvents: 'none' }}
    >
      {isVisible && <PremiumScene scrollY={scrollY} onButtonPress={buttonPress} />}
    </div>
  );
};

export default PremiumBackground;
