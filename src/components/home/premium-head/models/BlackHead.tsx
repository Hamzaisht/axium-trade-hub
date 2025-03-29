
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BlackHeadProps {
  pulseEffect: boolean;
  mousePosition: { x: number; y: number };
  hover: boolean;
}

export const BlackHead = ({ pulseEffect, mousePosition, hover }: BlackHeadProps) => {
  const headRef = useRef<THREE.Group>(null);
  
  // Animation loop
  useFrame((state, delta) => {
    if (headRef.current) {
      // Subtle head rotation based on mouse movement
      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        (mousePosition.x * 0.3),
        0.05
      );
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x,
        (mousePosition.y * 0.1),
        0.05
      );
      
      // If user scrolls or clicks a button, add a pulse effect
      if (pulseEffect) {
        headRef.current.scale.x = THREE.MathUtils.lerp(
          headRef.current.scale.x,
          1.05,
          0.1
        );
        headRef.current.scale.y = THREE.MathUtils.lerp(
          headRef.current.scale.y,
          1.05,
          0.1
        );
        headRef.current.scale.z = THREE.MathUtils.lerp(
          headRef.current.scale.z,
          1.05,
          0.1
        );
      } else {
        headRef.current.scale.x = THREE.MathUtils.lerp(
          headRef.current.scale.x,
          1.0,
          0.05
        );
        headRef.current.scale.y = THREE.MathUtils.lerp(
          headRef.current.scale.y,
          1.0,
          0.05
        );
        headRef.current.scale.z = THREE.MathUtils.lerp(
          headRef.current.scale.z,
          1.0,
          0.05
        );
      }
    }
  });

  return (
    <group ref={headRef}>
      {/* Head shape */}
      <mesh>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial 
          color="#111111"
          metalness={0.9}
          roughness={0.1}
          emissive="#111111"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Neck shape */}
      <mesh position={[0, -1.8, 0]}>
        <cylinderGeometry args={[0.6, 0.8, 1.2, 32]} />
        <meshStandardMaterial 
          color="#111111"
          metalness={0.9}
          roughness={0.1}
          emissive="#111111"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
};

export default BlackHead;
