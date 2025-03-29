
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HeadEffectsProps {
  pulseEffect: boolean;
}

const HeadEffects = ({ pulseEffect }: HeadEffectsProps) => {
  const effectsRef = useRef<THREE.Group>(null);
  
  // Animation for ambient effects with enhanced visibility
  useFrame((state, delta) => {
    if (effectsRef.current) {
      effectsRef.current.rotation.y += delta * 0.1;
      
      // Make the rings pulse in size for more visual interest
      effectsRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          // Make particles float around with more movement
          if (i < 30) { // First 30 children are particles
            child.position.y = Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.3;
          }
          
          // Apply scale pulse to ring elements (last two children)
          if (i >= 30) {
            const scaleFactor = Math.sin(state.clock.elapsedTime * 0.5) * 0.05 + 1;
            child.scale.set(scaleFactor, scaleFactor, 1);
          }
        }
      });
    }
  });

  return (
    <group ref={effectsRef}>
      {/* Ambient particles with basic materials for performance */}
      {[...Array(30)].map((_, i) => (
        <mesh key={i} position={[
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 5
        ]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshBasicMaterial 
            color="#FFD700" 
            transparent={true}
            opacity={0.9}
          />
        </mesh>
      ))}
      
      {/* Larger outer ring for visibility */}
      <mesh position={[0, 0, 0]}>
        <ringGeometry args={[2.2, 2.4, 32]} />
        <meshBasicMaterial 
          color="#D4AF37" 
          transparent={true}
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Inner ring */}
      <mesh position={[0, 0, 0]}>
        <ringGeometry args={[1.8, 1.9, 32]} />
        <meshBasicMaterial 
          color="#FFD700" 
          transparent={true}
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

export default HeadEffects;
