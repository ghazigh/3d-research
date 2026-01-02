import { useStore } from '../../store/useStore';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';

export function GlobalResearch() {
  const { globalData, topics, hiddenTopics, showKeywords, showLabels } = useStore();
  
  if (!globalData) return null;

  const start = new THREE.Vector3(...globalData.position);

  return (
    <group>
      {/* Central Research Node */}
      <mesh position={start}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff"
          emissiveIntensity={0.5}
          toneMapped={false}
        />
      </mesh>

      {/* Label */}
      {showLabels && (
        <Html 
          position={globalData.position} 
          center 
          distanceFactor={10} 
          zIndexRange={[100, 0]}
        >
          <div className="select-none">
            <div className="bg-gradient-to-br from-blue-600/90 to-indigo-600/90 backdrop-blur-md text-white px-2 py-1 rounded border border-blue-300/50 shadow-[0_0_15px_rgba(59,130,246,0.6)] text-xs whitespace-nowrap transition-transform hover:scale-110 cursor-default pointer-events-auto">
              <div className="font-bold text-white tracking-wide drop-shadow-md">Global</div>
              {showKeywords && (
                <div className="text-[10px] text-blue-100/90 max-w-[150px] truncate">
                  {globalData.keywords.slice(0, 3).join(', ')}
                </div>
              )}
            </div>
          </div>
        </Html>
      )}

      {/* Connections to Topics */}
      {topics.map((topic) => {
        if (hiddenTopics.includes(topic.id)) return null;

        const end = new THREE.Vector3(...topic.position);
        
        // Calculate direction for arrow
        const direction = new THREE.Vector3().subVectors(end, start).normalize();
        // Position arrow slightly before the topic centroid
        const arrowPos = new THREE.Vector3().copy(end).sub(direction.multiplyScalar(0.5));
        
        // Calculate rotation for the cone to point towards end
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

        return (
          <group key={topic.id}>
            {/* Line */}
            <Line
              points={[start, end]}
              color="white"
              opacity={0.15}
              transparent
              lineWidth={1}
              dashed
              dashScale={2}
              dashSize={1}
              gapSize={1}
            />
            
            {/* Arrow Head (Cone) */}
            <mesh position={arrowPos} quaternion={quaternion}>
              <coneGeometry args={[0.08, 0.2, 8]} />
              <meshBasicMaterial color="white" opacity={0.3} transparent />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
