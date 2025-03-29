
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function AmbientEffects({ scale = 1, intensity = 0.5, color = "#D4AF37" }) {
  const particlesRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Sprite>(null);
  
  useFrame((state) => {
    if (particlesRef.current) {
      // Rotate the particles
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      
      // Make particles pulse
      const pulse = Math.sin(state.clock.elapsedTime * 0.5) * 0.1 + 0.9;
      particlesRef.current.scale.set(scale * pulse, scale * pulse, scale * pulse);
    }
    
    if (glowRef.current) {
      // Update the glow effect to always face the camera
      glowRef.current.quaternion.copy(state.camera.quaternion);
      
      // Make the glow pulse with a different phase
      const glowPulse = Math.sin(state.clock.elapsedTime * 0.3) * 0.15 + 0.85;
      
      // Access material property after type checking
      const spriteMaterial = glowRef.current.material as THREE.SpriteMaterial;
      spriteMaterial.opacity = intensity * 0.4 * glowPulse;
      
      glowRef.current.scale.set(scale * 1.2 * glowPulse, scale * 1.2 * glowPulse, 1);
    }
  });
  
  return (
    <group>
      {/* Particle field around head */}
      <group ref={particlesRef}>
        {Array.from({ length: 20 }).map((_, i) => {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;
          const r = 1.2 + Math.random() * 0.3;
          
          const x = r * Math.sin(phi) * Math.cos(theta);
          const y = r * Math.sin(phi) * Math.sin(theta);
          const z = r * Math.cos(phi);
          
          return (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry args={[0.01 + Math.random() * 0.02, 8, 8]} />
              <meshBasicMaterial 
                color={color}
                transparent
                opacity={0.3 + Math.random() * 0.4}
              />
            </mesh>
          );
        })}
      </group>
      
      {/* Ambient glow effect */}
      <sprite ref={glowRef} scale={[scale * 1.2, scale * 1.2, 1]}>
        <spriteMaterial 
          map={new THREE.TextureLoader().load('data:image/png;base64,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')}
          transparent
          opacity={0.4}
          depthWrite={false}
          depthTest={false}
        />
      </sprite>
    </group>
  );
}
