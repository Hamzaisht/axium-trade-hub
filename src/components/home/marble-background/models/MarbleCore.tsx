
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTextureLoader } from '@/hooks/useTextureLoader';

interface MarbleCoreProps {
  pulseEffect: boolean;
  mousePosition: { x: number; y: number };
  hover: boolean;
}

// The central marble sphere component
export const MarbleCore = ({ pulseEffect, mousePosition, hover }: MarbleCoreProps) => {
  const marbleRef = useRef<THREE.Mesh>(null);
  
  // Load textures using our custom hook
  const { texture: textureMap, normalMap } = useTextureLoader({
    main: '/textures/black-marble.jpg',
    normal: '/textures/marble-normal.jpg',
    fallback: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1000&auto=format&fit=crop'
  }, {
    main: { wrapS: THREE.RepeatWrapping, wrapT: THREE.RepeatWrapping },
    normal: { wrapS: THREE.RepeatWrapping, wrapT: THREE.RepeatWrapping }
  });

  // Animation loop
  useFrame((state, delta) => {
    if (marbleRef.current) {
      // Smooth movement following mouse
      marbleRef.current.rotation.y += 0.003;
      marbleRef.current.rotation.x += 0.001;
      
      // Subtle movement based on mouse position
      marbleRef.current.position.x = THREE.MathUtils.lerp(
        marbleRef.current.position.x,
        mousePosition.x * 0.5,
        0.05
      );
      marbleRef.current.position.y = THREE.MathUtils.lerp(
        marbleRef.current.position.y,
        mousePosition.y * 0.3,
        0.05
      );
      
      // Add pulse effect on scroll/button press
      if (pulseEffect) {
        marbleRef.current.scale.x = THREE.MathUtils.lerp(
          marbleRef.current.scale.x,
          1.1,
          0.1
        );
        marbleRef.current.scale.y = THREE.MathUtils.lerp(
          marbleRef.current.scale.y,
          1.1,
          0.1
        );
        marbleRef.current.scale.z = THREE.MathUtils.lerp(
          marbleRef.current.scale.z,
          1.1,
          0.1
        );
      } else {
        marbleRef.current.scale.x = THREE.MathUtils.lerp(
          marbleRef.current.scale.x,
          1.0,
          0.05
        );
        marbleRef.current.scale.y = THREE.MathUtils.lerp(
          marbleRef.current.scale.y,
          1.0,
          0.05
        );
        marbleRef.current.scale.z = THREE.MathUtils.lerp(
          marbleRef.current.scale.z,
          1.0,
          0.05
        );
      }
    }
  });

  return (
    <mesh ref={marbleRef}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshStandardMaterial 
        map={textureMap}
        normalMap={normalMap}
        color="#111111"
        metalness={0.8}
        roughness={0.2}
        envMapIntensity={1}
      />
    </mesh>
  );
};

export default MarbleCore;
