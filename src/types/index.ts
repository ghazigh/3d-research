export interface Paper {
  id: string;
  title: string;
  journal: string;
  date: string;
  x: number;
  y: number;
  z: number;
  cluster: string;
  abstract: string;
  citations: number;
  dist_to_topic: number;
  dist_to_global: number;
}

export interface Topic {
  id: string;
  keywords: string[];
  position: [number, number, number];
  count: number;
}

export interface GlobalData {
  position: [number, number, number];
  keywords: string[];
}
