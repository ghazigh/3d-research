import { create } from 'zustand';
import { Paper, Topic, GlobalData } from '../types';

export type ColorMode = 'topic' | 'citations' | 'dist_topic' | 'dist_global';
export type ViewMode = 'explorer' | 'analysis';

interface AppState {
  papers: Paper[];
  topics: Topic[];
  globalData: GlobalData | null;
  selectedPaper: Paper | null;
  hoveredPaper: Paper | null;
  filterJournal: string | null;
  searchQuery: string;
  showKeywords: boolean;
  showLabels: boolean;
  hiddenTopics: string[];
  colorMode: ColorMode;
  currentView: ViewMode;
  
  setData: (papers: Paper[], topics: Topic[], globalData: GlobalData | null) => void;
  selectPaper: (paper: Paper | null) => void;
  setHoveredPaper: (paper: Paper | null) => void;
  setFilterJournal: (journal: string | null) => void;
  setSearchQuery: (query: string) => void;
  setShowKeywords: (show: boolean) => void;
  setShowLabels: (show: boolean) => void;
  toggleTopicVisibility: (topicId: string) => void;
  setColorMode: (mode: ColorMode) => void;
  setCurrentView: (view: ViewMode) => void;
}

export const useStore = create<AppState>((set) => ({
  papers: [],
  topics: [],
  globalData: null,
  selectedPaper: null,
  hoveredPaper: null,
  filterJournal: null,
  searchQuery: '',
  showKeywords: true,
  showLabels: true,
  hiddenTopics: [],
  colorMode: 'topic',
  currentView: 'explorer',

  setData: (papers, topics, globalData) => set({ papers, topics, globalData }),
  selectPaper: (paper) => set({ selectedPaper: paper }),
  setHoveredPaper: (paper) => set({ hoveredPaper: paper }),
  setFilterJournal: (journal) => set({ filterJournal: journal }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setShowKeywords: (show) => set({ showKeywords: show }),
  setShowLabels: (show) => set({ showLabels: show }),
  toggleTopicVisibility: (topicId) => set((state) => ({
    hiddenTopics: state.hiddenTopics.includes(topicId)
      ? state.hiddenTopics.filter(id => id !== topicId)
      : [...state.hiddenTopics, topicId]
  })),
  setColorMode: (mode) => set({ colorMode: mode }),
  setCurrentView: (view) => set({ currentView: view }),
}));
