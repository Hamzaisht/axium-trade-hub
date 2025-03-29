
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTextureLoader } from '@/hooks/useTextureLoader';

interface LavaBeingProps {
  position: [number, number, number];
  rotation: [number, number, number];
  mousePosition: { x: number, y: number };
  marketSpike?: boolean;
}

export const LavaBeing: React.FC<LavaBeingProps> = ({ 
  position, 
  rotation, 
  mousePosition,
  marketSpike = false
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const torusRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const [showSpike, setShowSpike] = useState(marketSpike);
  
  // Load lava texture
  const { texture: lavaTexture } = useTextureLoader({
    main: 'https://images.unsplash.com/photo-1553748024-d1b27fb3f960?q=80&w=1000&auto=format&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1000&auto=format&fit=crop'
  });
  
  // Handle market spike effect
  useEffect(() => {
    if (marketSpike) {
      setShowSpike(true);
      const timer = setTimeout(() => {
        setShowSpike(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [marketSpike]);
  
  // Generate particles for the effect
  const particlesCount = 500;
  const particlesPositions = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 10;
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;
    }
    
    return positions;
  }, [particlesCount]);
  
  // Create particles material
  const particlesMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.05,
      color: new THREE.Color('#FFD700'),
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
  }, []);
  
  // Animation loop
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Rotate entire group based on mouse position for interactivity
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mousePosition.x * 0.5,
        delta * 2
      );
      
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mousePosition.y * 0.3,
        delta * 2
      );
    }
    
    if (sphereRef.current) {
      // Pulse the main orb
      const time = state.clock.getElapsedTime();
      const scale = 1 + Math.sin(time * 0.5) * 0.05;
      
      sphereRef.current.scale.set(scale, scale, scale);
      
      // Make material pulse if showing market spike
      if (sphereRef.current.material instanceof THREE.MeshStandardMaterial) {
        if (showSpike) {
          sphereRef.current.material.emissiveIntensity = 0.5 + Math.sin(time * 5) * 0.5;
        } else {
          sphereRef.current.material.emissiveIntensity = 0.2 + Math.sin(time * 0.5) * 0.1;
        }
      }
    }
    
    if (torusRef.current) {
      // Rotate the torus
      torusRef.current.rotation.x += delta * 0.2;
      torusRef.current.rotation.y += delta * 0.1;
    }
    
    if (particlesRef.current) {
      // Make particles float and spin
      particlesRef.current.rotation.y += delta * 0.05;
      
      // Animate particles size during market spike
      if (particlesRef.current.material instanceof THREE.PointsMaterial) {
        if (showSpike) {
          particlesRef.current.material.size = THREE.MathUtils.lerp(
            particlesRef.current.material.size,
            0.1,
            delta * 2
          );
        } else {
          particlesRef.current.material.size = THREE.MathUtils.lerp(
            particlesRef.current.material.size,
            0.05,
            delta * 2
          );
        }
      }
    }
  });
  
  return (
    <group 
      ref={groupRef}
      position={position}
      rotation={rotation}
    >
      {/* Main orb */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial
          map={lavaTexture}
          color={showSpike ? "#FF6B00" : "#D4AF37"}
          emissive={showSpike ? "#FF3300" : "#D4AF37"}
          emissiveIntensity={0.2}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      
      {/* Orbiting ring */}
      <mesh ref={torusRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.5, 0.08, 16, 100]} />
        <meshStandardMaterial
          color="#3676FF"
          emissive="#3676FF"
          emissiveIntensity={0.5}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      
      {/* Particles system */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={particlesPositions}
            count={particlesCount}
            itemSize={3}
          />
        </bufferGeometry>
        <primitive object={particlesMaterial} />
      </points>
    </group>
  );
};

export default LavaBeing;

function useMemo<T>(factory: () => T, deps: React.DependencyList): T {
  const [state, setState] = useState<T>(() => factory());
  
  useEffect(() => {
    const newState = factory();
    setState(newState);
  }, deps);
  
  return state;
}
