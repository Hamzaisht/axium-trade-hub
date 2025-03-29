
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTextureLoader } from '@/hooks/useTextureLoader';

interface LavaRingProps {
  pulseEffect: boolean;
}

export const LavaRing = ({ pulseEffect }: LavaRingProps) => {
  const lavaRingRef = useRef<THREE.Mesh>(null);
  
  // Load textures using our custom hook
  const { texture: lavaMap } = useTextureLoader({
    accent: 'https://images.unsplash.com/photo-1516476892398-bdcab4c8dab8?q=80&w=500&auto=format&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1000&auto=format&fit=crop'
  }, {
    accent: { wrapS: THREE.RepeatWrapping, wrapT: THREE.RepeatWrapping }
  });

  // Animation loop
  useFrame((state, delta) => {
    if (lavaRingRef.current) {
      lavaRingRef.current.rotation.z -= 0.003;
      
      if (lavaRingRef.current.material instanceof THREE.MeshStandardMaterial && lavaMap) {
        lavaMap.offset.x += 0.001;
        lavaMap.offset.y += 0.0005;
        
        // Increase emissive intensity during pulse
        lavaRingRef.current.material.emissiveIntensity = pulseEffect ? 0.8 : 0.4;
      }
    }
  });

  return (
    <mesh ref={lavaRingRef} position={[0, 0, -0.3]} rotation={[0.3, 0.2, 0]} scale={1.8}>
      <torusGeometry args={[1.0, 0.08, 32, 100]} />
      <meshStandardMaterial 
        map={lavaMap}
        color="#D4AF37" 
        metalness={0.7}
        roughness={0.3}
        emissive="#D4AF37"
        emissiveIntensity={0.4}
      />
    </mesh>
  );
};

export default LavaRing;
