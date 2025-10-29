import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import HrLayout from '../components/layout/HrLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import NotesEditor from '../components/candidates/NotesEditor';
import ProfileTimeline from '../components/candidates/ProfileTimeline';
import type { Candidate, TimelineEvent } from '../services/db';

const CandidateProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    const fetchCandidate = async () => {
      if (!id) return;
      
      const [candidateRes, timelineRes] = await Promise.all([
        fetch(`/api/candidates/${id}`),
        fetch(`/api/candidates/${id}/timeline`),
      ]);

      if (candidateRes.ok && timelineRes.ok) {
        setCandidate(await candidateRes.json());
        setTimeline(await timelineRes.json());
      }
      
      setLoading(false);
    };

    fetchCandidate();
  }, [id]);

  if (loading) {
    return (
      <HrLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
      </HrLayout>
    );
  }

  if (!candidate) {
    return (
      <HrLayout>
        <div className="text-center py-20">
          <p className="text-slate-400">Candidate not found</p>
        </div>
      </HrLayout>
    );
  }

  const stageColors: Record<Candidate['stage'], 'primary' | 'warning' | 'info' | 'success' | 'danger'> = {
    applied: 'info',
    screening: 'warning',
    technical: 'primary',
    offer: 'success',
    hired: 'success',
    rejected: 'danger',
  };

  return (
    <HrLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Link
          to="/hr/candidates"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Candidates
        </Link>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card gradient>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <img
                src={candidate.avatar}
                alt={candidate.name}
                className="w-24 h-24 rounded-full border-4 border-purple-500/50"
              />

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                      {candidate.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-slate-400">
                      <span className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {candidate.email}
                      </span>
                      {candidate.phone && (
                        <span className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {candidate.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge variant={stageColors[candidate.stage]} size="lg" dot>
                    {candidate.stage}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                  {candidate.jobTitle && (
                    <span className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      {candidate.jobTitle}
                    </span>
                  )}
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Applied {new Date(candidate.appliedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Button variant="gradient" icon={<MessageSquare className="w-4 h-4" />}>
                  Schedule Interview
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowNotes(!showNotes)}
                >
                  {showNotes ? 'Hide Notes' : 'Add Notes'}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Notes Editor */}
        {showNotes && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <NotesEditor candidateId={candidate.id} />
          </motion.div>
        )}

        {/* Timeline */}
        <ProfileTimeline timeline={timeline} />
      </div>
    </HrLayout>
  );
};

export default CandidateProfile;
