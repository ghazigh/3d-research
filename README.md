# IEEE Vis Showcase

A 3D interactive visualization of IEEE scientific papers, exploring semantic relationships through embeddings and clustering.

![Project Preview](public/preview.png) *Note: Add a screenshot here*

## Overview

This project visualizes a dataset of IEEE papers in a 3D space. Each point represents a paper, positioned based on the semantic similarity of its abstract (reduced to 3D using UMAP). The visualization highlights research topics, keywords, and the global research centroid.

## Features

- **3D Scatter Plot**: Interactive 3D view of thousands of papers.
- **Semantic Clustering**: Papers are grouped by topic, with centroids labeled.
- **Interactive Controls**:
  - **Orbit Controls**: Rotate, zoom, and pan around the data.
  - **Filtering**: Toggle visibility of specific topics or keywords.
  - **Search**: Find papers by title or keyword.
  - **Journal Filter**: Filter papers by their publishing journal.
- **Detailed Information**: Hover over papers to see details; click to select.
- **Global Context**: Visualizes the "Global Research" center relative to specific topics.

## Methodology & Data Pipeline

The visualization is built upon a sophisticated NLP and machine learning pipeline designed to extract semantic structure from unstructured scientific text.

### 1. Data Acquisition
We leveraged the **OpenAlex API** to harvest a large corpus of scientific literature. The dataset was filtered specifically for:
- **Source**: Institute of Electrical and Electronics Engineers (IEEE).
- **Content**: Articles containing full abstracts.
- **Volume**: Approximately 40,000 papers were processed to ensure statistical significance.

### 2. Semantic Embedding
To capture the deep semantic meaning of each paper, we utilized **Azure OpenAI's `text-embedding-3-large`** model.
- **Input**: The raw text of each paper's abstract.
- **Output**: High-dimensional dense vectors (3,072 dimensions) representing the semantic essence of the research.
- **Rationale**: Unlike keyword matching, embeddings capture context, synonyms, and latent relationships between concepts.

### 3. Dimensionality Reduction (UMAP)
Visualizing 3,072-dimensional space is impossible for humans. We applied **UMAP (Uniform Manifold Approximation and Projection)** to project these high-dimensional vectors into a 3D Euclidean space (`x`, `y`, `z`).
- **Configuration**: Tuned to preserve local neighborhood structure while maintaining global topological relationships.
- **Result**: Papers with semantically similar abstracts naturally group together in the 3D visualization.

### 4. Unsupervised Clustering (HDBSCAN)
To automatically identify distinct research topics without predefined labels, we employed **HDBSCAN (Hierarchical Density-Based Spatial Clustering of Applications with Noise)**.
- **Process**: The algorithm identifies dense regions of points in the embedding space.
- **Outcome**: Papers are assigned to discrete clusters (Topics), while outliers are classified as noise.

### 5. Topic Extraction & Labeling
For each identified cluster, we derived interpretable metadata:
- **Centroids**: Calculated the geometric mean of all vectors in a cluster to determine its "center of gravity."
- **Keywords**:
  - **c-TF-IDF**: Used Class-based TF-IDF to find words that are highly frequent in a specific cluster but rare in the global corpus.
  - **LLM Refinement**: Employed GPT models to synthesize these keywords into coherent, human-readable topic labels.

### 6. Global Research Context
We computed a **Global Research Centroid** by averaging the embeddings of the entire dataset. This serves as an anchor point in the visualization, allowing users to see how specific topics diverge from the "average" research themes of the IEEE corpus.

## Tech Stack

- **Framework**: [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **3D Library**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) (Three.js)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ieee-vis-showcase.git
   cd ieee-vis-showcase
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:5173`.

## Data Structure

The visualization relies on pre-processed JSON data located in `public/data/`:
- `papers.json`: Array of paper objects with 3D coordinates (`x`, `y`, `z`), metadata, and cluster IDs.
- `topics.json`: Metadata for clusters, including centroids and top keywords.
- `global.json`: Coordinates and keywords for the global research centroid.

## Building for Production

To create a production build:

```bash
npm run build
```

The output will be in the `dist/` directory, ready to be deployed to static hosting services like GitHub Pages, Vercel, or Netlify.

## License

[MIT](LICENSE)
