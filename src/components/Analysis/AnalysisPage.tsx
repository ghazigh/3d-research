import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import TopicVis from './TopicVis';
import CentroidVis from './CentroidVis';

interface AnalysisData {
  topic_counts: Record<string, number>;
  topic_journals: Record<string, Record<string, number>>;
  top_journals_global: Record<string, number>;
  abstract_length_dist: Record<string, number>;
  dist_topic_stats: Array<{ bin: string; dist_to_topic: number; citations: number; count: number }>;
  dist_global_stats: Array<{ bin: string; dist_to_global: number; citations: number; count: number }>;
  correlations: {
    dist_topic_citations: number;
    dist_global_citations: number;
    log_dist_topic_citations: number;
    log_dist_global_citations: number;
  };
}

const AnalysisPage: React.FC = () => {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/analysis.json`)
      .then(res => res.json())
      .then(setData)
      .catch(err => {
        console.error("Failed to load analysis data", err);
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-full text-white/50">Loading analysis...</div>;
  if (!data) return (
    <div className="flex flex-col items-center justify-center h-full text-white/50 p-8 text-center">
      <p className="mb-4">Analysis data not found.</p>
      <p className="text-sm text-white/30">Please run the Python generation script to create public/data/analysis.json</p>
    </div>
  );

  // Transform data for charts
  const journalData = Object.entries(data.top_journals_global)
    .map(([name, count]) => ({ name, count }))
    .slice(0, 10);

  const abstractLengthData = data.abstract_length_dist 
    ? Object.entries(data.abstract_length_dist)
        .map(([bin, count]) => ({ bin, count }))
        // Sort by the numeric start of the bin (e.g. "0-50" -> 0)
        .sort((a, b) => parseInt(a.bin.split('-')[0]) - parseInt(b.bin.split('-')[0]))
    : [];

  const topicDistData = data.dist_topic_stats.map(d => ({
    ...d,
    binLabel: parseFloat(d.bin.split(',')[0].replace('(', '')).toFixed(2)
  }));

  const globalDistData = data.dist_global_stats.map(d => ({
    ...d,
    binLabel: parseFloat(d.bin.split(',')[0].replace('(', '')).toFixed(2)
  }));

  return (
    <div className="h-full overflow-y-auto bg-[#0a0a0a] text-gray-200 p-8 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* Header */}
        <header className="space-y-6 border-b border-white/10 pb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-light tracking-tight text-white leading-tight">
            Mapping the Landscape of <br/> Visualization Research
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
            We analyzed over 37,000 papers from the IEEE Visualization conference history to understand the evolution, structure, and impact of the field. By leveraging modern large language models and manifold learning, we reveal the hidden semantic connections that define the discipline.
          </p>
        </header>

        {/* Data Overview Section */}
        <section className="space-y-12">
          <h2 className="text-3xl font-light text-white border-b border-white/10 pb-4 text-center">Data Overview</h2>
          
          <div className="space-y-6">
            <p className="text-gray-400 text-center max-w-3xl mx-auto">
              Our dataset comprises over 37,000 papers. Before diving into semantic analysis, we examine the fundamental characteristics of the corpus: where papers are published and the depth of their abstracts.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8">
              {/* Journal Distribution */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6">Top 10 Journals by Volume</h4>
                <div className="h-[600px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={journalData} layout="vertical" margin={{ left: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                      <XAxis type="number" stroke="#666" />
                      <YAxis dataKey="name" type="category" width={180} stroke="#999" tick={{fontSize: 11}} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                        cursor={{fill: 'rgba(255,255,255,0.05)'}}
                      />
                      <Bar dataKey="count" fill="#60a5fa" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Abstract Length Distribution */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6">Abstract Length Distribution</h4>
                <div className="h-[600px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={abstractLengthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                      <XAxis dataKey="bin" stroke="#666" tick={{fontSize: 11}} />
                      <YAxis stroke="#666" tick={{fontSize: 11}} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                        cursor={{fill: 'rgba(255,255,255,0.05)'}}
                      />
                      <Bar dataKey="count" fill="#34d399" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Methodology Section */}
        <section className="space-y-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-light text-white border-b border-white/10 pb-4 text-center">Methodology & Architecture</h2>
          
          <div className="grid grid-cols-1 gap-16 text-gray-400 leading-relaxed">
            
            {/* 1. Embeddings */}
            <div className="space-y-6">
              <h3 className="text-white font-medium text-xl text-center">Semantic Vectorization</h3>
              <div className="space-y-6">
                <p>
                  The foundation of our analysis is the semantic representation of research papers. We processed the titles and abstracts of the entire corpus using OpenAI's <span className="text-white">text-embedding-3-large</span> model.
                </p>
                <p>
                  Traditional bibliometric analysis often relies on keyword matching or citation networks. While valuable, these methods can miss thematic connections where different terminology is used to describe similar concepts. Our embedding approach maps each paper into a dense 3,072-dimensional vector space where geometric proximity indicates semantic similarity.
                </p>
                <div className="bg-white/5 p-6 rounded-lg border border-white/10 text-sm font-mono text-gray-300">
                  <div className="flex justify-between border-b border-white/10 pb-2 mb-2">
                    <span>Model</span>
                    <span className="text-white">text-embedding-3-large</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2 mb-2">
                    <span>Dimensions</span>
                    <span className="text-white">3,072</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Input</span>
                    <span className="text-white">Title + Abstract</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 border-t border-white/5 pt-12">
              <h3 className="text-white font-medium text-xl text-center">Dimention Reduction: Manifold Projection</h3>
              <div className="space-y-6">
                <p>
                  To make the high-dimensional embedding space explorable, we employed <span className="text-white">Uniform Manifold Approximation and Projection (UMAP)</span>. This technique learns the manifold structure of the data and projects it into 3D space for visualization.
                </p>
                <p>
                  We carefully tuned the hyperparameters (<code className="text-emerald-400">n_neighbors=15</code>, <code className="text-emerald-400">min_dist=0.1</code>) to strike a balance between preserving local neighborhood structures—ensuring similar papers stay together—and maintaining the global topology of the research field. This reveals the macro-structure of the discipline, showing clear separations between subfields like "Scientific Visualization", "Information Visualization", and "Visual Analytics".
                </p>
              </div>
              <h3 className="text-white font-medium text-xl text-center">Clustering: Topic Discovery & Labeling</h3>
              <div className="space-y-6">
                <p>
                  We used <span className="text-white">HDBSCAN</span> (Hierarchical Density-Based Spatial Clustering) to identify dense regions of papers, which we interpret as research topics. Unlike k-means, HDBSCAN does not force every point into a cluster, allowing us to identify "noise"—papers that are unique or bridge multiple fields.
                </p>
              <h3 className="text-white font-medium text-xl text-center">Semantic Space Visualization</h3>
              <p className="text-gray-400 text-center">
                The resulting 3D projection reveals distinct clusters of research. Each point represents a paper, colored by its identified topic.
              </p>
              <TopicVis />
            </div>
            <div className="space-y-6 border-t border-white/5 pt-12">
              <h3 className="text-white font-medium text-xl text-center">Key Words</h3>
                <p>
                  To automatically label these topics, we developed a custom vocabulary extraction pipeline. We embedded a curated list of visualization terms into the same vector space and calculated the centroid of each cluster. The labels for each topic are the vocabulary terms semantically closest to the cluster's centroid, providing objective, data-driven descriptions of the research themes.
                </p>
                <CentroidVis />
              </div>
            </div>
          </div>
        </section>

        {/* In-Depth Analysis Section */}
        <section className="space-y-12">
          <h2 className="text-3xl font-light text-white border-b border-white/10 pb-4 text-center">In-Depth Analysis</h2>

          {/* Topic Distribution */}
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="space-y-4 text-center">
              <h3 className="text-white font-medium text-xl">Topic Distribution</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                The field is not uniformly distributed. We observe massive clusters around core topics like "Deep Learning" and "Volume Rendering", while niche topics form smaller, tighter groups.
              </p>
            </div>
            <div className="space-y-6">
               <p className="text-gray-400">
                 Our clustering revealed {Object.keys(data.topic_counts).length} distinct research topics. The distribution follows a long-tail pattern, suggesting a few dominant paradigms accompanied by a diverse array of specialized sub-fields.
               </p>
               {/* Placeholder for Topic Count Chart if we had one, for now we focus on the text narrative */}
            </div>
          </div>

          {/* Centrality & Impact */}
          <div className="space-y-6 border-t border-white/5 pt-12">
            <div className="space-y-4 text-center max-w-4xl mx-auto">
              <h3 className="text-white font-medium text-xl">The "Safe Science" Hypothesis</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Does the community reward risk-taking? Our analysis of semantic centrality suggests a preference for the mainstream.
              </p>
            </div>
            <div className="space-y-8">
              <div className="max-w-4xl mx-auto space-y-8">
                <p className="text-gray-400">
                  We investigated the relationship between a paper's semantic position and its impact (measured by citations). We calculated two metrics for every paper:
                </p>
                <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                  <li><span className="text-white">Distance to Topic Centroid</span>: How "prototypical" the paper is for its specific sub-field.</li>
                  <li><span className="text-white">Distance to Global Centroid</span>: How close the paper is to the "average" of all visualization research.</li>
                </ul>
                <p className="text-gray-400">
                  The results are striking. There is a clear negative correlation between distance and citations. Papers that are closer to the center of their topic—and closer to the global center of the field—tend to receive significantly more citations.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Distance to Topic Center vs Citations */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Topic Centrality vs. Impact</h4>
                  <p className="text-xs text-gray-500 mb-6">Avg. citations by distance to topic centroid</p>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={topicDistData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                        <XAxis dataKey="binLabel" stroke="#666" tick={{fontSize: 10}} />
                        <YAxis stroke="#666" tick={{fontSize: 10}} />
                        <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333' }} />
                        <Line type="monotone" dataKey="citations" stroke="#c084fc" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Distance to Global Center vs Citations */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Global Centrality vs. Impact</h4>
                  <p className="text-xs text-gray-500 mb-6">Avg. citations by distance to global centroid</p>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={globalDistData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                        <XAxis dataKey="binLabel" stroke="#666" tick={{fontSize: 10}} />
                        <YAxis stroke="#666" tick={{fontSize: 10}} />
                        <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333' }} />
                        <Line type="monotone" dataKey="citations" stroke="#34d399" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="max-w-4xl mx-auto">
                <p className="text-gray-400 italic border-l-2 border-emerald-500 pl-4 py-2 bg-emerald-500/5">
                  "Papers closer to the centroid are the most attractive, suggesting the community favors research that aligns with established paradigms over high-risk outliers."
                </p>
              </div>
            </div>
          </div>

        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 pt-12 pb-24 text-center">
          <p className="text-gray-500 text-sm">
            Analysis generated from {Object.values(data.topic_counts).reduce((a,b) => a+b, 0).toLocaleString()} papers.
            <br/>
            <span className="opacity-50">IEEE Vis Explorer Project • 2024</span>
          </p>
        </footer>

      </div>
    </div>
  );
};

export default AnalysisPage;