
import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { PremiumHead } from './PremiumHead';

interface PremiumSceneProps {
  scrollY?: number;
  onButtonPress?: number;
}

export const PremiumScene = ({ scrollY, onButtonPress }: PremiumSceneProps) => {
  const [canvasLoaded, setCanvasLoaded] = useState(true);
  
  // Check WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        console.warn('WebGL not supported, using fallback background');
        setCanvasLoaded(false);
      }
    } catch (e) {
      console.error('Error checking WebGL support:', e);
      setCanvasLoaded(false);
    }
  }, []);
  
  // Fallback gradient background if WebGL not supported
  if (!canvasLoaded) {
    return (
      <div className="fixed inset-0 w-full h-full -z-10 bg-gradient-to-b from-[#0A0E17] via-[#0D1424] to-[#0A0E17]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.1),transparent_70%)]"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full -z-10 opacity-90">
      <Canvas
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 2]} // Responsive to device pixel ratio
        onError={(e) => {
          console.error('Canvas error:', e);
        }}
      >
        {/* Main lights */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
        <pointLight position={[-3, 3, 3]} intensity={1} color="#D4AF37" />
        <spotLight 
          position={[0, 5, 5]} 
          angle={0.3} 
          penumbra={0.8} 
          intensity={2} 
          color="#D4AF37" 
          castShadow 
        />
        
        {/* Camera setup */}
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />
        
        {/* Main 3D component */}
        <PremiumHead scrollY={scrollY} onButtonPress={onButtonPress} />
        
        {/* Interactive controls */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          rotateSpeed={0.2} 
          minPolarAngle={Math.PI / 2 - 0.5}
          maxPolarAngle={Math.PI / 2 + 0.5}
        />
      </Canvas>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E17]/30 via-transparent to-[#0A0E17]/90"></div>
    </div>
  );
};

export default PremiumScene;
