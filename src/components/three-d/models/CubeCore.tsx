
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTextureLoader } from '@/hooks/useTextureLoader';

interface CubeCoreProps {
  size: number;
  position: [number, number, number];
  rotation: [number, number, number];
  hover: boolean;
  clicked: boolean;
  interactive: boolean;
  texturePaths: {
    main?: string;
    normal?: string;
    accent?: string;
    fallback?: string;
  };
}

const CubeCore = ({ 
  size, 
  position, 
  rotation, 
  hover, 
  clicked,
  interactive,
  texturePaths 
}: CubeCoreProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
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
  
  // Animation loop
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Basic rotation
    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.01;
    
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

export default CubeCore;
