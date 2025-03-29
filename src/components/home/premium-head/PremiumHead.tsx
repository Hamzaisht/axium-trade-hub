
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
  const isInitialRender = useRef(true);

  // Auto-pulse the effect more frequently to draw attention
  useEffect(() => {
    // Initial pulse to draw attention on first load
    setPulseEffect(true);
    setTimeout(() => setPulseEffect(false), 1500);
    
    const interval = setInterval(() => {
      setPulseEffect(true);
      
      const timer = setTimeout(() => {
        setPulseEffect(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }, 8000); // Less frequent pulsing for subtlety
    
    return () => clearInterval(interval);
  }, []);

  // Handle scroll events for interactive effects - more responsive
  useEffect(() => {
    if (scrollY !== undefined && Math.abs(scrollY - lastScrollY.current) > 20) {
      setPulseEffect(true);
      lastScrollY.current = scrollY;
      
      const timer = setTimeout(() => {
        setPulseEffect(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [scrollY]);

  // Handle button press effect with debouncing
  useEffect(() => {
    if (onButtonPress && !isInitialRender.current) {
      setPulseEffect(true);
      const timer = setTimeout(() => {
        setPulseEffect(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
    
    // Skip first render effect
    if (isInitialRender.current) {
      isInitialRender.current = false;
    }
  }, [onButtonPress]);

  // Update head position on mouse move with throttling
  useEffect(() => {
    let throttlePause = false;
    
    const handleMouseMove = (event: MouseEvent) => {
      if (throttlePause) return;
      throttlePause = true;
      
      setTimeout(() => {
        throttlePause = false;
        
        setMousePosition({
          x: (event.clientX / window.innerWidth) * 2 - 1,
          y: -(event.clientY / window.innerHeight) * 2 + 1
        });
      }, 50); // Throttle to 50ms for smoother performance
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Add subtle floating animation with scroll-based positioning
  useFrame((state) => {
    if (groupRef.current) {
      // Basic floating animation
      groupRef.current.position.y = -0.2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
      
      // Adjust position based on scroll - move up slightly when scrolling down
      if (scrollY !== undefined) {
        const scrollFactor = Math.min(scrollY / 1000, 1.5); // Cap the effect
        groupRef.current.position.y -= scrollFactor * 0.2;
      }
    }
  });

  return (
    <group 
      ref={groupRef}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      rotation={[0, 0, 0]}
      position={[0, -0.2, 0]} 
      scale={2.2} // Make everything much bigger for better visibility
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
