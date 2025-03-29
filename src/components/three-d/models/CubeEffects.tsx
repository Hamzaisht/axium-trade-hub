
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CubeEffectsProps {
  position: [number, number, number];
  clicked: boolean;
}

const CubeEffects = ({ position, clicked }: CubeEffectsProps) => {
  const particlesRef = useRef<THREE.Group>(null);
  
  // Animation loop for particles
  useFrame((state, delta) => {
    if (particlesRef.current && clicked) {
      particlesRef.current.rotation.y += 0.02;
      
      // Make children pulse
      particlesRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          child.position.x = Math.sin(state.clock.elapsedTime * 2 + i) * 0.5;
          child.position.y = Math.cos(state.clock.elapsedTime * 2 + i) * 0.5;
          child.position.z = Math.sin(state.clock.elapsedTime * 1 + i) * 0.5;
        }
      });
    }
  });
  
  // Don't render effects if not clicked
  if (!clicked) return null;
  
  return (
    <group ref={particlesRef} position={position}>
      {/* Small particles that appear when cube is clicked */}
      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[0, 0, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial 
            color="#ff9000" 
            emissive="#ff9000"
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
};

export default CubeEffects;
