
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HeadEffectsProps {
  pulseEffect: boolean;
}

const HeadEffects = ({ pulseEffect }: HeadEffectsProps) => {
  const effectsRef = useRef<THREE.Group>(null);
  
  // Animation for ambient effects
  useFrame((state, delta) => {
    if (effectsRef.current) {
      effectsRef.current.rotation.y += delta * 0.1;
      
      effectsRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          // Make particles float around
          child.position.y = Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.2;
          
          // Increase intensity when pulsing
          if (pulseEffect) {
            if (child.material instanceof THREE.MeshStandardMaterial) {
              child.material.emissiveIntensity = THREE.MathUtils.lerp(
                child.material.emissiveIntensity,
                2.0,
                0.1
              );
            }
          } else {
            if (child.material instanceof THREE.MeshStandardMaterial) {
              child.material.emissiveIntensity = THREE.MathUtils.lerp(
                child.material.emissiveIntensity,
                1.2,
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
      {/* Ambient particles floating around the head - make them more visible */}
      {[...Array(20)].map((_, i) => (
        <mesh key={i} position={[
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4
        ]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial 
            color="#D4AF37" 
            emissive="#D4AF37"
            emissiveIntensity={1.2}
            metalness={1}
            roughness={0.2}
            transparent={true}
            opacity={0.9}
          />
        </mesh>
      ))}
      
      {/* Glowing halo effect - made larger and more intense */}
      <mesh position={[0, 0, 0]}>
        <ringGeometry args={[1.8, 2.0, 32]} />
        <meshStandardMaterial 
          color="#D4AF37" 
          emissive="#D4AF37"
          emissiveIntensity={1.2}
          transparent={true}
          opacity={0.6}
        />
      </mesh>
    </group>
  );
};

export default HeadEffects;
