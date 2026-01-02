import { useStore } from '../../store/useStore';
import { useMemo } from 'react';

export default function Legend() {
  const { colorMode, papers } = useStore();

  const stats = useMemo(() => {
    if (papers.length === 0) return null;
    
    if (colorMode === 'citations') {
      const values = papers.map(p => p.citations || 0);
      return { min: Math.min(...values), max: Math.max(...values), label: 'Citations' };
    }
    if (colorMode === 'dist_topic') {
      const values = papers.map(p => p.dist_to_topic || 0);
      return { min: Math.min(...values), max: Math.max(...values), label: 'Distance to Topic Center' };
    }
    if (colorMode === 'dist_global') {
      const values = papers.map(p => p.dist_to_global || 0);
      return { min: Math.min(...values), max: Math.max(...values), label: 'Distance to Global Center' };
    }
    return null;
  }, [colorMode, papers]);

  if (colorMode === 'topic' || !stats) return null;

  // Define gradients matching the visualization
  const getGradient = () => {
    if (colorMode === 'citations') {
      // Viridis: Purple -> Yellow
      return 'linear-gradient(to right, #440154, #3b528b, #21918c, #5ec962, #fde725)'; 
    }
    if (colorMode === 'dist_topic') {
      // Inferno Reversed: Yellow -> Black (Closer is brighter)
      return 'linear-gradient(to right, #fcffa4, #fca50a, #dd513a, #932667, #420a68, #000004)';
    }
    if (colorMode === 'dist_global') {
      // Turbo Reversed: Red -> Blue (Closer is "hotter"/red)
      return 'linear-gradient(to right, #900c00, #f86c00, #f1ca3a, #a4e312, #1fc847, #23a983, #397d9e, #483c8e, #30123b)';
    }
    return 'none';
  };

  return (
    <div className="absolute bottom-8 right-8 bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-lg text-white w-64 z-10 pointer-events-none select-none">
      <div className="text-sm font-medium mb-2">{stats.label}</div>
      <div className="h-4 rounded w-full mb-1" style={{ background: getGradient() }} />
      <div className="flex justify-between text-xs text-gray-400">
        <span>{stats.min.toFixed(0)}</span>
        <span>{stats.max.toFixed(0)}</span>
      </div>
    </div>
  );
}
