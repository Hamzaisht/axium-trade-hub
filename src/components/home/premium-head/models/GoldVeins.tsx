
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GoldVeinsProps {
  pulseEffect: boolean;
}

export const GoldVeins = ({ pulseEffect }: GoldVeinsProps) => {
  const veinsRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  
  // Custom shader for the gold veins effect
  const goldVeinShader = {
    uniforms: {
      time: { value: 0 },
      pulseIntensity: { value: 0 },
      noiseScale: { value: 3.0 },
      goldColor: { value: new THREE.Color('#D4AF37') },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform float time;
      uniform float pulseIntensity;
      uniform float noiseScale;
      uniform vec3 goldColor;
      
      // Simple noise function
      float noise(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }
      
      // Fractal noise
      float fractalNoise(vec2 st) {
        float value = 0.0;
        float amplitude = 1.0;
        float frequency = 1.0;
        
        for (int i = 0; i < 5; i++) {
          value += amplitude * noise(st * frequency);
          frequency *= 2.0;
          amplitude *= 0.5;
        }
        
        return value;
      }
      
      void main() {
        // Generate crack pattern based on position and noise
        vec2 st = vUv * noiseScale;
        float n = fractalNoise(st + time * 0.05);
        
        // Create veins/cracks effect
        float crackThreshold = 0.75 + pulseIntensity * 0.03;
        float crackStrength = smoothstep(crackThreshold, crackThreshold + 0.05, n);
        
        // Only show gold in the "cracks"
        if (crackStrength > 0.0) {
          // Add some variation to the gold for richer visual effect
          vec3 finalGold = goldColor * (0.9 + 0.2 * noise(vUv * 10.0 + time));
          
          // Opacity based on crack strength and pulse effect
          float opacity = crackStrength * (0.8 + pulseIntensity * 0.4);
          
          gl_FragColor = vec4(finalGold, opacity);
        } else {
          // Transparent where there are no cracks
          discard;
        }
      }
    `,
  };
  
  // Animation loop
  useFrame((state, delta) => {
    if (materialRef.current) {
      // Update time for shader animation
      materialRef.current.uniforms.time.value += delta;
      
      // Increase pulse intensity during pulse effect
      materialRef.current.uniforms.pulseIntensity.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.pulseIntensity.value,
        pulseEffect ? 1.0 : 0.0,
        0.1
      );
    }
    
    if (veinsRef.current) {
      // Subtle rotation for the veins
      veinsRef.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <group ref={veinsRef}>
      {/* Semi-transparent sphere with gold veins shader */}
      <mesh scale={1.55}>
        <sphereGeometry args={[1.0, 64, 64]} />
        <shaderMaterial 
          ref={materialRef}
          args={[goldVeinShader]}
          transparent={true}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

export default GoldVeins;
