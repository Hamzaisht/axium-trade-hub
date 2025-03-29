
import { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GoldVeins, BlackHead, HeadEffects } from './models';

interface PremiumHeadProps {
  scrollY?: number;
  onButtonPress?: number;
}

export const PremiumHead = ({ scrollY, onButtonPress }: PremiumHeadProps) => {
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

  // Update head position on mouse move
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
      rotation={[0, 0, 0]}
      position={[0, -0.3, 0]}
    >
      {/* Black head core */}
      <BlackHead 
        pulseEffect={pulseEffect} 
        mousePosition={mousePosition} 
        hover={hover}
      />
      
      {/* Gold veins overlay */}
      <GoldVeins 
        pulseEffect={pulseEffect} 
      />
      
      {/* Visual effects for interactivity */}
      <HeadEffects 
        pulseEffect={pulseEffect} 
      />
    </group>
  );
};

export default PremiumHead;
