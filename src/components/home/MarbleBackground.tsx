
import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// This component represents the 3D marble with neon halo and gold/lava accents
const SentientMarble = ({ scrollY, onButtonPress }) => {
  const marbleRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const lavaRingRef = useRef<THREE.Mesh>(null);
  const goldRingRef = useRef<THREE.Group>(null);

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
  const [lavaMap, setLavaMap] = useState<THREE.Texture | null>(null);
  const [texturesLoaded, setTexturesLoaded] = useState(false);
  
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    
    // Load marble texture with fallback
    textureLoader.load(
      '/textures/black-marble.jpg',
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
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
    
    // Load lava texture for accents
    textureLoader.load(
      'https://images.unsplash.com/photo-1516476892398-bdcab4c8dab8?q=80&w=500&auto=format&fit=crop',
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        setLavaMap(texture);
        console.info('Lava texture loaded successfully');
      },
      undefined,
      (error) => {
        console.warn('Could not load lava texture, creating default texture:', error);
        const defaultLava = new THREE.CanvasTexture(
          new OffscreenCanvas(2, 2)
        );
        const ctx = defaultLava.image.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#D4AF37';
          ctx.fillRect(0, 0, 2, 2);
        }
        setLavaMap(defaultLava);
      }
    );
    
    setTexturesLoaded(true);
    
    return () => {
      // Clean up textures to prevent memory leaks
      if (textureMap) textureMap.dispose();
      if (normalMap) normalMap.dispose();
      if (lavaMap) lavaMap.dispose();
      fallbackTexture.dispose();
    };
  }, []);

  // State for interactive movement
  const [hover, setHover] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [pulseEffect, setPulseEffect] = useState(false);
  const lastScrollY = useRef(0);

  // Handle scroll events for interactive effects
  useEffect(() => {
    if (scrollY !== undefined && Math.abs(scrollY - lastScrollY.current) > 30) {
      setPulseEffect(true);
      lastScrollY.current = scrollY;
      
      const timer = setTimeout(() => {
        setPulseEffect(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [scrollY]);

  // Handle button press effect
  useEffect(() => {
    if (onButtonPress) {
      setPulseEffect(true);
      const timer = setTimeout(() => {
        setPulseEffect(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [onButtonPress]);

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
      
      // Add pulse effect on scroll/button press
      if (pulseEffect) {
        marbleRef.current.scale.x = THREE.MathUtils.lerp(
          marbleRef.current.scale.x,
          1.1,
          0.1
        );
        marbleRef.current.scale.y = THREE.MathUtils.lerp(
          marbleRef.current.scale.y,
          1.1,
          0.1
        );
        marbleRef.current.scale.z = THREE.MathUtils.lerp(
          marbleRef.current.scale.z,
          1.1,
          0.1
        );
      } else {
        marbleRef.current.scale.x = THREE.MathUtils.lerp(
          marbleRef.current.scale.x,
          1.0,
          0.05
        );
        marbleRef.current.scale.y = THREE.MathUtils.lerp(
          marbleRef.current.scale.y,
          1.0,
          0.05
        );
        marbleRef.current.scale.z = THREE.MathUtils.lerp(
          marbleRef.current.scale.z,
          1.0,
          0.05
        );
      }
    }

    // Animate halo (hologram effect)
    if (haloRef.current) {
      haloRef.current.rotation.z += 0.005;
      haloRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      haloRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.2) * 0.1;
      
      // Pulse effect for the halo
      const basePulse = 1 + Math.sin(state.clock.elapsedTime) * 0.05;
      const extraPulse = pulseEffect ? 0.15 : 0;
      const pulseScale = basePulse + extraPulse;
      
      haloRef.current.scale.set(pulseScale, pulseScale, 1);
      
      // Increase halo opacity during pulse
      if (haloRef.current.material instanceof THREE.MeshBasicMaterial) {
        haloRef.current.material.opacity = pulseEffect ? 0.9 : 0.7;
      }
    }
    
    // Animate lava ring
    if (lavaRingRef.current) {
      lavaRingRef.current.rotation.z -= 0.003;
      
      if (lavaRingRef.current.material instanceof THREE.MeshStandardMaterial && lavaMap) {
        lavaRingRef.current.material.map.offset.x += 0.001;
        lavaRingRef.current.material.map.offset.y += 0.0005;
        
        // Increase emissive intensity during pulse
        lavaRingRef.current.material.emissiveIntensity = pulseEffect ? 0.8 : 0.4;
      }
    }
    
    // Animate gold accents
    if (goldRingRef.current) {
      goldRingRef.current.rotation.x += 0.002;
      goldRingRef.current.rotation.y += 0.001;
      
      if (pulseEffect) {
        goldRingRef.current.scale.x = THREE.MathUtils.lerp(
          goldRingRef.current.scale.x,
          1.15,
          0.1
        );
        goldRingRef.current.scale.y = THREE.MathUtils.lerp(
          goldRingRef.current.scale.y,
          1.15,
          0.1
        );
      } else {
        goldRingRef.current.scale.x = THREE.MathUtils.lerp(
          goldRingRef.current.scale.x,
          1.0,
          0.05
        );
        goldRingRef.current.scale.y = THREE.MathUtils.lerp(
          goldRingRef.current.scale.y,
          1.0,
          0.05
        );
      }
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
      
      {/* Lava/Gold ring */}
      <mesh ref={lavaRingRef} position={[0, 0, -0.3]} rotation={[0.3, 0.2, 0]} scale={1.8}>
        <torusGeometry args={[1.0, 0.08, 32, 100]} />
        <meshStandardMaterial 
          map={lavaMap}
          color="#D4AF37" 
          metalness={0.7}
          roughness={0.3}
          emissive="#D4AF37"
          emissiveIntensity={0.4}
        />
      </mesh>
      
      {/* Hologram halo effect */}
      <mesh ref={haloRef} position={[0, 1.5, 0]} rotation={[0, 0, 0]} scale={2.0}>
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
      <mesh position={[0, 1.5, 0.1]} rotation={[0.5, 0.3, 0]} scale={2.2}>
        <ringGeometry args={[0.5, 0.7, 64]} />
        <meshBasicMaterial 
          color="#D946EF" 
          side={THREE.DoubleSide}
          transparent={true}
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Gold accent details */}
      <group ref={goldRingRef}>
        <mesh position={[0, 0, 0]} rotation={[0.2, 0.5, 0]} scale={1.8}>
          <torusGeometry args={[1.2, 0.03, 16, 100]} />
          <meshStandardMaterial 
            color="#D4AF37" 
            metalness={1}
            roughness={0.3}
            emissive="#D4AF37"
            emissiveIntensity={0.2}
          />
        </mesh>
        
        <mesh position={[0, 0, 0]} rotation={[0.8, 0.2, 0]} scale={1.9}>
          <torusGeometry args={[1.25, 0.02, 16, 100]} />
          <meshStandardMaterial 
            color="#D4AF37" 
            metalness={1}
            roughness={0.3}
            emissive="#D4AF37"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>
      
      {/* Halo rays */}
      <group position={[0, 1.5, 0]} rotation={[0, 0, 0]}>
        {[...Array(8)].map((_, i) => (
          <mesh 
            key={i} 
            position={[0, 0, -0.05 * i]} 
            rotation={[0, 0, Math.PI * i / 4]}
          >
            <planeGeometry args={[0.05, 0.8]} />
            <meshBasicMaterial 
              color="#1EAEDB" 
              transparent={true} 
              opacity={0.3}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
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
          <Lights />
          <SentientMarble scrollY={scrollY} onButtonPress={buttonPress} />
          <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.2} />
        </Canvas>
      </CanvasErrorBoundary>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E17]/30 via-transparent to-[#0A0E17]/90"></div>
    </div>
  );
};

export default MarbleBackground;
