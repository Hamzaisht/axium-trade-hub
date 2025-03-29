
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SceneLights = () => {
  const spotLightRef = useRef<THREE.SpotLight>(null);
  
  // Animate the spotlight
  useFrame((state) => {
    if (spotLightRef.current) {
      const time = state.clock.getElapsedTime();
      spotLightRef.current.intensity = 1 + Math.sin(time * 0.5) * 0.2;
    }
  });
  
  return (
    <>
      {/* Base ambient light */}
      <ambientLight intensity={0.3} color="#ffffff" />
      
      {/* Main light */}
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#ffffff" />
      
      {/* Colored accent lights */}
      <pointLight position={[-3, 3, 3]} intensity={0.5} color="#3676FF" distance={10} decay={2} />
      <pointLight position={[3, -3, -5]} intensity={0.5} color="#D4AF37" distance={10} decay={2} />
      
      {/* Animated spot light */}
      <spotLight 
        ref={spotLightRef}
        position={[0, 5, 0]} 
        angle={0.3} 
        penumbra={0.8} 
        intensity={1} 
        color="#ffffff" 
      />
    </>
  );
};

export default SceneLights;
