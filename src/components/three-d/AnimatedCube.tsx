
import { useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CubeCore, CubeEffects } from './models';

interface AnimatedCubeProps {
  size?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  texturePaths?: {
    main?: string;
    normal?: string;
    accent?: string;
    fallback?: string;
  };
  speed?: number;
  interactive?: boolean;
}

export const AnimatedCube = ({ 
  size = 1, 
  position = [0, 0, 0], 
  rotation = [0.5, 0.5, 0], 
  texturePaths = {
    main: '/textures/black-marble.jpg',
    normal: '/textures/marble-normal.jpg',
    accent: '/textures/gold-pattern.jpg',
    fallback: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1000&auto=format&fit=crop'
  },
  speed = 1,
  interactive = true
}: AnimatedCubeProps) => {
  const [hover, setHover] = useState(false);
  const [clicked, setClicked] = useState(false);
  
  // Handle click animation
  useEffect(() => {
    if (!clicked) return;
    
    const timer = setTimeout(() => {
      setClicked(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [clicked]);
  
  // Floating position animation for the whole group
  useFrame((state, delta) => {
    // No need to do anything here as individual components handle their animations
  });
  
  return (
    <group
      onPointerOver={() => interactive && setHover(true)}
      onPointerOut={() => interactive && setHover(false)}
      onPointerDown={() => interactive && setClicked(true)}
      position={[
        position[0], 
        position[1] + (interactive ? 0 : Math.sin(Date.now() * 0.001) * 0.1), 
        position[2]
      ]}
    >
      <CubeCore 
        size={size}
        position={[0, 0, 0]} 
        rotation={rotation}
        hover={hover}
        clicked={clicked}
        interactive={interactive}
        texturePaths={texturePaths}
      />
      
      <CubeEffects 
        position={[0, 0, 0]}
        clicked={clicked}
      />
    </group>
  );
};

export default AnimatedCube;
