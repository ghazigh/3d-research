import { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { 
  X, Search, BookOpen, Calendar, ChevronLeft, ChevronRight, 
  Palette, TrendingUp, Target, Globe, Filter, Layers, Eye, EyeOff,
  CheckCircle2
} from 'lucide-react';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const { 
    selectedPaper, 
    selectPaper, 
    papers, 
    topics,
    filterJournal, 
    setFilterJournal,
    searchQuery,
    setSearchQuery,
    colorMode,
    setColorMode,
    hiddenTopics,
    toggleTopicVisibility,
    showLabels,
    setShowLabels,
    showKeywords,
    setShowKeywords,
    currentView,
    setCurrentView
  } = useStore();

  const journals = useMemo(() => [...new Set(papers.map(p => p.journal))].sort(), [papers]);
  
  const sortedTopics = useMemo(() => [...topics].sort((a, b) => {
    const numA = parseInt(a.id);
    const numB = parseInt(b.id);
    return !isNaN(numA) && !isNaN(numB) ? numA - numB : a.id.localeCompare(b.id);
  }), [topics]);

  const ColorOption = ({ mode, icon: Icon, label, desc }: { mode: string, icon: any, label: string, desc: string }) => (
    <button
      onClick={() => setColorMode(mode as any)}
      className={`relative group flex flex-col items-start p-3 rounded-xl border transition-all duration-200 ${
        colorMode === mode 
          ? 'bg-blue-500/20 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
      }`}
    >
      <div className={`p-2 rounded-lg mb-2 ${colorMode === mode ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-400 group-hover:text-white'}`}>
        <Icon size={18} />
      </div>
      <span className={`text-sm font-semibold ${colorMode === mode ? 'text-white' : 'text-gray-300'}`}>{label}</span>
      <span className="text-xs text-gray-500 mt-1 text-left leading-tight">{desc}</span>
      
      {colorMode === mode && (
        <div className="absolute top-3 right-3 text-blue-400">
          <CheckCircle2 size={16} />
        </div>
      )}
    </button>
  );

  return (
    <>
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`absolute top-6 z-20 bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-full shadow-xl border border-white/10 transition-all duration-300 ${isCollapsed ? 'left-6' : 'left-[25rem]'}`}
      >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      <div className={`absolute top-0 left-0 h-full bg-zinc-950/95 backdrop-blur-xl border-r border-white/10 text-white transition-all duration-300 z-10 flex flex-col ${isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-[26rem]'}`}>
        
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
            IEEE Vis Explorer
          </h1>
          <div className="flex items-center gap-2 mt-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
            <span>{papers.length.toLocaleString()} Papers</span>
            <span>•</span>
            <span>{topics.length} Topics</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          
          {/* Only show controls in Explorer view */}
          {currentView === 'explorer' ? (
            <>
              {/* 1. Color By Section (Main Value) */}
              <section>
                <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                  <Palette size={14} />
                  <span>Visualization Mode</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <ColorOption 
                    mode="topic" 
                    icon={Layers} 
                    label="Topic Clusters" 
                    desc="Color by semantic topic groups" 
                  />
                  <ColorOption 
                mode="citations" 
                icon={TrendingUp} 
                label="Impact" 
                desc="Color by citation count" 
              />
              <ColorOption 
                mode="dist_topic" 
                icon={Target} 
                label="Typicality" 
                desc="Distance to topic center" 
              />
              <ColorOption 
                mode="dist_global" 
                icon={Globe} 
                label="Centrality" 
                desc="Distance to global center" 
              />
            </div>
          </section>

          {/* 2. Filters Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                <Filter size={14} />
                <span>Filters</span>
              </div>
              
              {/* View Toggles */}
              <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
                <button 
                  onClick={() => setShowLabels(!showLabels)}
                  className={`p-1.5 rounded ${showLabels ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                  title="Toggle Labels"
                >
                  {showLabels ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button 
                  onClick={() => setShowKeywords(!showKeywords)}
                  className={`p-1.5 rounded ${showKeywords ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                  title="Toggle Keywords"
                >
                  <span className="text-[10px] font-bold">KW</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Journal Filter */}
              <div className="relative group">
                <BookOpen className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                <select 
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-300 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer hover:bg-zinc-900"
                  value={filterJournal || ''}
                  onChange={(e) => setFilterJournal(e.target.value || null)}
                >
                  <option value="">All Journals</option>
                  {journals.map(j => (
                    <option key={j} value={j}>{j}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-3 pointer-events-none">
                  <div className="border-t-4 border-t-zinc-500 border-l-4 border-l-transparent border-r-4 border-r-transparent" />
                </div>
              </div>

              {/* Topic Filter List */}
              <div className="bg-zinc-900/30 border border-white/10 rounded-xl overflow-hidden">
                <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex justify-between items-center">
                  <span className="text-xs font-medium text-zinc-400">Topic Visibility</span>
                  <span className="text-xs text-zinc-600">{topics.length - hiddenTopics.length} Active</span>
                </div>
                <div className="max-h-48 overflow-y-auto custom-scrollbar p-2 space-y-0.5">
                  {sortedTopics.map(topic => {
                    const isHidden = hiddenTopics.includes(topic.id);
                    return (
                      <button
                        key={topic.id}
                        onClick={() => toggleTopicVisibility(topic.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-left transition-all ${
                          isHidden 
                            ? 'text-zinc-600 hover:bg-white/5' 
                            : 'bg-blue-500/5 text-zinc-200 hover:bg-blue-500/10'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full transition-colors ${
                          isHidden ? 'bg-zinc-700' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <span className="font-medium">Topic {topic.id}</span>
                            <span className="text-zinc-500">{topic.count}</span>
                          </div>
                          <span className={`block truncate mt-0.5 ${isHidden ? 'text-zinc-700' : 'text-zinc-500'}`}>
                            {topic.keywords.slice(0, 3).join(', ')}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* 3. Search Section */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-zinc-400 uppercase tracking-wider">
              <Search size={14} />
              <span>Search</span>
            </div>
            <div className="relative group">
              <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
              <input 
                type="text"
                placeholder="Search paper titles..."
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </section>

          {/* 4. Paper Details (Conditional) */}
          {selectedPaper && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between mb-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                  <BookOpen size={14} />
                  <span>Selected Paper</span>
                </div>
                <button 
                  onClick={() => selectPaper(null)} 
                  className="text-zinc-500 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-4 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-lg font-semibold leading-snug text-white">{selectedPaper.title}</h2>
                  <span className="shrink-0 px-2 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded-full border border-blue-500/30">
                    T{selectedPaper.cluster}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-3 text-xs text-zinc-400">
                  <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded">
                    <BookOpen size={12} />
                    <span className="truncate max-w-[120px]">{selectedPaper.journal}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded">
                    <Calendar size={12} />
                    <span>{new Date(selectedPaper.date).getFullYear()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded">
                    <TrendingUp size={12} />
                    <span>{selectedPaper.citations} Citations</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Abstract</h3>
                  <p className="text-sm text-zinc-300 leading-relaxed max-h-60 overflow-y-auto custom-scrollbar pr-2">
                    {selectedPaper.abstract}
                  </p>
                </div>
              </div>
            </section>
          )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-zinc-500 space-y-4">
            <TrendingUp size={48} className="opacity-20" />
            <p className="text-sm max-w-[200px]">
              Explore the quantitative analysis of the research landscape.
            </p>
          </div>
        )}
        </div>
      </div>
    </>
  );
}
