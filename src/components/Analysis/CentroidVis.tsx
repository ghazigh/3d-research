import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Environment, Html, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';

// Distinct colors for clusters
const CLUSTER_COLORS = [
  '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', 
  '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', 
  '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', 
  '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080'
];

function Centroids() {
  const topics = useStore((state) => state.topics);
  
  // Filter out noise topic if present (usually id "-1")
  const validTopics = useMemo(() => {
    return topics.filter(t => t.id !== '-1');
  }, [topics]);

  return (
    <group>
      {validTopics.map((topic, i) => {
        const color = CLUSTER_COLORS[parseInt(topic.id) % CLUSTER_COLORS.length] || '#ffffff';
        
        return (
          <group key={topic.id} position={topic.position}>
            {/* Centroid Sphere */}
            <mesh>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
            </mesh>
            
            {/* Connecting line to origin (optional, maybe too cluttered) */}
            {/* <line>
              <bufferGeometry>
                <float32BufferAttribute attach="attributes-position" count={2} array={new Float32Array([0, 0, 0, ...topic.position])} itemSize={3} />
              </bufferGeometry>
              <lineBasicMaterial color={color} transparent opacity={0.2} />
            </line> */}

            {/* Label */}
            <Html
              center
              distanceFactor={15}
              zIndexRange={[100, 0]}
              style={{ pointerEvents: 'none' }}
            >
              <div className="flex flex-col items-center">
                <div 
                  className="px-2 py-1 rounded bg-black/60 backdrop-blur-sm border border-white/20 text-white text-xs font-bold whitespace-nowrap"
                  style={{ borderColor: color }}
                >
                  {topic.keywords[0]}
                </div>
                {topic.keywords.length > 1 && (
                  <div className="mt-1 text-[8px] text-gray-300 bg-black/40 px-1 rounded">
                    {topic.keywords.slice(1, 3).join(', ')}
                  </div>
                )}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

export default function CentroidVis() {
  const globalData = useStore((state) => state.globalData);

  return (
    <div className="w-full h-[400px] bg-black rounded-xl border border-white/10 overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs text-gray-300">
        Topic Centroids & Keywords
      </div>
      <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
        <color attach="background" args={['#050505']} />
        <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <Centroids />
        
        <OrbitControls 
          autoRotate 
          autoRotateSpeed={0.5} 
          enableZoom={true}
          enablePan={true}
          target={globalData ? globalData.position : [0, 0, 0]}
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
