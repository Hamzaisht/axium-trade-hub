
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { AnimatedCube } from './AnimatedCube';
import { useState, useEffect } from 'react';

interface CubeSceneProps {
  width?: string;
  height?: string;
  className?: string;
  interactive?: boolean;
  cubeSize?: number;
  cubePosition?: [number, number, number];
  cubeRotation?: [number, number, number];
  backgroundColor?: string;
}

const CubeScene = ({
  width = '100%',
  height = '400px',
  className = '',
  interactive = true,
  cubeSize = 1.5,
  cubePosition = [0, 0, 0],
  cubeRotation = [0.5, 0.5, 0],
  backgroundColor = 'transparent'
}: CubeSceneProps) => {
  const [canvasLoaded, setCanvasLoaded] = useState(true);
  
  useEffect(() => {
    // Check if WebGL is supported
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
  
  // Fallback if WebGL not supported
  if (!canvasLoaded) {
    return (
      <div 
        style={{ width, height }}
        className={`flex items-center justify-center bg-gradient-to-b from-gray-900 to-black ${className}`}
      >
        <p className="text-white/60 text-center">
          3D content requires WebGL support.<br />
          Your browser may not support this feature.
        </p>
      </div>
    );
  }
  
  return (
    <div style={{ width, height }} className={className}>
      <Canvas
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance' 
        }}
        dpr={[1, 2]}
        onError={(e) => {
          console.error('Canvas error:', e);
        }}
        style={{ background: backgroundColor }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-3, 3, 3]} intensity={0.5} color="#ff9000" />
        
        <AnimatedCube 
          size={cubeSize}
          position={cubePosition}
          rotation={cubeRotation}
          interactive={interactive}
        />
        
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <OrbitControls 
          enableZoom={interactive} 
          enablePan={false} 
          rotateSpeed={0.5}
          autoRotate={!interactive}
          autoRotateSpeed={1}
        />
      </Canvas>
    </div>
  );
};

export default CubeScene;
