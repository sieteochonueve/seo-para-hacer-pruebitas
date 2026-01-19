export interface ScoreMetric {
  score: number; // 0-100
  status: 'critical' | 'warning' | 'good';
}

export interface AuditItem {
  id?: string;
  title: string;
  status: 'passed' | 'warning' | 'failed';
  description: string;
  recommendation?: string;
  proTip?: string; 
  impact?: 'High' | 'Medium' | 'Low';
  effort?: 'High' | 'Medium' | 'Low';
  whyItMatters?: string;
  fixSteps?: string[];
  docLink?: string;
}

export interface SubSection {
  title: string;
  items: AuditItem[];
}

export interface PillarData {
  score: number;
  subSections: SubSection[];
}

export interface AIVisibility {
  model: 'ChatGPT' | 'Gemini' | 'Perplexity' | 'Claude';
  visibility: number; // 0-100
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  mentions: string;
}

export interface AIPillarData extends PillarData {
  visibilityMetrics: AIVisibility[];
  comparison: {
    currentMonth: number;
    lastMonth: number;
    trend: 'up' | 'down' | 'stable';
  };
  readinessScore: number;
}

export interface RoadmapItem {
  task: string;
  impact: 'Alto' | 'Medio' | 'Bajo';
  effort: 'Alto' | 'Medio' | 'Bajo';
  timeframe: 'Quick Win' | '30 Días' | '60 Días' | '90 Días';
  description: string;
}

export interface Competitor {
  name: string;
  da: number;
  strengths: string;
  weaknesses: string;
  missedKeywords: string[]; // Missed by site, ranked by competitor
}

export interface CompetitiveAnalysis {
  competitors: Competitor[];
  sharedKeywords: string[];
  contentGaps: string[];
  strategies: string[];
}

export interface AuditReport {
  url: string;
  timestamp: string;
  globalScore: number;
  pillars: {
    technical: PillarData;
    onPage: PillarData;
    offPage: PillarData;
    ux: PillarData;
    aiSeo: AIPillarData;
  };
  competitive: CompetitiveAnalysis;
  roadmap: RoadmapItem[];
  summary: {
    criticalFindings: AuditItem[]; 
    quickWins: string[];
  };
}

export enum ViewState {
  Input = 'INPUT',
  Loading = 'LOADING',
  Dashboard = 'DASHBOARD',
  Technical = 'TECHNICAL',
  OnPage = 'ONPAGE',
  OffPage = 'OFFPAGE',
  UX = 'UX',
  AI = 'AI',
  Competitive = 'COMPETITIVE',
  Roadmap = 'ROADMAP',
  IssuesMatrix = 'ISSUES_MATRIX'
}
