
import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useProgress, Html } from '@react-three/drei';
import { MarbleHead } from './marble-avatar/MarbleHead';
import { CanvasErrorBoundary } from '@/components/home/marble-background/CanvasErrorBoundary';
import { AvatarLighting } from './marble-avatar/AvatarLighting';

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#D4AF37] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4 text-sm text-[#D4AF37]">{progress.toFixed(0)}% loaded</p>
      </div>
    </Html>
  );
}

interface MarbleAvatarProps {
  scrollPosition?: number;
  interactive?: boolean;
}

const MarbleAvatar: React.FC<MarbleAvatarProps> = ({ 
  scrollPosition = 0,
  interactive = true 
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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
    
    const handleMouseMove = (event: MouseEvent) => {
      // Convert mouse position to normalized coordinates (-1 to 1)
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };
    
    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [interactive]);
  
  // Fallback if WebGL is not supported
  if (!canvasLoaded) {
    return (
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B0F1A] to-[#162A54]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15),transparent_70%)]"></div>
      </div>
    );
  }
  
  return (
    <CanvasErrorBoundary>
      <Canvas
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ 
          width: '100%', 
          height: '100%'
        }}
      >
        <Suspense fallback={<Loader />}>
          <AvatarLighting />
          
          <MarbleHead 
            position={[2, 0, 0]} 
            rotation={[0, -Math.PI / 4, 0]} 
            mousePosition={mousePosition}
            scrollEffect={scrollPosition}
          />
          
          <Environment preset="city" />
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            rotateSpeed={0.2}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
            minAzimuthAngle={-Math.PI / 4}
            maxAzimuthAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </CanvasErrorBoundary>
  );
};

export default MarbleAvatar;
