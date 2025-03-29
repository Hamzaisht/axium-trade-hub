
import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// This component represents the 3D marble with neon halo
const Marble = () => {
  const marbleRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  // Create fallback textures
  const fallbackTexture = new THREE.TextureLoader().load(
    'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1000&auto=format&fit=crop',
    undefined,
    undefined,
    (error) => {
      console.error('Error loading fallback texture:', error);
    }
  );
  
  // Try loading the textures with error handling
  const [textureMap, setTextureMap] = useState<THREE.Texture | null>(null);
  const [normalMap, setNormalMap] = useState<THREE.Texture | null>(null);
  const [texturesLoaded, setTexturesLoaded] = useState(false);
  
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    
    // Load marble texture with fallback
    textureLoader.load(
      '/textures/black-marble.jpg',
      (texture) => {
        setTextureMap(texture);
        console.info('Black marble texture loaded successfully');
      },
      undefined,
      (error) => {
        console.warn('Could not load black marble texture, using fallback:', error);
        setTextureMap(fallbackTexture);
      }
    );
    
    // Load normal map with fallback
    textureLoader.load(
      '/textures/marble-normal.jpg',
      (texture) => {
        setNormalMap(texture);
        console.info('Marble normal map loaded successfully');
      },
      undefined,
      (error) => {
        console.warn('Could not load normal map, creating default normal map:', error);
        // Create a default normal map
        const defaultNormal = new THREE.CanvasTexture(
          new OffscreenCanvas(2, 2)
        );
        setNormalMap(defaultNormal);
      }
    );
    
    setTexturesLoaded(true);
    
    return () => {
      // Clean up textures to prevent memory leaks
      if (textureMap) textureMap.dispose();
      if (normalMap) normalMap.dispose();
      fallbackTexture.dispose();
    };
  }, []);

  // State for interactive movement
  const [hover, setHover] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Update marble position on mouse move
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Animation loop
  useFrame((state, delta) => {
    if (marbleRef.current) {
      // Smooth movement following mouse
      marbleRef.current.rotation.y += 0.003;
      marbleRef.current.rotation.x += 0.001;
      
      // Subtle movement based on mouse position
      marbleRef.current.position.x = THREE.MathUtils.lerp(
        marbleRef.current.position.x,
        mousePosition.x * 0.5,
        0.05
      );
      marbleRef.current.position.y = THREE.MathUtils.lerp(
        marbleRef.current.position.y,
        mousePosition.y * 0.3,
        0.05
      );
    }

    // Animate halo
    if (haloRef.current) {
      haloRef.current.rotation.z += 0.005;
      haloRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      haloRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.2) * 0.1;
      
      // Pulse effect for the halo
      const pulseScale = 1 + Math.sin(state.clock.elapsedTime) * 0.05;
      haloRef.current.scale.set(pulseScale, pulseScale, 1);
    }
  });

  return (
    <group>
      {/* Marble sphere */}
      <mesh 
        ref={marbleRef}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial 
          map={textureMap || fallbackTexture}
          normalMap={normalMap}
          color="#111111"
          metalness={0.8}
          roughness={0.2}
          envMapIntensity={1}
        />
      </mesh>
      
      {/* Neon halo effect */}
      <mesh ref={haloRef} position={[0, 0, -0.5]} scale={2.2}>
        <ringGeometry args={[0.7, 0.9, 64]} />
        <meshBasicMaterial 
          color="#1EAEDB" 
          side={THREE.DoubleSide}
          transparent={true}
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Second halo with different color */}
      <mesh position={[0, 0, -0.3]} rotation={[0.5, 0.3, 0]} scale={2.5}>
        <ringGeometry args={[0.9, 1.1, 64]} />
        <meshBasicMaterial 
          color="#D946EF" 
          side={THREE.DoubleSide}
          transparent={true}
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Gold accent details */}
      <mesh position={[0, 0, -0.1]} rotation={[0.2, 0.5, 0]} scale={1.8}>
        <torusGeometry args={[1.1, 0.03, 16, 100]} />
        <meshStandardMaterial 
          color="#D4AF37" 
          metalness={1}
          roughness={0.3}
          emissive="#D4AF37"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
};

// Component for Scene lighting
const Lights = () => {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#1EAEDB" />
      <pointLight position={[5, 5, 5]} intensity={0.3} color="#D946EF" />
    </>
  );
};

// Error boundary for Canvas
const CanvasErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    const handleError = () => {
      setHasError(true);
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  
  if (hasError) {
    return (
      <div className="fixed inset-0 w-full h-full -z-10 bg-gradient-to-b from-[#0A0E17] via-[#0D1424] to-[#0A0E17]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,174,219,0.1),transparent_70%)]"></div>
      </div>
    );
  }
  
  return <>{children}</>;
};

// Main component that renders the Canvas
export const MarbleBackground: React.FC = () => {
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
  
  // Fallback gradient background if WebGL not supported
  if (!canvasLoaded) {
    return (
      <div className="fixed inset-0 w-full h-full -z-10 bg-gradient-to-b from-[#0A0E17] via-[#0D1424] to-[#0A0E17]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,174,219,0.1),transparent_70%)]"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full -z-10 opacity-80">
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
          <Lights />
          <Marble />
          <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.2} />
        </Canvas>
      </CanvasErrorBoundary>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E17]/30 via-transparent to-[#0A0E17]/90"></div>
    </div>
  );
};

export default MarbleBackground;
