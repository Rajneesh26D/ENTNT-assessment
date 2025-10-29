import { create } from 'zustand';
import type { Assessment, AssessmentResponse } from '../types';

interface AssessmentsState {
  assessments: Record<string, Assessment>;
  setAssessments: (assessments: Record<string, Assessment>) => void;
  addAssessment: (assessment: Assessment) => void;
  updateAssessment: (assessment: Assessment) => void;
  removeAssessment: (jobId: string) => void;
  submitAssessment: (jobId: string, responses: AssessmentResponse[]) => void;
}

export const useAssessmentsStore = create<AssessmentsState>((set) => ({
  assessments: {},
  setAssessments: (assessments) => set({ assessments }),
  addAssessment: (assessment) => set((state) => ({
    assessments: { ...state.assessments, [assessment.jobId]: assessment }
  })),
  updateAssessment: (updatedAssessment) => set((state) => ({
    assessments: { ...state.assessments, [updatedAssessment.jobId]: updatedAssessment }
  })),
  removeAssessment: (jobId) => set((state) => {
    const newAssessments = { ...state.assessments };
    delete newAssessments[jobId];
    return { assessments: newAssessments };
  }),
  submitAssessment: (jobId, responses) => {
    // In a real app, we would save these responses to IndexedDB
    // For now, we'll just log them
    console.log(`Assessment responses for job ${jobId}:`, responses);
    return { jobId, responses };
  },
}));