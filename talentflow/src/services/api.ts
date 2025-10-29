/* eslint-disable @typescript-eslint/no-explicit-any */
import type Dexie from 'dexie';
import { http, HttpResponse } from 'msw';
import { setupWorker } from 'msw/browser';
import { db } from './db';
import type { Candidate, TimelineEvent } from './db'; 

// Simulate network delay and errors
const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 200));
const shouldError = () => Math.random() < 0.08; // 8% error rate

function candidatesTable() {
  const tbl = (db as any).table ? (db as any).table('candidates') : undefined;
  if (!tbl) {
    console.error('Dexie table "candidates" is not available yet on db:', db);
  }
  return tbl as Dexie.Table<Candidate, string> | undefined;
}

function timelineTable() {
  const tbl = (db as any).table ? (db as any).table('timeline') : undefined;
  if (!tbl) {
    console.error('Dexie table "timeline" is not available yet on db:', db);
  }
  return tbl as Dexie.Table<TimelineEvent, string> | undefined;
}

export const handlers = [
  // GET /api/candidates (UPDATED to v2)
  http.get('/api/candidates', async ({ request }) => {
    await delay();

    if (shouldError()) {
      return HttpResponse.json({ error: 'Server error' }, { status: 500 });
    }

    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const stage = url.searchParams.get('stage') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '40');

    const tbl = candidatesTable();
    if (!tbl) {
      return HttpResponse.json({ error: 'Database not ready' }, { status: 500 });
    }

    let query = tbl.toCollection();

    // Filter by stage
    if (stage) {
      query = tbl.where('stage').equals(stage as Candidate['stage']);
    }

    // Get all for search
    let candidates = await query.toArray();

    // Client-side search
    if (search) {
      const searchLower = search.toLowerCase();
      candidates = candidates.filter(
        c => c.name.toLowerCase().includes(searchLower) ||
             c.email.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const total = candidates.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedCandidates = candidates.slice(start, end);

    return HttpResponse.json({
      data: paginatedCandidates,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  }),

  // GET /api/candidates/:id (UPDATED to v2)
  http.get('/api/candidates/:id', async ({ params }) => {
    await delay();

    if (shouldError()) {
      return HttpResponse.json({ error: 'Server error' }, { status: 500 });
    }

    const { id } = params;
    const tbl = candidatesTable();
    if (!tbl) {
      return HttpResponse.json({ error: 'Database not ready' }, { status: 500 });
    }

    const candidate = await tbl.get(id as string);

    if (!candidate) {
      return HttpResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }

    return HttpResponse.json(candidate);
  }),

  // PATCH /api/candidates/:id (UPDATED to v2)
  http.patch('/api/candidates/:id', async ({ request, params }) => {
    await delay();

    if (shouldError()) {
      return HttpResponse.json({ error: 'Failed to update candidate' }, { status: 500 });
    }

    const { id } = params;
    const updates = await request.json() as Partial<Candidate> & { notes?: string }; // Get JSON body

    const tbl = candidatesTable();
    const tl = timelineTable();
    if (!tbl) {
      return HttpResponse.json({ error: 'Database not ready' }, { status: 500 });
    }

    await tbl.update(id as string, updates);

    // Add timeline event if stage changed
    if (updates.stage && tl) {
      await tl.add({
        id: `timeline-${Date.now()}`,
        candidateId: id as string,
        stage: updates.stage,
        timestamp: new Date().toISOString(),
        notes: updates.notes || `Moved to ${updates.stage}`,
        changedBy: 'Current User',
      });
    }

    const candidate = await tbl.get(id as string);
    return HttpResponse.json(candidate);
  }),

  // GET /api/candidates/:id/timeline (UPDATED to v2)
  http.get('/api/candidates/:id/timeline', async ({ params }) => {
    await delay();

    const { id } = params;
    const tl = timelineTable();
    if (!tl) {
      return HttpResponse.json({ error: 'Database not ready' }, { status: 500 });
    }

    const events = await tl
      .where('candidateId')
      .equals(id as string)
      .sortBy('timestamp');

    return HttpResponse.json(events);
  }),

  // POST /api/candidates (UPDATED to v2)
  http.post('/api/candidates', async ({ request }) => {
    await delay();

    if (shouldError()) {
      return HttpResponse.json({ error: 'Failed to create candidate' }, { status: 500 });
    }

    const data = await request.json() as Omit<Candidate, 'id' | 'appliedDate'>; // Get JSON body
    const newCandidate: Candidate = {
      id: `cand-${Date.now()}`,
      ...data,
      appliedDate: new Date().toISOString(),
    };

    const tbl = candidatesTable();
    const tl = timelineTable();
    if (!tbl) {
      return HttpResponse.json({ error: 'Database not ready' }, { status: 500 });
    }

    await tbl.add(newCandidate);

    // Add initial timeline event
    if (tl) {
      await tl.add({
        id: `timeline-${Date.now()}`,
        candidateId: newCandidate.id,
        stage: 'applied',
        timestamp: new Date().toISOString(),
        notes: 'Application submitted',
        changedBy: 'System',
      });
    }

    return HttpResponse.json(newCandidate, { status: 201 }); // 201 Created
  }),
];

export const worker = setupWorker(...handlers);