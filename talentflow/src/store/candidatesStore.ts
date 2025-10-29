import { create } from 'zustand';
import type { Candidate } from '../types';

interface CandidatesState {
  candidates: Candidate[];
  setCandidates: (candidates: Candidate[]) => void;
  addCandidate: (candidate: Candidate) => void;
  updateCandidate: (candidate: Candidate) => void;
  removeCandidate: (candidateId: string) => void;
  moveCandidate: (candidateId: string, newStage: Candidate['stage']) => void;
}

export const useCandidatesStore = create<CandidatesState>((set) => ({
  candidates: [],
  setCandidates: (candidates) => set({ candidates }),
  addCandidate: (candidate) => set((state) => ({ candidates: [...state.candidates, candidate] })),
  updateCandidate: (updatedCandidate) => set((state) => ({
    candidates: state.candidates.map(candidate => 
      candidate.id === updatedCandidate.id ? updatedCandidate : candidate
    )
  })),
  removeCandidate: (candidateId) => set((state) => ({
    candidates: state.candidates.filter(candidate => candidate.id !== candidateId)
  })),
  moveCandidate: (candidateId, newStage) => set((state) => ({
    candidates: state.candidates.map(candidate => 
      candidate.id === candidateId ? { ...candidate, stage: newStage } : candidate
    )
  })),
}));