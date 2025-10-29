import { useState, useEffect, useCallback } from 'react';
import type { Job } from '../services/db';
import { db } from '../services/db';
import { arrayMove } from '@dnd-kit/sortable'; // We'll use this helper

interface UseJobsReturn {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  fetchJobs: () => Promise<void>;
  updateJob: (id: string, updates: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  // --- UPDATED ---
  reorderJobs: (activeId: string, overId: string) => Promise<void>;
}

export function useJobs(
  search: string = '',
  statusFilter: string = '',
  page: number = 1,
  pageSize: number = 10
): UseJobsReturn {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = db.jobs.toCollection();

      // Filter by status
      if (statusFilter) {
        query = db.jobs.where('status').equals(statusFilter);
      }

      // --- Sort by order is crucial for reordering ---
      let allJobs = await query.sortBy('order');

      // Client-side search
      if (search) {
        const searchLower = search.toLowerCase();
        allJobs = allJobs.filter(
          j => j.title.toLowerCase().includes(searchLower) ||
               j.tags.some(t => t.toLowerCase().includes(searchLower))
        );
      }

      // Calculate pagination
      const total = allJobs.length;
      const totalPages = Math.ceil(total / pageSize);
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedJobs = allJobs.slice(start, end);

      setJobs(paginatedJobs);
      setPagination({ page, pageSize, total, totalPages });
    } catch (err) {
      setError(`Failed to fetch jobs: ${err}`);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page, pageSize]);

  const updateJob = async (id: string, updates: Partial<Job>) => {
    await db.jobs.update(id, updates);
    await fetchJobs();
  };

  const deleteJob = async (id: string) => {
    await db.jobs.delete(id);
    await fetchJobs();
  };

  // --- NEW reorderJobs LOGIC ---
  const reorderJobs = async (activeId: string, overId: string) => {
    try {
      // Optimistically update the UI *before* the DB call
      setJobs((prevJobs) => {
        const activeIndex = prevJobs.findIndex((j) => j.id === activeId);
        const overIndex = prevJobs.findIndex((j) => j.id === overId);
        return arrayMove(prevJobs, activeIndex, overIndex);
      });

      // Now, update the full list order in the database
      const allJobs = await db.jobs.orderBy('order').toArray();
      const activeIndex = allJobs.findIndex((j) => j.id === activeId);
      const overIndex = allJobs.findIndex((j) => j.id === overId);

      if (activeIndex === -1 || overIndex === -1) {
        throw new Error("Job not found for reordering");
      }

      // 1. Create the new, re-sorted array
      const newSortedJobs = arrayMove(allJobs, activeIndex, overIndex);

      // 2. Create an array of updates to persist the new order
      const updates = newSortedJobs.map((job, index) => ({
        ...job,
        order: index, // Re-assign the order based on the new array index
      }));

      // 3. Save all changes to the DB
      await db.jobs.bulkPut(updates);

    } catch (err) {
      console.error("Failed to reorder jobs:", err);
      // If DB update fails, fetch from DB to revert UI
      await fetchJobs();
    }
  };
  // --- END NEW LOGIC ---

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return {
    jobs,
    loading,
    error,
    pagination,
    fetchJobs,
    updateJob,
    deleteJob,
    reorderJobs,
  };
}