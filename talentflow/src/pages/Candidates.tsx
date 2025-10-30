import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  List,
  LayoutGrid,
  Loader2,
  AlertCircle,
  RefreshCw,
  Upload,
  Download,
  Info,
} from 'lucide-react';
import HrLayout from '../components/layout/HrLayout';
import CandidateSearch from '../components/candidates/CandidateSearch';
import KanbanBoard from '../components/candidates/KanbanBoard';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import type { Candidate } from '../services/db';
import { exportCandidatesToCSV, importCandidatesFromCSV } from '../utils/export';
import { VirtualizedCandidateList } from './VirtualizedCandidateList';
import { liveQuery } from 'dexie';
import { db } from '../services/db';

type ViewMode = 'list' | 'kanban';

const Candidates: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showImportHelp, setShowImportHelp] = useState(false);

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pageSize = 40;

  useEffect(() => {
    setLoading(true);
    setError(null);

    const subscription = liveQuery(async () => {
      const [allCandidates, total] = await Promise.all([
        db.candidates.toArray(),
        db.candidates.count(),
      ]);
      return { allCandidates, total };
    }).subscribe({
      next: ({ allCandidates}) => {
        setCandidates(allCandidates);
        setLoading(false);
      },
      error: (err) => {
        console.error('liveQuery error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load candidates');
        setLoading(false);
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStageFilter = (stage: string) => {
    setStageFilter(stage);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const count = await importCandidatesFromCSV(file);
      alert(`Successfully imported ${count} candidates!`);
    } catch (error) {
      alert('Error importing candidates. Please check CSV format.');
      console.error(error);
    }

    event.target.value = '';
  };

  const handleExport = () => {
    exportCandidatesToCSV(candidates);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500); 
  };

  const allDisplayCandidates = candidates.filter((c) => {
    const matchesSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search));

    const matchesStage = !stageFilter || c.stage === stageFilter;

    return matchesSearch && matchesStage;
  });

  const displayCandidates = allDisplayCandidates.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const displayTotal = allDisplayCandidates.length;
  const displayTotalPages = Math.ceil(displayTotal / pageSize);

  return (
    <HrLayout title="Candidates">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
              <p className="text-sm text-purple-300">
                Total:{" "}
                <span className="font-bold text-white">{displayTotal}</span>{" "}
                candidates
              </p>
            </div>

            <div className="flex items-center gap-2 p-1 rounded-xl bg-white/5 border border-white/10">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === "list"
                    ? "bg-purple-500 text-white shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <List className="w-4 h-4" />
                List
              </button>
              <button
                onClick={() => setViewMode("kanban")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === "kanban"
                    ? "bg-purple-500 text-white shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Kanban
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshCw className="w-4 h-4" />}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
            
            <div className="flex items-center gap-1">
              <label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImport}
                  className="hidden"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Upload className="w-4 h-4" />}
                  as="span"
                >
                  Import CSV
                </Button>
              </label>
                  
              <button
                onClick={() => setShowImportHelp(true)}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg"
                title="CSV Format Help"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
            
            <Button
              variant="secondary"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={handleExport}
            >
              Export CSV
            </Button>
          </div>
        </div>

        <CandidateSearch
          onSearch={handleSearch}
          onStageFilter={handleStageFilter}
          currentStage={stageFilter}
        />

        <AnimatePresence mode="wait">
          {loading && currentPage === 1 ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
               <Loader2 className="w-8 h-8 text-purple-400 animate-spin mb-4" />
               <p className="text-slate-400">Loading candidates...</p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
              <p className="text-slate-300 text-lg mb-2">
                Oops! Something went wrong
              </p>
              <p className="text-slate-500 text-sm mb-4">{error}</p>
              <Button onClick={handleRefresh}>Try Again</Button>
            </motion.div>
          ) : viewMode === "list" ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <VirtualizedCandidateList
                candidates={displayCandidates}
                onUpdate={async (id, updates) => {
                  await db.candidates.update(id, updates);
                }}
              />

              {displayTotalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                   <p className="text-slate-400 text-sm">
                    Page {currentPage} of {displayTotalPages} • Showing{" "}
                    {displayCandidates.length} of {displayTotal} candidates
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: Math.min(5, displayTotalPages) },
                        (_, i) => {
                          let page: number;
                          if (displayTotalPages <= 5) {
                            page = i + 1;
                          } else if (currentPage <= 3) {
                            page = i + 1;
                          } else if (currentPage >= displayTotalPages - 2) {
                            page = displayTotalPages - 4 + i;
                          } else {
                            page = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                                currentPage === page
                                  ? "bg-purple-500 text-white"
                                  : "text-slate-400 hover:text-white hover:bg-white/5"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        }
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === displayTotalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="kanban"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <KanbanBoard
                candidates={displayCandidates}
                onUpdate={async (id, updates) => {
                  await db.candidates.update(id, updates);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Modal
        isOpen={showImportHelp}
        onClose={() => setShowImportHelp(false)}
        title="CSV Import Format"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-slate-300">
            To import candidates, your CSV file must follow this exact format:
          </p>
              
          <div className="p-4 rounded-lg bg-slate-900 border border-slate-700">
            <p className="text-xs text-slate-500 mb-2 font-mono">CSV Format:</p>
            <pre className="text-sm text-green-400 font-mono overflow-x-auto">{`Name,Email,Phone,Stage,Job Title,Applied Date
John Doe,john@example.com,1234567890,applied,Senior Developer,2024-10-01
Jane Smith,jane@example.com,0987654321,screening,Backend Engineer,2024-10-15`}
            </pre>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-white font-semibold">Field Descriptions:</h3>
                  
            <div className="space-y-2 text-sm">
              <div className="flex gap-2">
                <span className="text-purple-400 font-mono w-32">Name:</span>
                <span className="text-slate-300">Candidate's full name (Required)</span>
              </div>
              <div className="flex gap-2">
                <span className="text-purple-400 font-mono w-32">Email:</span>
                <span className="text-slate-300">Email address</span>
              </div>
              <div className="flex gap-2">
                <span className="text-purple-400 font-mono w-32">Phone:</span>
                <span className="text-slate-300">Phone number (Optional)</span>
              </div>
              <div className="flex gap-2">
                <span className="text-purple-400 font-mono w-32">Stage:</span>
                <span className="text-slate-300">
                  One of: <code className="text-cyan-400">applied, screening, technical, offer, hired, rejected</code>
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-purple-400 font-mono w-32">Job Title:</span>
                <span className="text-slate-300">Position name</span>
              </div>
              <div className="flex gap-2">
                <span className="text-purple-400 font-mono w-32">Applied Date:</span>
                <span className="text-slate-300">Date in YYYY-MM-DD format</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <h4 className="text-blue-300 font-semibold mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Note:
            </h4>
            <ul className="text-sm text-blue-200 space-y-1 list-disc list-inside">
              <li>First row must be the header (exactly as shown above)</li>
              <li>No empty lines between rows</li>
              <li>Use commas to separate values</li>
              <li>Dates should be in YYYY-MM-DD format</li>
              <li>Export existing candidates to see an example</li>
            </ul>
          </div>
          
          <div className="flex justify-end pt-4 border-t border-white/10">
            <Button onClick={() => setShowImportHelp(false)}>
              Got it!
            </Button>
          </div>
        </div>
      </Modal>
    </HrLayout>
  );
};

export default Candidates;