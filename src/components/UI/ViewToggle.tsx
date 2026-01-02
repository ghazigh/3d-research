import { Globe, BarChart2 } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function ViewToggle() {
  const { currentView, setCurrentView } = useStore();

  return (
    <div className="absolute top-6 right-6 z-50 flex bg-zinc-900/90 backdrop-blur-md p-1 rounded-lg border border-white/10 shadow-2xl">
      <button
        onClick={() => setCurrentView('explorer')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
          currentView === 'explorer' 
            ? 'bg-zinc-700 text-white shadow-sm' 
            : 'text-zinc-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <Globe size={16} />
        Explorer
      </button>
      <button
        onClick={() => setCurrentView('analysis')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
          currentView === 'analysis' 
            ? 'bg-zinc-700 text-white shadow-sm' 
            : 'text-zinc-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <BarChart2 size={16} />
        Analysis
      </button>
    </div>
  );
}
