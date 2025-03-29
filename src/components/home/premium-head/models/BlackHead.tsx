
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
  
  // Animation loop with enhanced movement
  useFrame((state, delta) => {
    if (headRef.current) {
      // More pronounced head rotation based on mouse movement
      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        (mousePosition.x * 0.5),
        0.05
      );
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x,
        (mousePosition.y * 0.3),
        0.05
      );
      
      // Enhanced pulse effect with slower lerp for smoother transitions
      if (pulseEffect) {
        headRef.current.scale.x = THREE.MathUtils.lerp(
          headRef.current.scale.x,
          1.1,
          0.08
        );
        headRef.current.scale.y = THREE.MathUtils.lerp(
          headRef.current.scale.y,
          1.1,
          0.08
        );
        headRef.current.scale.z = THREE.MathUtils.lerp(
          headRef.current.scale.z,
          1.1,
          0.08
        );
      } else {
        headRef.current.scale.x = THREE.MathUtils.lerp(
          headRef.current.scale.x,
          hover ? 1.05 : 1.0,
          0.05
        );
        headRef.current.scale.y = THREE.MathUtils.lerp(
          headRef.current.scale.y,
          hover ? 1.05 : 1.0,
          0.05
        );
        headRef.current.scale.z = THREE.MathUtils.lerp(
          headRef.current.scale.z,
          hover ? 1.05 : 1.0,
          0.05
        );
      }
    }
  });

  return (
    <group ref={headRef}>
      {/* Head shape - simplified material for better performance */}
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial 
          color="#111111"
        />
      </mesh>
      
      {/* Add a glow effect layer around the head */}
      <mesh>
        <sphereGeometry args={[1.55, 32, 32]} />
        <meshBasicMaterial 
          color="#333333"
          transparent={true}
          opacity={0.3}
        />
      </mesh>
      
      {/* Neck shape - simplified material */}
      <mesh position={[0, -1.8, 0]}>
        <cylinderGeometry args={[0.6, 0.8, 1.2, 24]} />
        <meshBasicMaterial 
          color="#111111"
        />
      </mesh>
    </group>
  );
};

export default BlackHead;
