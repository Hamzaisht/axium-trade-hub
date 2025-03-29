
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GoldRingsProps {
  pulseEffect: boolean;
}

export const GoldRings = ({ pulseEffect }: GoldRingsProps) => {
  const goldRingRef = useRef<THREE.Group>(null);
  
  // Animation loop
  useFrame((state, delta) => {
    if (goldRingRef.current) {
      goldRingRef.current.rotation.x += 0.002;
      goldRingRef.current.rotation.y += 0.001;
      
      if (pulseEffect) {
        goldRingRef.current.scale.x = THREE.MathUtils.lerp(
          goldRingRef.current.scale.x,
          1.15,
          0.1
        );
        goldRingRef.current.scale.y = THREE.MathUtils.lerp(
          goldRingRef.current.scale.y,
          1.15,
          0.1
        );
      } else {
        goldRingRef.current.scale.x = THREE.MathUtils.lerp(
          goldRingRef.current.scale.x,
          1.0,
          0.05
        );
        goldRingRef.current.scale.y = THREE.MathUtils.lerp(
          goldRingRef.current.scale.y,
          1.0,
          0.05
        );
      }
    }
  });

  return (
    <group ref={goldRingRef}>
      <mesh position={[0, 0, 0]} rotation={[0.2, 0.5, 0]} scale={1.8}>
        <torusGeometry args={[1.2, 0.03, 16, 100]} />
        <meshStandardMaterial 
          color="#D4AF37" 
          metalness={1}
          roughness={0.3}
          emissive="#D4AF37"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      <mesh position={[0, 0, 0]} rotation={[0.8, 0.2, 0]} scale={1.9}>
        <torusGeometry args={[1.25, 0.02, 16, 100]} />
        <meshStandardMaterial 
          color="#D4AF37" 
          metalness={1}
          roughness={0.3}
          emissive="#D4AF37"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
};

export default GoldRings;
