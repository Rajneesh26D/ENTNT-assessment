import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Calendar,
  Edit,
  Archive,
  Loader2,
  Users,
} from 'lucide-react';
import HrLayout from '../components/layout/HrLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import type { Job } from '../services/db';
import { db } from '../services/db';

const JobDetails: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [candidateCount, setCandidateCount] = useState(0);

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) return;

      const jobData = await db.jobs.get(jobId);
      setJob(jobData || null);

      const count = await db.candidates.where('jobId').equals(jobId).count();
      setCandidateCount(count);

      setLoading(false);
    };

    fetchJob();
  }, [jobId]);

  const handleArchiveToggle = async () => {
    if (!job) return;

    await db.jobs.update(job.id, {
      status: job.status === 'active' ? 'archived' : 'active',
    });

    navigate('/hr/jobs');
  };

  if (loading) {
    return (
      <HrLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
      </HrLayout>
    );
  }

  if (!job) {
    return (
      <HrLayout>
        <div className="text-center py-20">
          <p className="text-slate-400 mb-4">Job not found</p>
          <Link to="/hr/jobs">
            <Button>Back to Jobs</Button>
          </Link>
        </div>
      </HrLayout>
    );
  }

  return (
    <HrLayout>
      <div className="space-y-6">
        <Link
          to="/hr/jobs"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card gradient>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-slate-400">
                      {job.location && (
                        <span className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                      )}
                      {job.type && (
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </span>
                      )}
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Created {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {candidateCount} candidates
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 text-sm border border-purple-500/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button variant="gradient" icon={<Edit className="w-4 h-4" />}>
                  Edit Job
                </Button>
                <Button
                  variant={job.status === 'active' ? 'danger' : 'secondary'}
                  icon={<Archive className="w-4 h-4" />}
                  onClick={handleArchiveToggle}
                >
                  {job.status === 'active' ? 'Archive' : 'Unarchive'}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {job.description && (
              <Card title="Description">
                <p className="text-slate-300 leading-relaxed">{job.description}</p>
              </Card>
            )}

            {job.requirements && job.requirements.length > 0 && (
              <Card title="Requirements">
                <ul className="space-y-3">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-purple-400 mt-2" />
                      {req}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card title="Job Information">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Status</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Slug</p>
                  <p className="text-slate-300 font-mono text-sm">{job.slug}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Created</p>
                  <p className="text-slate-300">
                    {new Date(job.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Candidates</p>
                  <p className="text-slate-300 font-semibold">{candidateCount}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </HrLayout>
  );
};

export default JobDetails;
