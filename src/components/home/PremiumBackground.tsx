
import { useEffect, useState } from 'react';
import { PremiumScene } from './premium-head';

// Main component that renders the Canvas
export const PremiumBackground: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [buttonPress, setButtonPress] = useState(0);
  
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

  return (
    <PremiumScene scrollY={scrollY} onButtonPress={buttonPress} />
  );
};

export default PremiumBackground;
