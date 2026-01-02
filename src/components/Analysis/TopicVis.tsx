import { useRef, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';

const tempObject = new THREE.Object3D();

// Distinct colors for clusters (same as ScatterPlot)
const CLUSTER_COLORS = [
  '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', 
  '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', 
  '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', 
  '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080'
];

function Points() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { papers } = useStore();
  
  // Filter out noise for this visualization to make it cleaner
  const validPapers = useMemo(() => {
    return papers.filter(p => p.cluster !== '-1');
  }, [papers]);

  useEffect(() => {
    if (!meshRef.current || validPapers.length === 0) return;

    validPapers.forEach((paper, i) => {
      // Position
      tempObject.position.set(paper.x, paper.y, paper.z);
      tempObject.scale.setScalar(1);
      tempObject.updateMatrix();
      
      meshRef.current!.setMatrixAt(i, tempObject.matrix);

      // Color Logic - Topic only
      let colorHex = '#888888';
      const clusterId = parseInt(paper.cluster);
      if (!isNaN(clusterId) && clusterId >= 0) {
        colorHex = CLUSTER_COLORS[clusterId % CLUSTER_COLORS.length];
      }
      
      meshRef.current!.setColorAt(i, new THREE.Color(colorHex));
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [validPapers]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, validPapers.length]}
    >
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshBasicMaterial 
        toneMapped={false}
        color="#ffffff"
      />
    </instancedMesh>
  );
}

export default function TopicVis() {
  const globalData = useStore((state) => state.globalData);

  return (
    <div className="w-full h-[400px] bg-black rounded-xl border border-white/10 overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs text-gray-300">
        Interactive 3D Preview
      </div>
      <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
        <color attach="background" args={['#050505']} />
        <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <Points />
        
        <OrbitControls 
          autoRotate 
          autoRotateSpeed={0.5} 
          enableZoom={false}
          enablePan={false}
          target={globalData ? globalData.position : [0, 0, 0]}
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
