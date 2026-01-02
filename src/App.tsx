import { useEffect, useState } from 'react';
import Scene from './components/Visualization/Scene';
import Sidebar from './components/Layout/Sidebar';
import Legend from './components/UI/Legend';
import ViewToggle from './components/UI/ViewToggle';
import AnalysisPage from './components/Analysis/AnalysisPage';
import { useStore } from './store/useStore';

function App() {
  const { setData, currentView } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL;
    Promise.all([
      fetch(`${baseUrl}data/papers.json`).then(res => res.json()),
      fetch(`${baseUrl}data/topics.json`).then(res => res.json()),
      fetch(`${baseUrl}data/global.json`).then(res => res.json()).catch(() => null) // Handle missing file gracefully
    ]).then(([papersData, topicsData, globalData]) => {
      setData(papersData, topicsData, globalData);
      setLoading(false);
    });
  }, [setData]);

  return (
    <div className="w-full h-screen relative bg-black overflow-hidden">
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black text-white">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p>Loading Semantic Space...</p>
          </div>
        </div>
      )}
      
      <ViewToggle />
      {currentView === 'explorer' && <Sidebar />}
      
      <div className="w-full h-full">
        {currentView === 'explorer' ? (
          <>
            <Legend />
            <Scene />
          </>
        ) : (
          <AnalysisPage />
        )}
      </div>
    </div>
  );
}

export default App;
