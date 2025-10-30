import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, Briefcase, Calendar, ArrowRight } from 'lucide-react';
import type { Candidate } from '../../services/db';
import Badge from '../ui/Badge';

interface CandidateCardProps {
  candidate: Candidate;
  onUpdate?: (id: string, updates: Partial<Candidate>) => Promise<void>;
}

const stageColors: Record<Candidate['stage'], 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'> = {
  applied: 'info',
  screening: 'warning',
  technical: 'primary',
  offer: 'success',
  hired: 'success',
  rejected: 'danger',
};

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="mb-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all group"
    >
      <div className="flex items-center gap-4">
        <img
          src={candidate.avatar}
          alt={candidate.name}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 p-0.5"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <Link
                to={`/hr/candidates/${candidate.id}`}
                className="text-lg font-semibold text-white hover:text-purple-300 transition-colors"
              >
                {candidate.name}
              </Link>
              <p className="text-sm text-slate-400 flex items-center gap-2 mt-1">
                <Mail className="w-3 h-3" />
                {candidate.email}
              </p>
            </div>
            <Badge variant={stageColors[candidate.stage]} dot>
              {candidate.stage}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            {candidate.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {candidate.phone}
              </span>
            )}
            {candidate.jobTitle && (
              <span className="flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                {candidate.jobTitle}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Applied {new Date(candidate.appliedDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        <Link
          to={`/hr/candidates/${candidate.id}`}
          className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-all opacity-0 group-hover:opacity-100"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </motion.div>
  );
};

export default CandidateCard;
