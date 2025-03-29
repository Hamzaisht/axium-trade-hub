
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HologramHaloProps {
  pulseEffect: boolean;
}

export const HologramHalo = ({ pulseEffect }: HologramHaloProps) => {
  const haloRef = useRef<THREE.Mesh>(null);
  
  // Animation loop
  useFrame((state, delta) => {
    if (haloRef.current) {
      haloRef.current.rotation.z += 0.005;
      haloRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      haloRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.2) * 0.1;
      
      // Pulse effect for the halo
      const basePulse = 1 + Math.sin(state.clock.elapsedTime) * 0.05;
      const extraPulse = pulseEffect ? 0.15 : 0;
      const pulseScale = basePulse + extraPulse;
      
      haloRef.current.scale.set(pulseScale, pulseScale, 1);
      
      // Increase halo opacity during pulse
      if (haloRef.current.material instanceof THREE.MeshBasicMaterial) {
        haloRef.current.material.opacity = pulseEffect ? 0.9 : 0.7;
      }
    }
  });

  return (
    <>
      {/* Main Hologram halo */}
      <mesh ref={haloRef} position={[0, 1.5, 0]} rotation={[0, 0, 0]} scale={2.0}>
        <ringGeometry args={[0.7, 0.9, 64]} />
        <meshBasicMaterial 
          color="#1EAEDB" 
          side={THREE.DoubleSide}
          transparent={true}
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Secondary halo with different color */}
      <mesh position={[0, 1.5, 0.1]} rotation={[0.5, 0.3, 0]} scale={2.2}>
        <ringGeometry args={[0.5, 0.7, 64]} />
        <meshBasicMaterial 
          color="#D946EF" 
          side={THREE.DoubleSide}
          transparent={true}
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Halo rays */}
      <group position={[0, 1.5, 0]} rotation={[0, 0, 0]}>
        {[...Array(8)].map((_, i) => (
          <mesh 
            key={i} 
            position={[0, 0, -0.05 * i]} 
            rotation={[0, 0, Math.PI * i / 4]}
          >
            <planeGeometry args={[0.05, 0.8]} />
            <meshBasicMaterial 
              color="#1EAEDB" 
              transparent={true} 
              opacity={0.3}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
    </>
  );
};

export default HologramHalo;
