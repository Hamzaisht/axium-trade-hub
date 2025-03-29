
import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  useProgress, 
  Html, 
  ContactShadows 
} from '@react-three/drei';
import { LavaBeing } from './lava-oracle/LavaBeing';
import { OracleLighting } from './lava-oracle/OracleLighting';

// Loading indicator for 3D model
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

interface LavaOracleProps {
  marketSpike?: boolean;
}

const LavaOracle: React.FC<LavaOracleProps> = ({ marketSpike = false }) => {
  const [canvasLoaded, setCanvasLoaded] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
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
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Fallback if WebGL is not supported
  if (!canvasLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0B0F1A] to-[#162A54] rounded-xl overflow-hidden">
        <div className="p-6 text-center">
          <div className="w-32 h-32 mx-auto bg-[#111111] rounded-full mb-4 border border-[#D4AF37]/30"></div>
          <p className="text-white text-lg">Interactive 3D requires WebGL support</p>
          <p className="text-zinc-400 text-sm mt-2">Your browser may not support this feature</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full rounded-xl overflow-hidden">
      <Canvas
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 4], fov: 45 }}
        style={{ 
          width: '100%', 
          height: '100%',
          background: 'transparent'
        }}
      >
        <Suspense fallback={<Loader />}>
          <OracleLighting />
          
          <LavaBeing 
            position={[0, -0.5, 0]} 
            rotation={[0, 0, 0]} 
            mousePosition={mousePosition}
            marketSpike={marketSpike}
          />
          
          <ContactShadows opacity={0.4} scale={5} blur={2.5} far={4} />
          <Environment preset="night" />
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            rotateSpeed={0.2}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
            enableDamping={true}
            dampingFactor={0.05}
            autoRotate={true}
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default LavaOracle;
