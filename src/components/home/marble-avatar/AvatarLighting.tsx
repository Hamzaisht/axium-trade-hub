
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function AvatarLighting() {
  const spotLightRef = useRef<THREE.SpotLight | null>(null);
  
  useFrame((state) => {
    if (spotLightRef.current) {
      // Make spotlight gently pulse
      const intensity = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      spotLightRef.current.intensity = intensity;
    }
  });
  
  return (
    <>
      {/* Base ambient light */}
      <ambientLight intensity={0.3} color="#ffffff" />
      
      {/* Main directional light */}
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={0.7} 
        color="#ffffff" 
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      {/* Golden accent light */}
      <pointLight 
        position={[-5, 2, 3]} 
        intensity={0.5} 
        color="#D4AF37" 
        distance={10}
        decay={2}
      />
      
      {/* Blue accent light */}
      <pointLight 
        position={[3, -3, -5]} 
        intensity={0.3} 
        color="#3AA0FF" 
        distance={10}
        decay={2}
      />
      
      {/* Dynamic spotlight */}
      <spotLight 
        ref={spotLightRef}
        position={[0, 5, 5]} 
        intensity={1} 
        angle={0.3} 
        penumbra={0.8} 
        color="#ffffff" 
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
    </>
  );
}
