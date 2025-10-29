import { useState, useEffect, useCallback } from 'react';
import type { Candidate } from '../services/db';
import { db } from '../services/db';

interface UseCandidatesReturn {
  candidates: Candidate[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  fetchCandidates: () => Promise<void>;
  updateCandidate: (id: string, updates: Partial<Candidate>) => Promise<void>;
}

export function useCandidates(
  search: string = '',
  stage: string = '',
  page: number = 1,
  pageSize: number = 40
): UseCandidatesReturn {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 40,
    total: 0,
    totalPages: 0,
  });

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch directly from IndexedDB for better performance
      let query = db.candidates.toCollection();

      // Filter by stage
      if (stage) {
        query = db.candidates.where('stage').equals(stage as Candidate['stage']);
      }

      let allCandidates = await query.toArray();

      // Client-side search
      if (search) {
        const searchLower = search.toLowerCase();
        allCandidates = allCandidates.filter(
          c => c.name.toLowerCase().includes(searchLower) || 
               c.email.toLowerCase().includes(searchLower)
        );
      }

      // Calculate pagination
      const total = allCandidates.length;
      const totalPages = Math.ceil(total / pageSize);
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedCandidates = allCandidates.slice(start, end);

      setCandidates(paginatedCandidates);
      setPagination({
        page,
        pageSize,
        total,
        totalPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch candidates');
    } finally {
      setLoading(false);
    }
  }, [search, stage, page, pageSize]);

  const updateCandidate = async (id: string, updates: Partial<Candidate>) => {
    try {
      // Update in IndexedDB
      await db.candidates.update(id, updates);

      // Add timeline event if stage changed
      if (updates.stage) {
        await db.timeline.add({
          id: `timeline-${Date.now()}`,
          candidateId: id,
          stage: updates.stage,
          timestamp: new Date().toISOString(),
          notes: Array.isArray(updates.notes) ? updates.notes.map(n => n.text).join(', ') : (updates.notes || `Moved to ${updates.stage}`),
          changedBy: 'Current User',
        });
      }

      // Refresh candidates
      await fetchCandidates();
    } catch (err) {
      throw new Error(`Failed to update candidate: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  return {
    candidates,
    loading,
    error,
    pagination,
    fetchCandidates,
    updateCandidate,
  };
}
