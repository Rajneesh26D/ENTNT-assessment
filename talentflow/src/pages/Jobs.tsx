import React, { useState } from "react";
import { Plus, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import HrLayout from "../components/layout/HrLayout";
import JobFilters from "../components/jobs/JobFilters";
import DraggableJobList from "../components/jobs/DraggableJobList";
import JobForm from "../components/jobs/JobForm";
import Button from "../components/ui/Button";
import { useJobs } from "../hooks/useJobs";
import type { Job } from "../services/db";
import { Download } from 'lucide-react';
import { exportJobsToJSON } from '../utils/export';


const Jobs: React.FC = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const {
    jobs,
    loading,
    error,
    pagination,
    updateJob,
    fetchJobs,
    reorderJobs,
  } = useJobs(search, statusFilter, currentPage, 10);

  const handleCreateJob = () => {
    setEditingJob(null);
    setShowJobForm(true);
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setShowJobForm(true);
  };

  const handleFormSuccess = () => {
    fetchJobs();
    setShowJobForm(false);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <HrLayout title="Jobs">
      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
            <p className="text-sm text-purple-300">
              Total:{" "}
              <span className="font-bold text-white">{pagination.total}</span>{" "}
              jobs
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshCw className="w-4 h-4" />}
              onClick={fetchJobs}
            >
              Refresh
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={() => exportJobsToJSON(jobs)}
            >
              Export JSON
            </Button>

            {/* CHANGED: gradient → primary */}
            <Button
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={handleCreateJob}
            >
              Create Job
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <JobFilters
          onSearch={handleSearch}
          onStatusFilter={handleStatusFilter}
          currentStatus={statusFilter}
        />

        {/* Content */}
        <div>
          {loading && currentPage === 1 ? (
            <div
              key="loading"
              className="flex flex-col items-center justify-center py-20"
            >
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin mb-4" />
              <p className="text-slate-400">Loading jobs...</p>
            </div>
          ) : error ? (
            <div
              key="error"
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
              <p className="text-slate-300 text-lg mb-2">
                Oops! Something went wrong
              </p>
              <p className="text-slate-500 text-sm mb-4">{error}</p>
              <Button onClick={fetchJobs}>Try Again</Button>
            </div>
          ) : jobs.length === 0 ? (
            <div
              key="empty"
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <p className="text-slate-400 text-lg mb-4">No jobs found</p>
              {/* CHANGED: gradient → primary */}
              <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
                Create Your First Job
              </Button>
            </div>
          ) : (
            <div key="list">
              <DraggableJobList
                jobs={jobs}
                onUpdate={updateJob}
                onEdit={handleEditJob}
                onReorder={reorderJobs}
              />

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-slate-400 text-sm">
                    Page {currentPage} of {pagination.totalPages} • Showing{" "}
                    {jobs.length} of {pagination.total} jobs
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
                        { length: Math.min(5, pagination.totalPages) },
                        (_, i) => {
                          let page: number;
                          if (pagination.totalPages <= 5) {
                            page = i + 1;
                          } else if (currentPage <= 3) {
                            page = i + 1;
                          } else if (currentPage >= pagination.totalPages - 2) {
                            page = pagination.totalPages - 4 + i;
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
                      disabled={currentPage === pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Job Form Modal */}
      <JobForm
        isOpen={showJobForm}
        onClose={() => setShowJobForm(false)}
        job={editingJob}
        onSuccess={handleFormSuccess}
      />
    </HrLayout>
  );
};

export default Jobs;