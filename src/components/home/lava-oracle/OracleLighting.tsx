
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function OracleLighting() {
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const goldLightRef = useRef<THREE.PointLight>(null);
  
  useFrame((state) => {
    if (spotLightRef.current) {
      // Make spotlight gently pulse
      const intensity = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      spotLightRef.current.intensity = intensity;
    }
    
    if (pointLightRef.current) {
      // Subtle movement for point light to simulate ambient lava glow
      pointLightRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.3) * 3;
      pointLightRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.2) * 2;
    }

    if (goldLightRef.current) {
      // Make the gold light pulse with a different frequency
      const goldIntensity = 0.8 + Math.sin(state.clock.elapsedTime * 0.7) * 0.3;
      goldLightRef.current.intensity = goldIntensity;
    }
  });
  
  return (
    <>
      {/* Base ambient light */}
      <ambientLight intensity={0.2} color="#ffffff" />
      
      {/* Golden ambient light */}
      <ambientLight intensity={0.15} color="#FFD700" />
      
      {/* Main directional light */}
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={0.6} 
        color="#ffffff" 
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      {/* Golden accent light */}
      <pointLight 
        ref={goldLightRef}
        position={[-3, 2, 3]} 
        intensity={0.8} 
        color="#FFD700" 
        distance={12}
        decay={2}
      />
      
      {/* Blue accent light for contrast */}
      <pointLight 
        ref={pointLightRef}
        position={[3, -3, -5]} 
        intensity={0.3} 
        color="#38BDF8" 
        distance={10}
        decay={2}
      />

      {/* Mint accent light for additional color */}
      <pointLight 
        position={[0, -4, 2]} 
        intensity={0.2} 
        color="#00FFD0" 
        distance={8}
        decay={2}
      />
      
      {/* Dynamic spotlight from above */}
      <spotLight 
        ref={spotLightRef}
        position={[0, 5, 2]} 
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
