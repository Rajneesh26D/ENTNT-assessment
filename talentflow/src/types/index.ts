export interface Job {
  id: string;
  title: string;
  slug: string;
  status: 'active' | 'archived';
  tags: string[];
  order: number;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  stage: 'applied' | 'screen' | 'tech' | 'offer' | 'hired' | 'rejected';
  jobId: string;
}

export interface TimelineEvent {
  id: string;
  stage: 'applied' | 'screen' | 'tech' | 'offer' | 'hired';
  timestamp: string;
  notes: string;
}

export type QuestionType = 
  | 'single-choice'
  | 'multi-choice'
  | 'short-text'
  | 'long-text'
  | 'numeric'
  | 'file-upload';

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  required?: boolean;
  min?: number;
  max?: number;
  maxLength?: number;
  conditional?: {
    questionId: string;
    value: string | string[];
  };
}

export interface Section {
  id: string;
  title: string;
  questions: Question[];
}

export interface Assessment {
  jobId: string;
  sections: Section[];
}

export interface AssessmentResponse {
  questionId: string;
  value: string | string[] | number;
}