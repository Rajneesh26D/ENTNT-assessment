import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Loader2,
} from 'lucide-react';
import HrLayout from '../components/layout/HrLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { db } from '../services/db';
import type { Candidate } from '../services/db';

const CandidateProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidate = async () => {
      if (!id) return;

      try {
        const candidateData = await db.candidates.get(id);
        if (candidateData) {
          setCandidate(candidateData);
        }
      } catch (error) {
        console.error('Error fetching candidate:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  if (loading) {
    return (
      <HrLayout title="Candidate Profile">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
      </HrLayout>
    );
  }

  if (!candidate) {
    return (
      <HrLayout title="Candidate Profile">
        <div className="text-center py-20">
          <p className="text-slate-400 text-lg">Candidate not found</p>
          <Link to="/hr/candidates" className="text-purple-400 hover:text-purple-300 mt-4 inline-block">
            ← Back to Candidates
          </Link>
        </div>
      </HrLayout>
    );
  }

  const stageColors: Record<Candidate['stage'], 'info' | 'warning' | 'primary' | 'success' | 'danger'> = {
    applied: 'info',
    screening: 'warning',
    technical: 'primary',
    offer: 'success',
    hired: 'success',
    rejected: 'danger',
  };

  return (
    <HrLayout title={candidate.name}>
      <div className="space-y-6">
        <Link
          to="/hr/candidates"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Candidates
        </Link>

        <Card>
          <div className="flex items-start gap-6">
            <img
              src={candidate.avatar}
              alt={candidate.name}
              className="w-24 h-24 rounded-full"
            />

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-2">
                {candidate.name}
              </h1>

              <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {candidate.email}
                </div>
                {candidate.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {candidate.phone}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <Badge variant={stageColors[candidate.stage]}>
                  {candidate.stage.charAt(0).toUpperCase() + candidate.stage.slice(1)}
                </Badge>
                {candidate.jobTitle && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <Briefcase className="w-4 h-4" />
                    {candidate.jobTitle}
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="w-4 h-4" />
                  Applied {new Date(candidate.appliedDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="primary" icon={<Calendar className="w-4 h-4" />}>
                Schedule Interview
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-white mb-4">Candidate Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-400 mb-1">Email</p>
              <p className="text-white">{candidate.email}</p>
            </div>
            {candidate.phone && (
              <div>
                <p className="text-sm text-slate-400 mb-1">Phone</p>
                <p className="text-white">{candidate.phone}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-slate-400 mb-1">Current Stage</p>
              <Badge variant={stageColors[candidate.stage]}>
                {candidate.stage.charAt(0).toUpperCase() + candidate.stage.slice(1)}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Applied Date</p>
              <p className="text-white">{new Date(candidate.appliedDate).toLocaleDateString()}</p>
            </div>
            {candidate.jobTitle && (
              <div>
                <p className="text-sm text-slate-400 mb-1">Applied For</p>
                <p className="text-white">{candidate.jobTitle}</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </HrLayout>
  );
};

export default CandidateProfile;
