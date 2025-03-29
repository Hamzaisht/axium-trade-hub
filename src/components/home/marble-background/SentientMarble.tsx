
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { MarbleCore, LavaRing, GoldRings, HologramHalo } from './models';

interface SentientMarbleProps {
  scrollY?: number;
  onButtonPress?: number;
}

// This component coordinates the 3D marble with all its parts
export const SentientMarble = ({ scrollY, onButtonPress }: SentientMarbleProps) => {
  // State for interactive movement
  const [hover, setHover] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [pulseEffect, setPulseEffect] = useState(false);
  const lastScrollY = useRef(0);

  // Handle scroll events for interactive effects
  useEffect(() => {
    if (scrollY !== undefined && Math.abs(scrollY - lastScrollY.current) > 30) {
      setPulseEffect(true);
      lastScrollY.current = scrollY;
      
      const timer = setTimeout(() => {
        setPulseEffect(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [scrollY]);

  // Handle button press effect
  useEffect(() => {
    if (onButtonPress) {
      setPulseEffect(true);
      const timer = setTimeout(() => {
        setPulseEffect(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [onButtonPress]);

  // Update marble position on mouse move
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <group 
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      {/* Core marble sphere */}
      <MarbleCore 
        pulseEffect={pulseEffect} 
        mousePosition={mousePosition} 
        hover={hover}
      />
      
      {/* Surrounding decorative elements */}
      <LavaRing pulseEffect={pulseEffect} />
      <GoldRings pulseEffect={pulseEffect} />
      <HologramHalo pulseEffect={pulseEffect} />
    </group>
  );
};

export default SentientMarble;
