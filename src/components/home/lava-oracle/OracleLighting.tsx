
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function OracleLighting() {
  const spotLightRef = useRef<THREE.SpotLight | null>(null);
  const pointLightRef = useRef<THREE.PointLight | null>(null);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Make spotlight pulse
    if (spotLightRef.current) {
      spotLightRef.current.intensity = 0.8 + Math.sin(time * 0.5) * 0.2;
    }
    
    // Make point light flicker occasionally
    if (pointLightRef.current) {
      if (Math.random() > 0.95) {
        pointLightRef.current.intensity = 0.5 + Math.random() * 0.5;
      } else {
        pointLightRef.current.intensity = THREE.MathUtils.lerp(
          pointLightRef.current.intensity,
          0.5,
          0.1
        );
      }
    }
  });
  
  return (
    <>
      {/* Base ambient light */}
      <ambientLight intensity={0.2} color="#CCCCFF" />
      
      {/* Main spot light */}
      <spotLight 
        ref={spotLightRef}
        position={[0, 5, 5]} 
        angle={0.5} 
        penumbra={0.8} 
        intensity={1} 
        color="#FFD700" 
        castShadow
      />
      
      {/* Rim light for dramatic effect */}
      <pointLight 
        position={[-5, 0, -5]} 
        intensity={0.5} 
        color="#3676FF" 
        distance={15}
        decay={2}
      />
      
      {/* Front fill light */}
      <pointLight 
        ref={pointLightRef}
        position={[3, 1, 5]} 
        intensity={0.5} 
        color="#FFCC88" 
        distance={8}
        decay={2}
      />
      
      {/* Dramatic uplight */}
      <pointLight 
        position={[0, -4, 0]} 
        intensity={0.3} 
        color="#D946EF" 
        distance={5}
        decay={2}
      />
    </>
  );
}

export default OracleLighting;
