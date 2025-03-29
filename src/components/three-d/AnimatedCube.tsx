
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTextureLoader } from '@/hooks/useTextureLoader';

interface AnimatedCubeProps {
  size?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  texturePaths?: {
    main?: string;
    normal?: string;
    accent?: string;
    fallback?: string;
  };
  speed?: number;
  interactive?: boolean;
}

export const AnimatedCube = ({ 
  size = 1, 
  position = [0, 0, 0], 
  rotation = [0.5, 0.5, 0], 
  texturePaths = {
    main: '/textures/black-marble.jpg',
    normal: '/textures/marble-normal.jpg',
    accent: '/textures/gold-pattern.jpg',
    fallback: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1000&auto=format&fit=crop'
  },
  speed = 1,
  interactive = true
}: AnimatedCubeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hover, setHover] = useState(false);
  const [clicked, setClicked] = useState(false);
  
  // Load textures using our custom hook
  const { texture: textureMap, normalMap, lavaMap, texturesLoaded } = useTextureLoader(
    texturePaths,
    {
      main: { 
        wrapS: THREE.RepeatWrapping, 
        wrapT: THREE.RepeatWrapping,
        repeat: [1, 1] 
      },
      normal: { 
        wrapS: THREE.RepeatWrapping, 
        wrapT: THREE.RepeatWrapping 
      },
      accent: { 
        wrapS: THREE.RepeatWrapping, 
        wrapT: THREE.RepeatWrapping 
      }
    }
  );
  
  // Handle click animation
  useEffect(() => {
    if (!clicked) return;
    
    const timer = setTimeout(() => {
      setClicked(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [clicked]);
  
  // Animation loop
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Basic rotation
    meshRef.current.rotation.x += 0.01 * speed;
    meshRef.current.rotation.y += 0.01 * speed;
    
    // Hover effect
    if (hover && interactive) {
      meshRef.current.scale.x = THREE.MathUtils.lerp(
        meshRef.current.scale.x,
        1.2,
        0.1
      );
      meshRef.current.scale.y = THREE.MathUtils.lerp(
        meshRef.current.scale.y,
        1.2,
        0.1
      );
      meshRef.current.scale.z = THREE.MathUtils.lerp(
        meshRef.current.scale.z,
        1.2,
        0.1
      );
    } else if (clicked && interactive) {
      // Click pulse animation
      const pulseScale = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.1;
      meshRef.current.scale.set(pulseScale, pulseScale, pulseScale);
    } else {
      // Return to normal size
      meshRef.current.scale.x = THREE.MathUtils.lerp(
        meshRef.current.scale.x,
        1.0,
        0.1
      );
      meshRef.current.scale.y = THREE.MathUtils.lerp(
        meshRef.current.scale.y,
        1.0,
        0.1
      );
      meshRef.current.scale.z = THREE.MathUtils.lerp(
        meshRef.current.scale.z,
        1.0,
        0.1
      );
    }
    
    // Subtle floating motion
    if (!hover && !clicked) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.05;
    }
  });
  
  // Show loader while textures are loading
  if (!texturesLoaded) {
    return (
      <mesh position={position} rotation={rotation}>
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial color="#333333" wireframe />
      </mesh>
    );
  }
  
  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      onPointerOver={() => interactive && setHover(true)}
      onPointerOut={() => interactive && setHover(false)}
      onPointerDown={() => interactive && setClicked(true)}
    >
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial
        map={textureMap}
        normalMap={normalMap}
        aoMap={lavaMap}
        metalness={0.8}
        roughness={0.2}
        color={hover ? "#ffffff" : "#333333"}
        emissive={clicked ? "#ff9000" : "#000000"}
        emissiveIntensity={clicked ? 0.5 : 0}
      />
    </mesh>
  );
};

export default AnimatedCube;
