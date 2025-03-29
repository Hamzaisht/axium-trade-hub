
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GoldVeinsProps {
  pulseEffect: boolean;
}

const GoldVeins = ({ pulseEffect }: GoldVeinsProps) => {
  const veinsRef = useRef<THREE.Group>(null);
  
  // Animation for the veins with enhanced effects
  useFrame((state, delta) => {
    if (veinsRef.current) {
      // Rotate slowly for ambient effect
      veinsRef.current.rotation.y += delta * 0.05;
      
      // Enhanced pulse effect
      if (pulseEffect) {
        veinsRef.current.scale.x = THREE.MathUtils.lerp(
          veinsRef.current.scale.x,
          1.15,
          0.1
        );
        veinsRef.current.scale.y = THREE.MathUtils.lerp(
          veinsRef.current.scale.y,
          1.15,
          0.1
        );
        veinsRef.current.scale.z = THREE.MathUtils.lerp(
          veinsRef.current.scale.z,
          1.15,
          0.1
        );
      } else {
        veinsRef.current.scale.x = THREE.MathUtils.lerp(
          veinsRef.current.scale.x,
          1.0,
          0.05
        );
        veinsRef.current.scale.y = THREE.MathUtils.lerp(
          veinsRef.current.scale.y,
          1.0,
          0.05
        );
        veinsRef.current.scale.z = THREE.MathUtils.lerp(
          veinsRef.current.scale.z,
          1.0,
          0.05
        );
      }
    }
  });

  return (
    <group ref={veinsRef}>
      {/* Create more prominent gold vein patterns with higher intensity */}
      {[...Array(50)].map((_, i) => (
        <mesh key={i} position={[
          (Math.random() - 0.5) * 2.4,
          (Math.random() - 0.5) * 2.4,
          (Math.random() - 0.5) * 0.5 + 1.4
        ]} rotation={[
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ]}>
          <boxGeometry args={[0.1, 0.1, Math.random() * 1.2 + 0.3]} />
          <meshStandardMaterial 
            color="#D4AF37" 
            emissive="#D4AF37"
            emissiveIntensity={2.0}
            metalness={1}
            roughness={0.2}
          />
        </mesh>
      ))}
      
      {/* Add more complex patterns with increased visibility */}
      {[...Array(25)].map((_, i) => (
        <mesh key={`curve-${i}`} position={[
          (Math.random() - 0.5) * 2.4,
          (Math.random() - 0.5) * 2.4,
          (Math.random() - 0.5) * 0.5 + 1.4
        ]} rotation={[
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ]}>
          <torusGeometry args={[0.4, 0.05, 8, 16, Math.PI * (Math.random() * 0.5 + 0.5)]} />
          <meshStandardMaterial 
            color="#D4AF37" 
            emissive="#D4AF37"
            emissiveIntensity={2.0}
            metalness={1}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
};

export default GoldVeins;
