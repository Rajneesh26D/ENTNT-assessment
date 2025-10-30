// import { create } from 'zustand';
// import type { Job } from '../types';

// interface JobsState {
//   jobs: Job[];
//   setJobs: (jobs: Job[]) => void;
//   addJob: (job: Job) => void;
//   updateJob: (job: Job) => void;
//   removeJob: (jobId: string) => void;
//   reorderJobs: (fromIndex: number, toIndex: number) => void;
// }

// export const useJobsStore = create<JobsState>((set) => ({
//   jobs: [],
//   setJobs: (jobs) => set({ jobs }),
//   addJob: (job) => set((state) => ({ jobs: [...state.jobs, job] })),
//   updateJob: (updatedJob) => set((state) => ({
//     jobs: state.jobs.map(job => job.id === updatedJob.id ? updatedJob : job)
//   })),
//   removeJob: (jobId) => set((state) => ({
//     jobs: state.jobs.filter(job => job.id !== jobId)
//   })),
//   reorderJobs: (fromIndex, toIndex) => set((state) => {
//     const newJobs = [...state.jobs];
//     const [movedJob] = newJobs.splice(fromIndex, 1);
//     newJobs.splice(toIndex, 0, movedJob);
//     return { jobs: newJobs };
//   }),
// }));