import Dexie from 'dexie';

// New: Job interface
export interface Job {
  id: string;
  title: string;
  slug: string;
  status: 'active' | 'archived';
  tags: string[];
  order: number;
  location?: string;
  type?: string;
  description?: string;
  requirements?: string[];
  createdAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  stage: 'applied' | 'screening' | 'technical' | 'offer' | 'hired' | 'rejected';
  jobId: string;
  jobTitle?: string;
  appliedDate: string;
  notes?: Note[];
  avatar?: string;
}

export interface Note {
  id: string;
  text: string;
  mentions: string[];
  createdAt: string;
  createdBy: string;
}

export interface TimelineEvent {
  id: string;
  candidateId: string;
  stage: string;
  timestamp: string;
  notes: string;
  changedBy: string;
}

// New: assessment schema types
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
  description?: string;
  questions: Question[];
}

export interface Assessment {
  jobId: string;
  jobTitle?: string;
  sections: Section[];
  createdAt: string;
  updatedAt: string;
}

export type QuestionResponse = string | string[] | number | File;

export interface AssessmentResponse {
  id: string;
  assessmentId: string;
  candidateId: string;
  responses: Record<string, QuestionResponse>;
  submittedAt: string;
}

// Updated TalentFlowDB to include jobs table
class TalentFlowDB extends Dexie {
  jobs!: Dexie.Table<Job>;
  candidates!: Dexie.Table<Candidate>;
  timeline!: Dexie.Table<TimelineEvent>;

  // New tables for assessments
  assessments!: Dexie.Table<Assessment>;
  assessmentResponses!: Dexie.Table<AssessmentResponse>;

  constructor() {
    super('TalentFlowDB');
    this.version(1).stores({
      jobs: 'id, title, status, order, slug',
      candidates: 'id, name, email, stage, jobId, appliedDate',
      timeline: 'id, candidateId, timestamp',
      assessments: 'jobId, createdAt',
      assessmentResponses: 'id, assessmentId, candidateId, submittedAt',
    });
    
    this.jobs = this.table('jobs');
    this.candidates = this.table('candidates');
    this.timeline = this.table('timeline');

    // Initialize new tables
    this.assessments = this.table('assessments');
    this.assessmentResponses = this.table('assessmentResponses');
  }
}

export const db = new TalentFlowDB();
