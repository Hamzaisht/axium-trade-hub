
import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { PremiumHead } from './PremiumHead';

interface PremiumSceneProps {
  scrollY?: number;
  onButtonPress?: number;
}

export const PremiumScene = ({ scrollY, onButtonPress }: PremiumSceneProps) => {
  const [canvasLoaded, setCanvasLoaded] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
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
      <div className="w-full h-full bg-gradient-to-b from-[#0A0E17] via-[#0D1424] to-[#0A0E17]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.1),transparent_70%)]"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Canvas
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: true // Helps with some rendering issues
        }}
        dpr={[1, 2]} // Responsive to device pixel ratio
        style={{ background: '#0A0E17', display: 'block' }}
        shadows
      >
        {/* Enhanced lighting for better visibility */}
        <ambientLight intensity={2.0} />
        <directionalLight position={[5, 5, 5]} intensity={3.0} color="#ffffff" />
        <pointLight position={[-3, 3, 3]} intensity={3.0} color="#D4AF37" />
        <spotLight 
          position={[0, 5, 5]} 
          angle={0.4} 
          penumbra={0.8} 
          intensity={5} 
          color="#D4AF37" 
          castShadow 
        />
        <hemisphereLight intensity={1.0} color="#D4AF37" groundColor="#0A0E17" />
        
        {/* Camera setup with wider field of view */}
        <PerspectiveCamera makeDefault position={[0, 0, 5.5]} fov={60} />
        
        {/* Main 3D component */}
        <PremiumHead scrollY={scrollY} onButtonPress={onButtonPress} />
        
        {/* Interactive controls - limit rotation to make it subtle */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          rotateSpeed={0.2} 
          minPolarAngle={Math.PI / 2 - 0.3}
          maxPolarAngle={Math.PI / 2 + 0.3}
          enableRotate={false}
        />
      </Canvas>
      
      {/* Gradient overlay - make it more subtle to see the 3D model better */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E17]/5 via-transparent to-[#0A0E17]/70 pointer-events-none"></div>
    </div>
  );
};

export default PremiumScene;
