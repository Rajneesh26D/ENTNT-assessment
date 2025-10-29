import React from 'react';
import { motion } from 'framer-motion';
import { Clock, User } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import type { TimelineEvent } from '../../services/db';

interface ProfileTimelineProps {
  timeline: TimelineEvent[];
}

const stageColors: Record<string, 'primary' | 'warning' | 'info' | 'success' | 'danger'> = {
  applied: 'info',
  screening: 'warning',
  technical: 'primary',
  offer: 'success',
  hired: 'success',
  rejected: 'danger',
};

const ProfileTimeline: React.FC<ProfileTimelineProps> = ({ timeline }) => {
  return (
    <Card title="Application Timeline">
      <div className="space-y-6">
        {timeline.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-8 pb-6 border-l-2 border-white/10 last:border-0 last:pb-0"
          >
            {/* Timeline Dot */}
            <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-purple-500 border-4 border-slate-950" />

            {/* Content */}
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant={stageColors[event.stage] || 'info'} size="sm">
                    {event.stage}
                  </Badge>
                  <p className="text-white font-medium mt-2">{event.notes}</p>
                </div>
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  {new Date(event.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-slate-400 flex items-center gap-2">
                <User className="w-3 h-3" />
                {event.changedBy}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default ProfileTimeline;
