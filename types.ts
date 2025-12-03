export enum TabView {
  GOV = 'GOVERNMENT',
  ECON = 'ECONOMY',
  SOCIAL = 'SOCIAL',
  GEO = 'GEOPOLITICS',
  MILITARY = 'MILITARY',
  ACHIEVEMENTS = 'ACHIEVEMENTS',
}

export enum TypingSoundMode {
  CLICK = 'CLICK',
  MURMUR = 'MURMUR',
  NONE = 'NONE',
}

export enum DifficultyLevel {
  RADICAL = 'RADICAL',
  EASY = 'EASY',
  NORMAL = 'NORMAL',
  HARD = 'HARD',
  REALISTIC = 'REALISTIC'
}

export interface AudioSettings {
  masterVolume: number; // 0-1
  uiVolume: number; // 0-1
  ambienceVolume: number; // 0-1
  typingMode: TypingSoundMode;
  isMuted: boolean;
}

export interface Advisor {
  name: string;
  role: string;
  personality: string;
  suggestion: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  condition: string;
  category: 'Economy' | 'Military' | 'Domestic' | 'Diplomacy' | 'Scandals' | 'Social' | 'Chaos';
  icon?: string;
}

export interface CountryStats {
  // Gov
  approvalRating: number;
  politicalStability: number;
  corruption: number;
  
  // Econ
  gdp: number; // in billions
  inflation: number;
  unemployment: number;
  treasury: number; // in billions

  // Social
  civilUnrest: number;
  healthcare: number;
  
  // Military
  militaryReadiness: number;
  internationalTension: number;
}

export interface GameState {
  countryName: string;
  leaderTitle: string;
  difficulty: DifficultyLevel;
  day: number;
  isGameOver: boolean;
  gameOverReason: string | null;
  stats: CountryStats;
  history: HistoryEntry[];
  newsHeadlines: string[];
  advisors: Advisor[];
  recentEvents: string;
  unlockedAchievementIds: string[]; // Track IDs of unlocked achievements
}

export interface HistoryEntry {
  day: number;
  action: string;
  consequence: string;
}

// Structures for Gemini JSON response
export interface SimulationResponse {
  narrative: string;
  newsHeadlines: string[];
  statChanges: Partial<CountryStats>;
  isGameOver: boolean;
  gameOverReason?: string;
  advisors: Advisor[];
  newUnlockedAchievementIds: string[]; // AI returns IDs of newly unlocked items
}

export interface InitialSetupResponse {
  leaderTitle: string;
  initialStats: CountryStats;
  initialNews: string[];
  initialAdvisors: Advisor[];
  introNarrative: string;
}