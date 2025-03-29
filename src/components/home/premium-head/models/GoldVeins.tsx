
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GoldVeinsProps {
  pulseEffect: boolean;
}

const GoldVeins = ({ pulseEffect }: GoldVeinsProps) => {
  const veinsRef = useRef<THREE.Group>(null);
  
  // Animation for the veins
  useFrame((state, delta) => {
    if (veinsRef.current) {
      // Rotate slowly for ambient effect
      veinsRef.current.rotation.y += delta * 0.05;
      
      // Pulse effect when interacting
      if (pulseEffect) {
        veinsRef.current.scale.x = THREE.MathUtils.lerp(
          veinsRef.current.scale.x,
          1.1,
          0.1
        );
        veinsRef.current.scale.y = THREE.MathUtils.lerp(
          veinsRef.current.scale.y,
          1.1,
          0.1
        );
        veinsRef.current.scale.z = THREE.MathUtils.lerp(
          veinsRef.current.scale.z,
          1.1,
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
      {/* Create gold vein patterns using small lines and curves */}
      {[...Array(20)].map((_, i) => (
        <mesh key={i} position={[
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 0.5 + 1.4
        ]} rotation={[
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ]}>
          <boxGeometry args={[0.05, 0.05, Math.random() * 1 + 0.1]} />
          <meshStandardMaterial 
            color="#D4AF37" 
            emissive="#D4AF37"
            emissiveIntensity={0.8}
            metalness={1}
            roughness={0.2}
          />
        </mesh>
      ))}
      
      {/* Add more complex patterns */}
      {[...Array(10)].map((_, i) => (
        <mesh key={`curve-${i}`} position={[
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 0.5 + 1.4
        ]} rotation={[
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ]}>
          <torusGeometry args={[0.2, 0.02, 8, 12, Math.PI * (Math.random() * 0.5 + 0.5)]} />
          <meshStandardMaterial 
            color="#D4AF37" 
            emissive="#D4AF37"
            emissiveIntensity={0.8}
            metalness={1}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
};

export default GoldVeins;
