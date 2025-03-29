
import React from 'react';

// Component for Scene lighting
export const SceneLights: React.FC = () => {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#1EAEDB" />
      <pointLight position={[5, 5, 5]} intensity={0.3} color="#D946EF" />
      <spotLight 
        position={[0, 5, 5]} 
        intensity={0.5} 
        angle={0.5} 
        penumbra={0.8} 
        color="#D4AF37" 
        castShadow
      />
    </>
  );
};

export default SceneLights;
