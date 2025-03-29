
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function GoldenVeins({ parentGeometry = null, intensity = 0.8, pulseSpeed = 0.5, pulseMagnitude = 0.2 }) {
  const linesRef = useRef();
  const pointsRef = useRef();
  
  // Generate veins based on parent geometry or create procedural veins
  const { veinsGeometry, pointsGeometry } = useMemo(() => {
    // Create procedural veins
    const curves = [];
    const points = [];
    
    // Number of veins to create
    const veinsCount = 12;
    
    if (parentGeometry) {
      // If we have parent geometry, use it as a reference for creating veins
      // This code would map veins to the actual head geometry
      // For now we'll just create procedural veins
    }
    
    // Create procedural veins
    for (let i = 0; i < veinsCount; i++) {
      const curve = new THREE.CurvePath();
      
      // Starting point for the vein
      const startAngle = (Math.PI * 2 * i) / veinsCount;
      const startRadius = 0.8 + Math.random() * 0.2;
      const startX = Math.cos(startAngle) * startRadius;
      const startY = Math.sin(startAngle) * startRadius + (Math.random() - 0.5) * 0.3;
      const startZ = (Math.random() - 0.5) * 0.5;
      
      let lastPoint = new THREE.Vector3(startX, startY, startZ);
      points.push(lastPoint.clone());
      
      // Create a vein with multiple connected segments
      const segmentsCount = 3 + Math.floor(Math.random() * 3);
      
      for (let j = 0; j < segmentsCount; j++) {
        // Create a point that is a bit random but generally moves toward the center
        const segmentLength = 0.3 + Math.random() * 0.3;
        const dirToCenter = new THREE.Vector3().subVectors(new THREE.Vector3(0, 0, 0), lastPoint).normalize();
        
        // Add some randomness to the direction
        const randomOffset = new THREE.Vector3(
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.2
        );
        
        dirToCenter.add(randomOffset).normalize();
        
        // Create end point for this segment
        const endPoint = lastPoint.clone().add(dirToCenter.multiplyScalar(segmentLength));
        
        // Create a curve for this segment
        const segment = new THREE.LineCurve3(lastPoint.clone(), endPoint.clone());
        curve.add(segment);
        
        // Add points at the junction
        points.push(endPoint.clone());
        
        // Update last point
        lastPoint = endPoint;
      }
      
      curves.push(curve);
    }
    
    // Create geometry from curves
    const veinsGeometry = new THREE.BufferGeometry();
    const pointsGeometry = new THREE.BufferGeometry();
    
    // Create line segments for each curve
    const vertices = [];
    curves.forEach(curve => {
      const points = curve.getPoints(20);
      for (let i = 0; i < points.length - 1; i++) {
        vertices.push(points[i].x, points[i].y, points[i].z);
        vertices.push(points[i + 1].x, points[i + 1].y, points[i + 1].z);
      }
    });
    
    veinsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    
    // Create points geometry
    const pointVertices = points.map(p => [p.x, p.y, p.z]).flat();
    pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(pointVertices, 3));
    
    return { veinsGeometry, pointsGeometry };
  }, [parentGeometry]);
  
  // Animation for flowing lava effect
  useFrame((state) => {
    if (linesRef.current) {
      // Pulse the material's opacity/emissive for a flowing effect
      const pulse = Math.sin(state.clock.elapsedTime * pulseSpeed) * pulseMagnitude + 0.7;
      linesRef.current.material.opacity = intensity * pulse;
      linesRef.current.material.emissiveIntensity = intensity * pulse;
    }
    
    if (pointsRef.current) {
      // Similar pulse but slightly out of phase for interest
      const pointsPulse = Math.sin(state.clock.elapsedTime * pulseSpeed + 0.5) * pulseMagnitude + 0.7;
      pointsRef.current.material.opacity = intensity * pointsPulse * 1.2; // Brighter points
      pointsRef.current.material.emissiveIntensity = intensity * pointsPulse * 1.2;
    }
  });
  
  return (
    <group>
      {/* Flowing veins */}
      <lineSegments ref={linesRef} geometry={veinsGeometry}>
        <lineBasicMaterial 
          color="#D4AF37" 
          transparent 
          opacity={0.7}
          emissive="#D4AF37"
          emissiveIntensity={0.8}
          linewidth={1}
        />
      </lineSegments>
      
      {/* Glowing junction points */}
      <points ref={pointsRef} geometry={pointsGeometry}>
        <pointsMaterial 
          color="#FFC700" 
          size={0.03} 
          transparent 
          opacity={0.9}
          emissive="#FFC700" 
          emissiveIntensity={1}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
