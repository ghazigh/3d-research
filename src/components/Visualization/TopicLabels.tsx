import { Html } from '@react-three/drei';
import { useStore } from '../../store/useStore';

export function TopicLabels() {
  const { topics, showKeywords, showLabels, hiddenTopics } = useStore();

  if (!showLabels) return null;

  return (
    <group>
      {topics.map((topic) => {
        if (hiddenTopics.includes(topic.id)) return null;

        return (
          <Html
            key={topic.id}
            position={topic.position}
            center
            distanceFactor={10}
            zIndexRange={[100, 0]}
          >
            <div className="select-none">
              <div className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded border border-white/20 text-xs whitespace-nowrap transition-transform hover:scale-110 cursor-default pointer-events-auto">
                <div className="font-bold text-blue-300">Topic {topic.id}</div>
                {showKeywords && (
                  <div className="text-[10px] opacity-80 max-w-[150px] truncate">
                    {topic.keywords.slice(0, 3).join(', ')}
                  </div>
                )}
              </div>
            </div>
          </Html>
        );
      })}
    </group>
  );
}
