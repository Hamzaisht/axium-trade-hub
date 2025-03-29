
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTextureLoader } from '@/hooks/useTextureLoader';

interface MarbleCoreProps {
  pulseEffect: boolean;
  mousePosition: { x: number, y: number };
  hover: boolean;
}

export const MarbleCore = ({ pulseEffect, mousePosition, hover }: MarbleCoreProps) => {
  const marbleRef = useRef<THREE.Mesh>(null);
  
  // Load marble texture
  const { texture: marbleTexture, normalMap } = useTextureLoader({
    main: '/textures/black-marble.jpg',
    normal: '/textures/marble-normal.jpg',
    fallback: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1000&auto=format&fit=crop'
  });
  
  // Animation loop
  useFrame((state, delta) => {
    if (marbleRef.current) {
      // Base rotation
      marbleRef.current.rotation.y += delta * 0.2;
      
      // Respond to mouse movement
      if (hover) {
        // Subtle tilt towards mouse
        const targetX = mousePosition.y * 0.3;
        const targetY = mousePosition.x * 0.3;
        
        marbleRef.current.rotation.x = THREE.MathUtils.lerp(
          marbleRef.current.rotation.x,
          targetX,
          delta * 2
        );
        
        marbleRef.current.rotation.z = THREE.MathUtils.lerp(
          marbleRef.current.rotation.z,
          -targetY * 0.5,
          delta * 2
        );
      }
      
      // Pulse effect
      if (pulseEffect) {
        marbleRef.current.scale.x = THREE.MathUtils.lerp(
          marbleRef.current.scale.x,
          1.1,
          delta * 10
        );
        marbleRef.current.scale.y = THREE.MathUtils.lerp(
          marbleRef.current.scale.y,
          1.1,
          delta * 10
        );
        marbleRef.current.scale.z = THREE.MathUtils.lerp(
          marbleRef.current.scale.z,
          1.1,
          delta * 10
        );
      } else {
        marbleRef.current.scale.x = THREE.MathUtils.lerp(
          marbleRef.current.scale.x,
          1.0,
          delta * 5
        );
        marbleRef.current.scale.y = THREE.MathUtils.lerp(
          marbleRef.current.scale.y,
          1.0,
          delta * 5
        );
        marbleRef.current.scale.z = THREE.MathUtils.lerp(
          marbleRef.current.scale.z,
          1.0,
          delta * 5
        );
      }
    }
  });
  
  return (
    <mesh ref={marbleRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        map={marbleTexture}
        normalMap={normalMap}
        normalScale={new THREE.Vector2(0.5, 0.5)}
        metalness={0.8}
        roughness={0.2}
        envMapIntensity={1}
        color={hover ? "#444444" : "#222222"}
        emissive={pulseEffect ? "#3676FF" : "#000000"}
        emissiveIntensity={pulseEffect ? 0.2 : 0}
      />
    </mesh>
  );
};

export default MarbleCore;
