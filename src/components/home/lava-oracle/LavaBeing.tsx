
import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { GoldenHalo } from './GoldenHalo';
import { LavaCracks } from './LavaCracks';

interface LavaBeingProps {
  position: [number, number, number];
  rotation: [number, number, number];
  mousePosition: { x: number, y: number };
  marketSpike?: boolean;
}

export function LavaBeing({ 
  position = [0, 0, 0], 
  rotation = [0, 0, 0], 
  mousePosition = { x: 0, y: 0 },
  marketSpike = false
}: LavaBeingProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  
  // Create humanoid head geometry
  const headGeometry = useMemo(() => {
    // Create a head shape using a sphere with modifications
    const baseHead = new THREE.SphereGeometry(1, 64, 64);
    const geometry = baseHead.clone();
    
    // Modify vertices to create a more head-like shape
    const positions = baseHead.attributes.position.array as Float32Array;
    const newPositions = new Float32Array(positions.length);
    
    for (let i = 0; i < positions.length; i += 3) {
      let x = positions[i];
      let y = positions[i + 1];
      let z = positions[i + 2];
      
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
      
      newPositions[i] = x;
      newPositions[i + 1] = y;
      newPositions[i + 2] = z;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3));
    geometry.computeVertexNormals();
    
    return geometry;
  }, []);
  
  // Optional: Try to load a model if available
  let model = null;
  try {
    model = useGLTF('/models/marble-head.glb');
  } catch (error) {
    console.log('Using fallback geometry instead of GLB model');
  }
  
  // Create neck and shoulders geometry
  const torsoGeometry = useMemo(() => {
    const geometry = new THREE.CylinderGeometry(0.5, 0.8, 1.2, 32);
    // Move the cylinder down to connect with the head
    geometry.translate(0, -1.2, 0);
    return geometry;
  }, []);
  
  // Animation loop
  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Base animation speed
    const speed = marketSpike ? 2 : 1;
    
    // Breathing/floating animation
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 * speed) * 0.05;
    
    // Respond to mouse movement (subtle head turning)
    if (headRef.current) {
      const targetRotationY = rotation[1] + mousePosition.x * 0.3;
      const targetRotationX = rotation[0] + mousePosition.y * 0.1;
      
      // Smooth rotation (lerp)
      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        targetRotationY,
        0.05
      );
      
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x,
        targetRotationX,
        0.05
      );
    }
    
    // Add camera zoom effect for market spike
    if (marketSpike && state.camera.position.z > 3) {
      state.camera.position.z = THREE.MathUtils.lerp(
        state.camera.position.z,
        3,
        0.01
      );
    }
  });
  
  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Head */}
      <mesh 
        ref={headRef}
        geometry={model?.nodes?.Head?.geometry || headGeometry}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#111111"
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={1}
        />
      </mesh>
      
      {/* Shoulders/Torso */}
      <mesh
        geometry={torsoGeometry}
        position={[0, -0.6, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#111111"
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={1}
        />
      </mesh>
      
      {/* Golden Lava Cracks */}
      <LavaCracks 
        parentGeometry={headGeometry}
        torsoGeometry={torsoGeometry}
        intensity={marketSpike ? 0.9 : 0.7}
        pulseSpeed={marketSpike ? 1.0 : 0.6}
        pulseMagnitude={marketSpike ? 0.4 : 0.3}
      />
      
      {/* Glowing Golden Halo */}
      <GoldenHalo 
        position={[0, 1.2, 0]} 
        scale={1.2}
        intensity={marketSpike ? 1.5 : 1.0}
        rotationSpeed={marketSpike ? 1.5 : 0.5}
      />
    </group>
  );
}

// Preload GLB model to prevent memory leaks
useGLTF.preload('/models/marble-head.glb');
