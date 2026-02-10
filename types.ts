
export enum RiskLevel {
  SAFE = 'SAFE',
  CAUTION = 'CAUTION',
  DANGER = 'DANGER'
}

export interface DocumentSource {
  data: string; // Base64
  mimeType: string;
}

export interface Clause {
  id: string;
  originalText: string;
  simpleExplanation: string; // Changed from object to simple string for performance
  riskLevel: RiskLevel;
  riskJustification: string;
  obligations: string[];
  rights: string[];
}

export interface DocumentSummary {
  overview: string;
  keyRisks: string[];
  suggestedActions: string[];
  criticalClauses: string[];
}

export interface AnalysisResult {
  title: string;
  clauses: Clause[];
  summary: DocumentSummary;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}