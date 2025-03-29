
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTextureLoader } from '@/hooks/useTextureLoader';

interface SentientMarbleProps {
  scrollY?: number;
  onButtonPress?: number;
}

// This component represents the 3D marble with neon halo and gold/lava accents
export const SentientMarble = ({ scrollY, onButtonPress }: SentientMarbleProps) => {
  const marbleRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const lavaRingRef = useRef<THREE.Mesh>(null);
  const goldRingRef = useRef<THREE.Group>(null);
  
  // Load textures using our custom hook
  const { texture: textureMap, normalMap, lavaMap } = useTextureLoader({
    main: '/textures/black-marble.jpg',
    normal: '/textures/marble-normal.jpg',
    accent: 'https://images.unsplash.com/photo-1516476892398-bdcab4c8dab8?q=80&w=500&auto=format&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1000&auto=format&fit=crop'
  }, {
    main: { wrapS: THREE.RepeatWrapping, wrapT: THREE.RepeatWrapping },
    accent: { wrapS: THREE.RepeatWrapping, wrapT: THREE.RepeatWrapping }
  });

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
        lavaMap.offset.x += 0.001;
        lavaMap.offset.y += 0.0005;
        
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

  // The actual rendering is the same, just use the textures from our hook
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
          map={textureMap}
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

export default SentientMarble;
