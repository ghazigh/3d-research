import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import { ScatterPlot } from './ScatterPlot';
import { TopicLabels } from './TopicLabels';
import { GlobalResearch } from './GlobalResearch';
import { useStore } from '../../store/useStore';

export default function Scene() {
  const globalData = useStore((state) => state.globalData);

  return (
    <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
      <color attach="background" args={['#050505']} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      <ScatterPlot />
      <TopicLabels />
      <GlobalResearch />
      
      <OrbitControls 
        makeDefault 
        autoRotate 
        autoRotateSpeed={0.1} 
        enableDamping={true}
        dampingFactor={0.1}
        target={globalData ? globalData.position : [0, 0, 0]}
      />
      <Environment preset="city" />
    </Canvas>
  );
}
