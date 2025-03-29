
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
  const groupRef = useRef<THREE.Group>(null);

  // Auto-pulse the effect more frequently to draw attention
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseEffect(true);
      
      const timer = setTimeout(() => {
        setPulseEffect(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }, 3000); // More frequent pulsing
    
    return () => clearInterval(interval);
  }, []);

  // Handle scroll events for interactive effects - more responsive
  useEffect(() => {
    if (scrollY !== undefined && Math.abs(scrollY - lastScrollY.current) > 15) { // More sensitive
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

  // Initial pulse effect to draw attention when first loaded
  useEffect(() => {
    // Initial pulse to draw attention
    setPulseEffect(true);
    
    const timer = setTimeout(() => {
      setPulseEffect(false);
    }, 1500); // Longer initial pulse
    
    return () => clearTimeout(timer);
  }, []);

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

  // Add subtle floating animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15; // Enhanced movement
    }
  });

  return (
    <group 
      ref={groupRef}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      rotation={[0, 0, 0]}
      position={[0, -0.2, 0]} // Raised position
      scale={1.5} // Make everything bigger for better visibility
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
