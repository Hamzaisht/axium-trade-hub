
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
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) {
        console.warn('WebGL not supported, using fallback background');
        setCanvasLoaded(false);
      } else {
        // WebGL is supported, check for key capabilities
        const extensions = gl.getSupportedExtensions();
        console.log("WebGL supported with extensions:", extensions);
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.2),transparent_70%)]"></div>
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
          preserveDrawingBuffer: true,
          failIfMajorPerformanceCaveat: false, // Don't fail on low-end devices
          premultipliedAlpha: false, // Better for transparent elements
        }}
        dpr={[1, 1.5]} // Lower max DPR for better performance
        style={{ 
          background: 'transparent',
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -5
        }}
        shadows={false} // Disable shadows for performance
        onCreated={({ gl }) => {
          // Set clear color with alpha=0 for transparency
          gl.setClearColor(0x0A0E17, 0);
          console.log("Three.js Canvas created successfully");
        }}
      >
        {/* Enhanced lighting for better visibility */}
        <ambientLight intensity={3.0} />
        <directionalLight position={[5, 5, 5]} intensity={5.0} color="#ffffff" />
        <pointLight position={[-3, 3, 3]} intensity={5.0} color="#D4AF37" />
        <spotLight 
          position={[0, 5, 5]} 
          angle={0.8} 
          penumbra={0.5} 
          intensity={8} 
          color="#D4AF37" 
          castShadow={false}
        />
        <hemisphereLight intensity={2.0} color="#D4AF37" groundColor="#0A0E17" />
        
        {/* Camera setup with wider field of view */}
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={70} />
        
        {/* Main 3D component */}
        <PremiumHead scrollY={scrollY} onButtonPress={onButtonPress} />
        
        {/* Interactive controls - limit rotation to make it subtle */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          rotateSpeed={0.1} 
          minPolarAngle={Math.PI / 2 - 0.2}
          maxPolarAngle={Math.PI / 2 + 0.2}
          enableRotate={false}
        />
      </Canvas>
      
      {/* Very subtle gradient overlay, more transparent than before */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0E17]/40 pointer-events-none"></div>
    </div>
  );
};

export default PremiumScene;
