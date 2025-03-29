
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GoldenHaloProps {
  position?: [number, number, number];
  scale?: number;
  intensity?: number;
  rotationSpeed?: number;
}

export function GoldenHalo({ 
  position = [0, 0, 0], 
  scale = 1, 
  intensity = 1,
  rotationSpeed = 0.5
}: GoldenHaloProps) {
  const haloRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  // Create halo particles
  const particlesGeometry = new THREE.BufferGeometry();
  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2;
    const radius = 1.0 + Math.random() * 0.2;
    
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.sin(angle) * radius * 0.2; // Flatten to make it more halo-like
    positions[i * 3 + 2] = Math.sin(angle) * radius * 0.2;
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  // Animation loop
  useFrame((state) => {
    if (haloRef.current) {
      // Rotate the halo
      haloRef.current.rotation.y += 0.005 * rotationSpeed;
      
      // Pulse the opacity/intensity
      const material = haloRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 0.5) * 0.2 * intensity;
    }
    
    if (glowRef.current) {
      // Gently float up and down
      glowRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
      
      // Glow intensity pulse
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.4 + Math.sin(state.clock.elapsedTime * 0.7) * 0.1 * intensity;
    }
    
    if (particlesRef.current) {
      // Rotate particles in opposite direction
      particlesRef.current.rotation.y -= 0.002 * rotationSpeed;
      
      // Pulse size
      const material = particlesRef.current.material as THREE.PointsMaterial;
      material.size = 0.05 + Math.sin(state.clock.elapsedTime) * 0.02 * intensity;
    }
  });
  
  return (
    <group position={position}>
      {/* Main halo ring */}
      <mesh 
        ref={haloRef}
        scale={scale}
      >
        <torusGeometry args={[1, 0.1, 16, 50]} />
        <meshBasicMaterial 
          color="#D4AF37" 
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Inner glow disk */}
      <mesh 
        ref={glowRef}
        scale={scale * 0.9}
        rotation={[Math.PI/2, 0, 0]}
      >
        <circleGeometry args={[0.9, 32]} />
        <meshBasicMaterial 
          color="#FFC700" 
          transparent 
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Particle details */}
      <points 
        ref={particlesRef}
        geometry={particlesGeometry}
        scale={scale}
      >
        <pointsMaterial 
          color="#FFDD66" 
          size={0.05} 
          transparent 
          opacity={0.8}
          sizeAttenuation={true}
        />
      </points>
    </group>
  );
}
