
import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGLTF, useTexture } from '@react-three/drei';
import { GoldenVeins } from './GoldenVeins';

// Create humanoid head model
const createHeadGeometry = () => {
  // Create a head shape using a combination of geometries
  const geometry = new THREE.BufferGeometry();
  
  // Base head shape (sphere with modifications)
  const baseHead = new THREE.SphereGeometry(1, 64, 64);
  
  // Modify vertices to create a more head-like shape
  const positions = baseHead.attributes.position as THREE.BufferAttribute;
  const vertices = [];
  
  for (let i = 0; i < positions.count; i++) {
    let x = positions.getX(i);
    let y = positions.getY(i);
    let z = positions.getZ(i);
    
    // Elongate to create head shape
    y = y * 1.2;
    
    // Flatten back of head slightly
    if (z < -0.2) {
      z = z * 0.9;
    }
    
    // Create jaw/chin area
    if (y < -0.3 && Math.abs(x) < 0.4 && z > 0.2) {
      y = y * 1.3;
      z = z * 1.2;
    }
    
    // Add slight indentation for eyes
    if (Math.abs(x) > 0.3 && Math.abs(x) < 0.5 && y > 0.1 && y < 0.3 && z > 0.7) {
      z = z * 0.9;
    }
    
    vertices.push(x, y, z);
  }
  
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();
  
  return geometry;
};

interface MarbleHeadProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  mousePosition?: { x: number, y: number };
  scrollEffect?: number;
}

export function MarbleHead({ 
  position = [0, 0, 0], 
  rotation = [0, 0, 0], 
  mousePosition = { x: 0, y: 0 }, 
  scrollEffect = 0 
}: MarbleHeadProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Custom geometry for humanoid head
  const headGeometry = useMemo(() => createHeadGeometry(), []);
  
  // Optional: Try to load a model if available
  let model = null;
  try {
    model = useGLTF('/models/marble-head.glb');
  } catch (error) {
    console.log('Using fallback geometry instead of GLB model');
  }
  
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
    
    if (meshRef.current) {
      // Pulse the material's emissive intensity
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      if (material.emissiveIntensity !== undefined) {
        material.emissiveIntensity = 0.1 + Math.sin(state.clock.elapsedTime) * 0.05;
      }
    }
  });
  
  return (
    <group ref={groupRef} position={position as any} rotation={rotation as any}>
      {/* Main Head Mesh */}
      <mesh 
        ref={meshRef}
        geometry={model?.nodes?.Head?.geometry || headGeometry}
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
        parentGeometry={model?.nodes?.Head?.geometry || headGeometry}
        intensity={0.8}
        pulseSpeed={0.6}
        pulseMagnitude={0.3}
      />
    </group>
  );
}

// Cleanup function to prevent memory leaks
useGLTF.preload('/models/marble-head.glb');
