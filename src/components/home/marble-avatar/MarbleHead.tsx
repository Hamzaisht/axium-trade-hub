
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTextureLoader } from '@/hooks/useTextureLoader';

interface MarbleHeadProps {
  position: [number, number, number];
  rotation: [number, number, number];
  mousePosition: { x: number, y: number };
  scrollEffect: number;
}

export const MarbleHead: React.FC<MarbleHeadProps> = ({
  position,
  rotation,
  mousePosition,
  scrollEffect
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  
  // Load marble head texture
  const { texture: marbleTexture, normalMap } = useTextureLoader({
    main: '/textures/black-marble.jpg',
    normal: '/textures/marble-normal.jpg',
    fallback: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1000&auto=format&fit=crop'
  });
  
  // Animation loop
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    
    if (groupRef.current) {
      // Subtle floating movement
      groupRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.1;
      
      // Rotate based on mouse position for interactivity
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        rotation[1] + mousePosition.x * 0.5,
        delta * 2
      );
      
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        rotation[0] + mousePosition.y * 0.2,
        delta * 2
      );
      
      // Add scroll effect for parallax
      if (scrollEffect > 0) {
        groupRef.current.position.y = THREE.MathUtils.lerp(
          groupRef.current.position.y,
          position[1] - scrollEffect * 0.001,
          delta * 2
        );
      }
    }
    
    if (headRef.current && headRef.current.material instanceof THREE.MeshStandardMaterial) {
      // Subtle material animation
      const pulseIntensity = 0.2 + Math.sin(time * 0.5) * 0.1;
      headRef.current.material.emissiveIntensity = pulseIntensity;
    }
    
    if (haloRef.current) {
      // Rotate the halo
      haloRef.current.rotation.z += delta * 0.2;
      
      // Pulse effect
      const haloScale = 1 + Math.sin(time * 0.5) * 0.05;
      haloRef.current.scale.set(haloScale, haloScale, 1);
    }
  });
  
  return (
    <group 
      ref={groupRef}
      position={position}
      rotation={rotation}
    >
      {/* The head/bust */}
      <mesh ref={headRef} scale={1.5}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={marbleTexture}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.5, 0.5)}
          color="#FFFFFF"
          metalness={0.5}
          roughness={0.3}
          emissive="#D4AF37"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Golden halo ring */}
      <mesh ref={haloRef} position={[0, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 1.7, 64]} />
        <meshStandardMaterial
          color="#D4AF37"
          emissive="#D4AF37"
          emissiveIntensity={0.8}
          metalness={1}
          roughness={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Smaller detail rings */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 4, Math.PI / 6, 0]} scale={1.8}>
        <ringGeometry args={[0.8, 0.85, 64]} />
        <meshStandardMaterial
          color="#3676FF"
          emissive="#3676FF"
          emissiveIntensity={0.5}
          metalness={1}
          roughness={0.3}
          transparent={true}
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

export default MarbleHead;
