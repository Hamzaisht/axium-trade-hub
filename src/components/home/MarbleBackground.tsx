
import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { SentientMarble, SceneLights, CanvasErrorBoundary } from './marble-background';

// Main component that renders the Canvas
export const MarbleBackground: React.FC = () => {
  const [canvasLoaded, setCanvasLoaded] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [buttonPress, setButtonPress] = useState(0);
  
  // Track scroll position for interactivity
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Track button clicks for interactivity
  useEffect(() => {
    const handleButtonClick = () => {
      setButtonPress(prev => prev + 1);
    };
    
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      button.addEventListener('click', handleButtonClick);
    });
    
    return () => {
      buttons.forEach(button => {
        button.removeEventListener('click', handleButtonClick);
      });
    };
  }, []);
  
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
  
  // Fallback gradient background if WebGL not supported
  if (!canvasLoaded) {
    return (
      <div className="fixed inset-0 w-full h-full -z-10 bg-gradient-to-b from-[#0A0E17] via-[#0D1424] to-[#0A0E17]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,174,219,0.1),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05),transparent_80%)]"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full -z-10 opacity-90">
      <CanvasErrorBoundary>
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
          <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />
          <SceneLights />
          <SentientMarble scrollY={scrollY} onButtonPress={buttonPress} />
          <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.2} />
        </Canvas>
      </CanvasErrorBoundary>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E17]/30 via-transparent to-[#0A0E17]/90"></div>
    </div>
  );
};

export default MarbleBackground;
