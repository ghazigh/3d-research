import { useStore } from '../../store/useStore';
import { Eye, EyeOff, Layers } from 'lucide-react';

export default function FilterPanel() {
  const { 
    topics, 
    showKeywords, 
    setShowKeywords,
    showLabels,
    setShowLabels,
    hiddenTopics, 
    toggleTopicVisibility,
    colorMode,
    setColorMode
  } = useStore();

  // Sort topics by ID numerically if possible, or just string sort
  const sortedTopics = [...topics].sort((a, b) => {
    const numA = parseInt(a.id);
    const numB = parseInt(b.id);
    return !isNaN(numA) && !isNaN(numB) ? numA - numB : a.id.localeCompare(b.id);
  });

  return (
    <div className="space-y-4 mt-6 border-t border-white/10 pt-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
          <Layers className="w-4 h-4" />
          Visualization Controls
        </h3>
      </div>

      {/* Keyword Toggle */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setShowLabels(!showLabels)}
          className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
            showLabels 
              ? 'bg-blue-500/20 text-blue-200 border border-blue-500/30' 
              : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
          }`}
        >
          <span>Labels</span>
          {showLabels ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>

        <button
          onClick={() => setShowKeywords(!showKeywords)}
          className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
            showKeywords 
              ? 'bg-blue-500/20 text-blue-200 border border-blue-500/30' 
              : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
          }`}
        >
          <span>Keywords</span>
          {showKeywords ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      </div>

      {/* Color Mode Selection */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Color By</h4>
        <select
          value={colorMode}
          onChange={(e) => setColorMode(e.target.value as any)}
          className="w-full bg-black/20 border border-white/10 rounded px-2 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-blue-500/50"
        >
          <option value="topic">Topic Cluster</option>
          <option value="citations">Citations (Log Scale)</option>
          <option value="dist_topic">Distance to Topic Centroid</option>
          <option value="dist_global">Distance to Global Centroid</option>
        </select>
      </div>

      {/* Topic Toggles */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Topics</h4>
        <div className="max-h-60 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
          {sortedTopics.map(topic => {
            const isHidden = hiddenTopics.includes(topic.id);
            return (
              <button
                key={topic.id}
                onClick={() => toggleTopicVisibility(topic.id)}
                className={`w-full flex items-center gap-3 px-2 py-1.5 rounded text-xs text-left transition-colors ${
                  isHidden 
                    ? 'opacity-50 hover:opacity-70' 
                    : 'hover:bg-white/5'
                }`}
              >
                <div className={`w-3 h-3 rounded-full border ${
                  isHidden 
                    ? 'border-gray-600 bg-transparent' 
                    : 'border-green-500 bg-green-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-gray-300">Topic {topic.id}</span>
                  <span className="block text-gray-500 truncate">
                    {topic.keywords.slice(0, 3).join(', ')}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
