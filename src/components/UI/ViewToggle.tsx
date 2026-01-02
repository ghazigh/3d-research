import { Globe, BarChart2 } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function ViewToggle() {
  const { currentView, setCurrentView } = useStore();

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
      <div className="flex bg-black/80 backdrop-blur-xl p-1.5 rounded-full border border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <button
          onClick={() => setCurrentView('explorer')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
            currentView === 'explorer' 
              ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)]' 
              : 'text-zinc-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Globe size={18} />
          Explorer
        </button>
        <button
          onClick={() => setCurrentView('analysis')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
            currentView === 'analysis' 
              ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(5,150,105,0.5)]' 
              : 'text-zinc-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <BarChart2 size={18} />
          Analysis
        </button>
      </div>
    </div>
  );
}
