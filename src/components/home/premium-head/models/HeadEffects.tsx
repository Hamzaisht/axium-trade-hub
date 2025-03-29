
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
      
      effectsRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          // Make particles float around with more movement
          child.position.y = Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.3;
          
          // Increase intensity when pulsing - higher values for better visibility
          if (pulseEffect) {
            if (child.material instanceof THREE.MeshStandardMaterial) {
              child.material.emissiveIntensity = THREE.MathUtils.lerp(
                child.material.emissiveIntensity,
                3.0,
                0.1
              );
            }
          } else {
            if (child.material instanceof THREE.MeshStandardMaterial) {
              child.material.emissiveIntensity = THREE.MathUtils.lerp(
                child.material.emissiveIntensity,
                1.8,
                0.05
              );
            }
          }
        }
      });
    }
  });

  return (
    <group ref={effectsRef}>
      {/* Ambient particles with increased size and brightness */}
      {[...Array(30)].map((_, i) => (
        <mesh key={i} position={[
          (Math.random() - 0.5) * 4.5,
          (Math.random() - 0.5) * 4.5,
          (Math.random() - 0.5) * 4.5
        ]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial 
            color="#D4AF37" 
            emissive="#D4AF37"
            emissiveIntensity={2.0}
            metalness={1}
            roughness={0.2}
            transparent={true}
            opacity={0.9}
          />
        </mesh>
      ))}
      
      {/* Multiple glowing halo effects for more visibility */}
      <mesh position={[0, 0, 0]}>
        <ringGeometry args={[2.0, 2.2, 32]} />
        <meshStandardMaterial 
          color="#D4AF37" 
          emissive="#D4AF37"
          emissiveIntensity={2.0}
          transparent={true}
          opacity={0.8}
        />
      </mesh>
      
      {/* Add a second inner ring for more dramatic effect */}
      <mesh position={[0, 0, 0]}>
        <ringGeometry args={[1.7, 1.8, 32]} />
        <meshStandardMaterial 
          color="#D4AF37" 
          emissive="#D4AF37"
          emissiveIntensity={2.5}
          transparent={true}
          opacity={0.6}
        />
      </mesh>
    </group>
  );
};

export default HeadEffects;
