
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function OracleLighting() {
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  
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
  });
  
  return (
    <>
      {/* Base ambient light */}
      <ambientLight intensity={0.2} color="#ffffff" />
      
      {/* Golden ambient light */}
      <ambientLight intensity={0.1} color="#D4AF37" />
      
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
        ref={pointLightRef}
        position={[-3, 2, 3]} 
        intensity={0.5} 
        color="#D4AF37" 
        distance={10}
        decay={2}
      />
      
      {/* Blue accent light for contrast */}
      <pointLight 
        position={[3, -3, -5]} 
        intensity={0.2} 
        color="#3AA0FF" 
        distance={10}
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
