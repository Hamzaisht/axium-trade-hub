
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { GoldenVeins } from './GoldenVeins';
import { AmbientEffects } from './AmbientEffects';

// Create placeholder head model
const createHeadGeometry = () => {
  // Create a simplified head shape using a sphere and modifiers
  const geometry = new THREE.SphereGeometry(1, 64, 64);
  
  // Slightly reshape to be more head-like
  const positions = geometry.attributes.position;
  
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = positions.getZ(i);
    
    // Elongate slightly for head shape
    positions.setY(i, y * 1.2);
    
    // Flatten back of head slightly
    if (z < -0.2) {
      positions.setZ(i, z * 0.9);
    }
    
    // Extend chin area slightly
    if (y < -0.5 && Math.abs(x) < 0.5 && z > 0.2) {
      positions.setY(i, y * 1.15);
      positions.setZ(i, z * 1.05);
    }
  }
  
  geometry.computeVertexNormals();
  return geometry;
};

export function MarbleHead({ position = [0, 0, 0], rotation = [0, 0, 0], mousePosition = { x: 0, y: 0 }, scrollEffect = 0 }) {
  const groupRef = useRef();
  const meshRef = useRef();
  const { nodes, materials } = useModelOrFallback();
  
  // Animation loop
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      
      // Respond to mouse movement
      groupRef.current.rotation.y = rotation[1] + mousePosition.x * 0.2;
      groupRef.current.rotation.x = rotation[0] + mousePosition.y * 0.1;
      
      // Scroll effect
      if (scrollEffect > 0) {
        // Rotate when scrolling
        groupRef.current.rotation.y = rotation[1] + scrollEffect * 0.5;
        groupRef.current.position.x = position[0] - scrollEffect * 0.5;
      }
    }
    
    if (meshRef.current && meshRef.current.material) {
      // Pulse the material's emissive intensity
      meshRef.current.material.emissiveIntensity = 0.1 + Math.sin(state.clock.elapsedTime) * 0.05;
    }
  });
  
  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Main Head Mesh */}
      <mesh 
        ref={meshRef}
        geometry={nodes && nodes.Head ? nodes.Head.geometry : createHeadGeometry()}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#111111"
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={1}
          emissive="#111111"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Gold Veins Effect */}
      <GoldenVeins 
        parentGeometry={nodes && nodes.Head ? nodes.Head.geometry : null} 
        intensity={0.8}
        pulseSpeed={0.6}
        pulseMagnitude={0.3}
      />
      
      {/* Additional Ambient Effects */}
      <AmbientEffects 
        scale={1.1} 
        intensity={0.5}
        color="#D4AF37"
      />
    </group>
  );
}

// Either load a model or use fallback geometry
function useModelOrFallback() {
  // Try to load actual GLB model if available
  try {
    // If you have a GLB model ready, you can uncomment and use this:
    // return useGLTF('/models/marble-head.glb');
    
    // For now, return empty data for fallback geometry
    return { nodes: null, materials: null };
  } catch (error) {
    console.warn('Model loading failed, using fallback geometry', error);
    return { nodes: null, materials: null };
  }
}

// Cleanup function to prevent memory leaks - uncomment when using actual GLB
// useGLTF.preload('/models/marble-head.glb');
