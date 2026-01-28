export interface SearchCriteria {
  techStack: string;
  experienceLevel: 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Architect';
  role: string;
  location: string;
  keywords: string;
}

export interface Candidate {
  id: string;
  name: string;
  currentTitle: string;
  location: string;
  matchScore: number;
  skills: string[];
  summary: string;
  justification: string;
  profileUrl?: string;
}

export interface Assignment {
  id: string;
  title: string;
  client: string;
  description: string;
  location: string;
  source?: string; // e.g. "Ework", "Verama", "LinkedIn"
  url?: string;    // Direct link to ad
  deadline?: string;
  datePosted?: string;
  isActive?: boolean;
}

export interface MatchResult {
  assignmentId: string;
  candidateId: string;
  matchScore: number;
  reason: string;
  strengths: string[];
  gaps: string[];
}

export interface SearchResult {
  generatedBooleanString: string;
  candidates: Candidate[];
}

export enum AppState {
  IDLE,
  SEARCHING,
  RESULTS,
  ERROR
}