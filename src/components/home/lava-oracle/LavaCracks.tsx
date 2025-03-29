
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LavaCracksProps {
  parentGeometry: THREE.BufferGeometry;
  torsoGeometry?: THREE.BufferGeometry;
  intensity?: number;
  pulseSpeed?: number;
  pulseMagnitude?: number;
}

export function LavaCracks({ 
  parentGeometry, 
  torsoGeometry = null,
  intensity = 0.8, 
  pulseSpeed = 0.6, 
  pulseMagnitude = 0.3 
}: LavaCracksProps) {
  const linesRef = useRef<THREE.LineSegments>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const torsoLinesRef = useRef<THREE.LineSegments>(null);
  
  // Generate cracks based on parent geometry
  const { veinsGeometry, pointsGeometry, torsoVeinsGeometry } = useMemo(() => {
    // Create procedural veins
    const curves: THREE.CurvePath<THREE.Vector3>[] = [];
    const points: THREE.Vector3[] = [];
    const torsoCurves: THREE.CurvePath<THREE.Vector3>[] = [];
    
    // Number of veins to create for head
    const veinsCount = 12;
    
    // Create head veins
    for (let i = 0; i < veinsCount; i++) {
      const curve = new THREE.CurvePath<THREE.Vector3>();
      
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
    
    // Create torso veins if torso geometry is provided
    if (torsoGeometry) {
      const torsoVeinsCount = 8;
      
      for (let i = 0; i < torsoVeinsCount; i++) {
        const curve = new THREE.CurvePath<THREE.Vector3>();
        
        // Starting point for the vein (top of torso)
        const startAngle = (Math.PI * 2 * i) / torsoVeinsCount;
        const startRadius = 0.5;
        const startX = Math.cos(startAngle) * startRadius;
        const startY = -0.6; // Top of torso
        const startZ = Math.sin(startAngle) * startRadius;
        
        let lastPoint = new THREE.Vector3(startX, startY, startZ);
        
        // Create a vein with multiple connected segments flowing down
        const segmentsCount = 2 + Math.floor(Math.random() * 3);
        
        for (let j = 0; j < segmentsCount; j++) {
          // Create a point that flows downward with some randomness
          const segmentLength = 0.3 + Math.random() * 0.2;
          const dirDownward = new THREE.Vector3(
            (Math.random() - 0.5) * 0.3,
            -1,
            (Math.random() - 0.5) * 0.3
          ).normalize();
          
          // Create end point for this segment
          const endPoint = lastPoint.clone().add(dirDownward.multiplyScalar(segmentLength));
          
          // Create a curve for this segment
          const segment = new THREE.LineCurve3(lastPoint.clone(), endPoint.clone());
          curve.add(segment);
          
          // Add points to the overall collection
          points.push(lastPoint.clone());
          points.push(endPoint.clone());
          
          // Update last point
          lastPoint = endPoint;
        }
        
        torsoCurves.push(curve);
      }
    }
    
    // Create geometry from curves
    const veinsGeometry = new THREE.BufferGeometry();
    const pointsGeometry = new THREE.BufferGeometry();
    const torsoVeinsGeometry = new THREE.BufferGeometry();
    
    // Create line segments for head veins
    const vertices: number[] = [];
    curves.forEach(curve => {
      const points = curve.getPoints(20);
      for (let i = 0; i < points.length - 1; i++) {
        vertices.push(points[i].x, points[i].y, points[i].z);
        vertices.push(points[i + 1].x, points[i + 1].y, points[i + 1].z);
      }
    });
    
    veinsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    
    // Create line segments for torso veins if applicable
    if (torsoGeometry) {
      const torsoVertices: number[] = [];
      torsoCurves.forEach(curve => {
        const points = curve.getPoints(15);
        for (let i = 0; i < points.length - 1; i++) {
          torsoVertices.push(points[i].x, points[i].y, points[i].z);
          torsoVertices.push(points[i + 1].x, points[i + 1].y, points[i + 1].z);
        }
      });
      
      torsoVeinsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(torsoVertices, 3));
    }
    
    // Create points geometry for junction nodes
    const pointVertices = points.map(p => [p.x, p.y, p.z]).flat();
    pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(pointVertices, 3));
    
    return { veinsGeometry, pointsGeometry, torsoVeinsGeometry };
  }, [parentGeometry, torsoGeometry]);
  
  // Animation for flowing lava effect
  useFrame((state) => {
    const pulseFactor = Math.sin(state.clock.elapsedTime * pulseSpeed) * pulseMagnitude + 0.7;
    
    if (linesRef.current) {
      const material = linesRef.current.material as THREE.LineBasicMaterial;
      material.opacity = intensity * pulseFactor;
    }
    
    if (pointsRef.current) {
      // Slightly out of phase for visual interest
      const pointsPulse = Math.sin(state.clock.elapsedTime * pulseSpeed + 0.5) * pulseMagnitude + 0.7;
      const material = pointsRef.current.material as THREE.PointsMaterial;
      material.opacity = intensity * pointsPulse * 1.2; // Brighter points
    }
    
    if (torsoLinesRef.current) {
      // Different phase for torso veins
      const torsoPulse = Math.sin(state.clock.elapsedTime * pulseSpeed + 1.0) * pulseMagnitude + 0.7;
      const material = torsoLinesRef.current.material as THREE.LineBasicMaterial;
      material.opacity = intensity * torsoPulse;
    }
  });
  
  return (
    <group>
      {/* Head Veins */}
      <lineSegments ref={linesRef} geometry={veinsGeometry}>
        <lineBasicMaterial 
          color="#D4AF37" 
          transparent 
          opacity={0.7}
          linewidth={1}
        />
      </lineSegments>
      
      {/* Glowing Junction Points */}
      <points ref={pointsRef} geometry={pointsGeometry}>
        <pointsMaterial 
          color="#FFC700" 
          size={0.03} 
          transparent 
          opacity={0.9}
          sizeAttenuation={true}
        />
      </points>
      
      {/* Torso Veins */}
      {torsoGeometry && (
        <lineSegments ref={torsoLinesRef} geometry={torsoVeinsGeometry}>
          <lineBasicMaterial 
            color="#D4AF37" 
            transparent 
            opacity={0.7}
            linewidth={1}
          />
        </lineSegments>
      )}
    </group>
  );
}
