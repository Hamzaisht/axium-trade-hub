
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HeadEffectsProps {
  pulseEffect: boolean;
}

export const HeadEffects = ({ pulseEffect }: HeadEffectsProps) => {
  const glowRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  // Animation loop
  useFrame((state, delta) => {
    if (glowRef.current) {
      // Rotate the glow effect slowly
      glowRef.current.rotation.y += delta * 0.1;
      
      // Pulse the glow effect
      const pulseScale = 1 + Math.sin(state.clock.elapsedTime) * 0.05 + (pulseEffect ? 0.1 : 0);
      glowRef.current.scale.set(pulseScale, pulseScale, pulseScale);
    }
    
    if (particlesRef.current) {
      // Animate particles
      const particles = particlesRef.current.geometry as THREE.BufferGeometry;
      const positions = particles.attributes.position;
      
      for (let i = 0; i < positions.count; i++) {
        const i3 = i * 3;
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = positions.getZ(i);
        
        // Apply sine wave motion to particles
        positions.setX(i, x + Math.sin(state.clock.elapsedTime * 0.5 + i * 0.1) * 0.01);
        positions.setY(i, y + Math.cos(state.clock.elapsedTime * 0.7 + i * 0.1) * 0.01);
        positions.setZ(i, z + Math.sin(state.clock.elapsedTime * 0.3 + i * 0.1) * 0.01);
      }
      
      positions.needsUpdate = true;
    }
  });

  // Generate particle positions spread around the head
  const particleCount = 100;
  const particlePositions = new Float32Array(particleCount * 3);
  const particleSizes = new Float32Array(particleCount);
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    // Generate random positions on the sphere (head)
    const radius = 2 + Math.random() * 1;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    particlePositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    particlePositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    particlePositions[i3 + 2] = radius * Math.cos(phi);
    
    // Random particle sizes
    particleSizes[i] = Math.random() * 2 + 1;
  }

  return (
    <group>
      {/* Glow effect behind the head */}
      <group ref={glowRef}>
        <mesh>
          <sphereGeometry args={[1.7, 32, 32]} />
          <meshBasicMaterial 
            color="#D4AF37" 
            transparent={true}
            opacity={0.15}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
      
      {/* Gold particles floating around the head */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particlePositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={particleCount}
            array={particleSizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.05}
          color="#D4AF37"
          transparent={true}
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          sizeAttenuation={true}
        />
      </points>
      
      {/* Light rays around the head */}
      <group rotation={[0, 0, 0]}>
        {[...Array(12)].map((_, i) => (
          <mesh 
            key={i} 
            position={[0, 0, 0]} 
            rotation={[0, Math.PI * 2 * i / 12, 0]}
          >
            <planeGeometry args={[0.05, 3]} />
            <meshBasicMaterial 
              color="#D4AF37" 
              transparent={true} 
              opacity={0.2}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};

export default HeadEffects;
