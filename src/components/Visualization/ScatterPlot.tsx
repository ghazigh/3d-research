import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import * as d3Scale from 'd3-scale';
import * as d3Chromatic from 'd3-scale-chromatic';

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

// Distinct colors for clusters
const CLUSTER_COLORS = [
  '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', 
  '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', 
  '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', 
  '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080'
];

export function ScatterPlot() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { papers, selectPaper, setHoveredPaper, filterJournal, searchQuery, hiddenTopics, colorMode } = useStore();
  
  // Filter logic
  const filteredIndices = useMemo(() => {
    return papers.map((p, i) => {
      if (p.cluster === '-1') return -1; // Filter out noise
      if (hiddenTopics.includes(p.cluster)) return -1; // Filter hidden topics
      if (filterJournal && p.journal !== filterJournal) return -1;
      if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) return -1;
      return i;
    });
  }, [papers, filterJournal, searchQuery, hiddenTopics]);

  // Calculate domains for scales
  const domains = useMemo(() => {
    if (papers.length === 0) return { citations: [1, 10], distTopic: [0, 1], distGlobal: [0, 1] };
    
    const citations = papers.map(p => p.citations || 0);
    const distTopic = papers.map(p => p.dist_to_topic || 0).filter(d => d !== -1);
    const distGlobal = papers.map(p => p.dist_to_global || 0);
    
    return {
      citations: [Math.max(1, Math.min(...citations)), Math.max(1, Math.max(...citations))],
      distTopic: [Math.min(...distTopic), Math.max(...distTopic)],
      distGlobal: [Math.min(...distGlobal), Math.max(...distGlobal)]
    };
  }, [papers]);

  // Create scales
  const scales = useMemo(() => {
    return {
      citations: d3Scale.scaleLog().domain(domains.citations).range([0, 1]),
      distTopic: d3Scale.scaleLinear().domain(domains.distTopic).range([0, 1]),
      distGlobal: d3Scale.scaleLinear().domain(domains.distGlobal).range([0, 1])
    };
  }, [domains]);

  useEffect(() => {
    console.log("ScatterPlot: Papers updated", papers.length);
    if (!meshRef.current || papers.length === 0) return;

    // Update instances
    papers.forEach((paper, i) => {
      const isVisible = filteredIndices[i] !== -1;
      
      // Position
      tempObject.position.set(paper.x, paper.y, paper.z);
      // Scale down if filtered out
      const scale = isVisible ? 1 : 0;
      tempObject.scale.setScalar(scale);
      tempObject.updateMatrix();
      
      meshRef.current!.setMatrixAt(i, tempObject.matrix);

      // Color Logic
      let colorHex = '#888888'; // Default grey
      
      if (colorMode === 'topic') {
        const clusterId = parseInt(paper.cluster);
        if (!isNaN(clusterId) && clusterId >= 0) {
          colorHex = CLUSTER_COLORS[clusterId % CLUSTER_COLORS.length];
        }
      } else if (colorMode === 'citations') {
        const val = Math.max(1, paper.citations || 0);
        const t = scales.citations(val);
        colorHex = d3Chromatic.interpolateViridis(t);
      } else if (colorMode === 'dist_topic') {
        const val = paper.dist_to_topic;
        if (val === -1) {
          colorHex = '#333333'; // Dark for noise/undefined
        } else {
          const t = scales.distTopic(val);
          // Closer (smaller distance) -> Hotter/Brighter (1)
          // Farther (larger distance) -> Cooler/Darker (0)
          colorHex = d3Chromatic.interpolateInferno(1 - t); 
        }
      } else if (colorMode === 'dist_global') {
        const val = paper.dist_to_global || 0;
        const t = scales.distGlobal(val);
        // Closer to center -> Hotter
        colorHex = d3Chromatic.interpolateTurbo(1 - t);
      }
        
      tempColor.set(colorHex);
      
      // Dim if filtered out
      if (!isVisible) tempColor.multiplyScalar(0);
      
      meshRef.current!.setColorAt(i, tempColor);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [papers, filteredIndices, colorMode, scales]);

  if (papers.length === 0) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, papers.length]}
      onClick={(e) => {
        e.stopPropagation();
        const instanceId = e.instanceId;
        if (instanceId !== undefined && filteredIndices[instanceId] !== -1) {
          selectPaper(papers[instanceId]);
        }
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        const instanceId = e.instanceId;
        if (instanceId !== undefined && filteredIndices[instanceId] !== -1) {
          document.body.style.cursor = 'pointer';
          setHoveredPaper(papers[instanceId]);
        }
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
        setHoveredPaper(null);
      }}
    >
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial color="#ffffff" toneMapped={false} />
    </instancedMesh>
  );
}
