import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Users,
  ClipboardCheck,
  Calendar,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Plus,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { liveQuery } from 'dexie';
import HrLayout from '../components/layout/HrLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { db } from '../services/db';

interface StatCard {
  title: string;
  total: number;
  subtitle: string;
  subtitleValue: number;
  icon: React.ElementType;
  gradient: string;
  trend: 'up' | 'down';
  trendValue: string;
}

interface ActivityItem {
  id: number;
  title: string;
  description: string;
  time: string;
  type: 'success' | 'warning' | 'info' | 'danger';
  icon: React.ElementType;
}

interface PipelineStage {
  stage: string;
  count: number;
  color: string;
  percentage: number;
}

const HrDashboard: React.FC = () => {
  const [stats, setStats] = useState<StatCard[]>([
    {
      title: 'Total Jobs',
      total: 0,
      subtitle: 'Active',
      subtitleValue: 0,
      icon: Briefcase,
      gradient: 'from-purple-500 to-pink-500',
      trend: 'up',
      trendValue: '+12%',
    },
    {
      title: 'Total Candidates',
      total: 0,
      subtitle: 'Hired',
      subtitleValue: 0,
      icon: Users,
      gradient: 'from-cyan-500 to-blue-500',
      trend: 'up',
      trendValue: '+23%',
    },
    {
      title: 'Assessments',
      total: 0,
      subtitle: 'Completed',
      subtitleValue: 0,
      icon: ClipboardCheck,
      gradient: 'from-orange-500 to-red-500',
      trend: 'down',
      trendValue: '-5%',
    },
    {
      title: 'Interviews',
      total: 100,
      subtitle: 'Scheduled',
      subtitleValue: 45,
      icon: Calendar,
      gradient: 'from-green-500 to-emerald-500',
      trend: 'up',
      trendValue: '+8%',
    },
  ]);

  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>([
    { stage: 'Applied', count: 0, color: 'bg-purple-500', percentage: 0 },
    { stage: 'Screening', count: 0, color: 'bg-cyan-500', percentage: 0 },
    { stage: 'Technical', count: 0, color: 'bg-orange-500', percentage: 0 },
    { stage: 'Offer', count: 0, color: 'bg-green-500', percentage: 0 },
    { stage: 'Hired', count: 0, color: 'bg-pink-500', percentage: 0 },
    { stage: 'Rejected', count: 0, color: 'bg-red-500', percentage: 0 },
  ]);

  const [recentActivityItems] = useState<ActivityItem[]>([
    {
      id: 1,
      title: '30 new candidates applied',
      description: 'This week',
      time: '2 hours ago',
      type: 'success',
      icon: Users,
    },
    {
      id: 2,
      title: '15 assessments completed',
      description: 'This week',
      time: '5 hours ago',
      type: 'info',
      icon: ClipboardCheck,
    },
    {
      id: 3,
      title: '12 active job postings',
      description: 'Current',
      time: '1 day ago',
      type: 'warning',
      icon: Briefcase,
    },
    {
      id: 4,
      title: '8 candidates moved to final round',
      description: 'This week',
      time: '1 day ago',
      type: 'success',
      icon: CheckCircle,
    },
    {
      id: 5,
      title: '5 interviews scheduled',
      description: 'Tomorrow',
      time: '2 days ago',
      type: 'info',
      icon: Calendar,
    },
    {
      id: 6,
      title: '3 positions closed',
      description: 'This month',
      time: '3 days ago',
      type: 'danger',
      icon: XCircle,
    },
  ]);

  useEffect(() => {
    const subscription = liveQuery(
      async () => {
        const jobsCount = await db.jobs.count();
        const activeJobsCount = await db.jobs.where('status').equals('active').count();
        const candidatesCount = await db.candidates.count();
        const hiredCount = await db.candidates.where('stage').equals('hired').count();
        const assessmentsCount = await db.assessments.count();
        const assessmentResponsesCount = await db.assessmentResponses.count();

        return {
          jobs: jobsCount,
          activeJobs: activeJobsCount,
          candidates: candidatesCount,
          hired: hiredCount,
          assessments: assessmentsCount,
          completedAssessments: assessmentResponsesCount,
        };
      }
    ).subscribe(
      (result) => {
        if (result) {
          setStats(prevStats => [
            {
              ...prevStats[0],
              total: result.jobs,
              subtitleValue: result.activeJobs,
            },
            {
              ...prevStats[1],
              total: result.candidates,
              subtitleValue: result.hired,
            },
            {
              ...prevStats[2],
              total: result.assessments,
              subtitleValue: result.completedAssessments,
            },
            prevStats[3],
          ]);
        }
      },
      (error) => {
        console.error('Error fetching dashboard stats:', error);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const subscription = liveQuery(
      async () => {
        const allCandidates = await db.candidates.toArray();
        
        const stageCounts: Record<string, number> = {
          applied: 0,
          screening: 0,
          technical: 0,
          offer: 0,
          hired: 0,
          rejected: 0,
        };

        allCandidates.forEach(candidate => {
          if (Object.prototype.hasOwnProperty.call(stageCounts, candidate.stage)) {
            stageCounts[candidate.stage]++;
          }
        });

        return {
          total: allCandidates.length,
          stageCounts,
        };
      }
    ).subscribe(
      (result) => {
        if (result && result.total > 0) {
          const maxCount = Math.max(
            result.stageCounts.applied,
            result.stageCounts.screening,
            result.stageCounts.technical,
            result.stageCounts.offer,
            result.stageCounts.hired
          );

          const stages: PipelineStage[] = [
            {
              stage: 'Applied',
              count: result.stageCounts.applied,
              color: 'bg-purple-500',
              percentage: maxCount > 0 ? Math.round((result.stageCounts.applied / maxCount) * 100) : 0,
            },
            {
              stage: 'Screening',
              count: result.stageCounts.screening,
              color: 'bg-cyan-500',
              percentage: maxCount > 0 
                ? Math.round((result.stageCounts.screening / maxCount) * 100)
                : 0,
            },
            {
              stage: 'Technical',
              count: result.stageCounts.technical,
              color: 'bg-orange-500',
              percentage: maxCount > 0 
                ? Math.round((result.stageCounts.technical / maxCount) * 100)
                : 0,
            },
            {
              stage: 'Offer',
              count: result.stageCounts.offer,
              color: 'bg-green-500',
              percentage: maxCount > 0 
                ? Math.round((result.stageCounts.offer / maxCount) * 100)
                : 0,
            },
            {
              stage: 'Hired',
              count: result.stageCounts.hired,
              color: 'bg-pink-500',
              percentage: maxCount > 0 
                ? Math.round((result.stageCounts.hired / maxCount) * 100)
                : 0,
            },
            {
              stage: 'Rejected',
              count: result.stageCounts.rejected,
              color: 'bg-red-500',
              percentage: maxCount > 0 
                ? Math.round((result.stageCounts.rejected / maxCount) * 100)
                : 0,
            },
          ];

          setPipelineStages(stages);
        }
      },
      (error) => {
        console.error('Error fetching pipeline data:', error);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const quickActions = [
    {
      title: 'Create New Job',
      description: 'Post a new job opening',
      icon: Plus,
      link: '/hr/jobs',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'View Candidates',
      description: 'Browse candidate pipeline',
      icon: Users,
      link: '/hr/candidates',
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      title: 'Manage Assessments',
      description: 'Create and edit assessments',
      icon: ClipboardCheck,
      link: '/hr/assessments',
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const conversionRate = pipelineStages[0].count > 0 
    ? ((pipelineStages[4].count / pipelineStages[0].count) * 100).toFixed(1)
    : '0';

  return (
    <HrLayout title="Dashboard">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="relative overflow-hidden" hover={false}>
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 blur-3xl`}
                />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-start justify-between">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient}`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        stat.trend === 'up'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {stat.trend === 'up' ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {stat.trendValue}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm text-slate-400 mb-1">{stat.title}</h3>
                    <p className="text-3xl font-bold text-white">{stat.total}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm">
                      <span className="text-slate-500">{stat.subtitle}:</span>
                      <span className="font-semibold text-slate-300">
                        {stat.subtitleValue}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6 text-purple-400" />
            Quick Actions
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Link to={action.link}>
                  <Card className="group cursor-pointer" hover={false}>
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-4 rounded-xl bg-gradient-to-br ${action.gradient} group-hover:scale-110 transition-transform duration-300`}
                      >
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-purple-300 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-slate-400">
                          {action.description}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <Card title="Recent Activity" className="h-full">
              <div className="space-y-4">
                {recentActivityItems.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        activity.type === 'success'
                          ? 'bg-green-500/20 text-green-400'
                          : activity.type === 'warning'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : activity.type === 'danger'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-cyan-500/20 text-cyan-400'
                      }`}
                    >
                      <activity.icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {activity.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <Link
                  to="/hr/activity"
                  className="flex items-center justify-center gap-2 text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  View All Activities
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card title="Hiring Pipeline Overview" className="h-full">
              <div className="space-y-6">
                {pipelineStages
                  .filter(stage => stage.stage !== 'Rejected')
                  .map((stage, index) => {
                    const displayPercentage = stage.percentage > 0 
                      ? Math.min(90, Math.max(10, stage.percentage)) 
                      : 0;
                    
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-300 font-medium">
                            {stage.stage}
                          </span>
                          <span className="text-slate-400">
                            {stage.count} candidates
                          </span>
                        </div>
                        <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${displayPercentage}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className={`absolute inset-y-0 left-0 ${stage.color} rounded-full`}
                          />
                        </div>
                      </div>
                    );
                  })}

                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="text-sm font-medium text-slate-300 mb-4">Stage Distribution</h4>
                  <div className="relative h-48 flex items-center justify-center">
                    <div className="relative w-40 h-40">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 40 40">
                        {(() => {
                          const totalCandidates = pipelineStages.reduce((sum, stage) => sum + stage.count, 0);
                          let cumulativePercentage = 0;
                          
                          return pipelineStages
                            .filter(stage => stage.count > 0)
                            .map((stage, index) => {
                              const percentage = totalCandidates > 0 
                                ? (stage.count / totalCandidates) * 100 
                                : 0;
                              const startAngle = (cumulativePercentage / 100) * 360;
                              const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
                              const largeArc = percentage > 50 ? 1 : 0;
                              const x1 = 20 + 16 * Math.cos((startAngle * Math.PI) / 180);
                              const y1 = 20 + 16 * Math.sin((startAngle * Math.PI) / 180);
                              const x2 = 20 + 16 * Math.cos((endAngle * Math.PI) / 180);
                              const y2 = 20 + 16 * Math.sin((endAngle * Math.PI) / 180);
                              
                              const pathData = percentage === 100
                                ? `M 20 20 L 20 4 A 16 16 0 1 1 19.99 4 Z`
                                : `M 20 20 L ${x1} ${y1} A 16 16 0 ${largeArc} 1 ${x2} ${y2} Z`;
                              
                              cumulativePercentage += percentage;
                                         
                              const colorMap: Record<string, string> = {
                                'Applied': '#a855f7',
                                'Screening': '#06b6d4',
                                'Technical': '#f97316',
                                'Offer': '#10b981',
                                'Hired': '#ec4899',
                                'Rejected': '#ef4444',
                              };
                              
                              return (
                                <path
                                  key={index}
                                  d={pathData}
                                  fill={colorMap[stage.stage] || '#64748b'}
                                  className="hover:opacity-80 transition-opacity"
                                />
                              );
                            });
                        })()}
                        
                        <circle cx="20" cy="20" r="10" className="fill-slate-900" />
                      </svg>
                      
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-white">
                            {pipelineStages.reduce((sum, stage) => sum + stage.count, 0)}
                          </p>
                          <p className="text-xs text-slate-400">Total</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-8 space-y-2">
                      {pipelineStages
                        .filter(stage => stage.count > 0)
                        .map((stage, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                            <span className="text-xs text-slate-400">
                              {stage.stage}: {stage.count}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <p className="text-2xl font-bold text-green-400">{conversionRate}%</p>
                    <p className="text-xs text-slate-400 mt-1">Conversion Rate</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                    <p className="text-2xl font-bold text-cyan-400">28 days</p>
                    <p className="text-xs text-slate-400 mt-1">Avg. Time to Hire</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div variants={itemVariants}>
          <Card title="Upcoming Interviews This Week">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  candidate: 'Sarah Johnson',
                  position: 'Senior Frontend Developer',
                  time: 'Today, 2:00 PM',
                  interviewer: 'John Doe',
                  type: 'Technical',
                },
                {
                  candidate: 'Michael Chen',
                  position: 'Product Manager',
                  time: 'Tomorrow, 10:00 AM',
                  interviewer: 'Jane Smith',
                  type: 'Behavioral',
                },
                {
                  candidate: 'Emily Davis',
                  position: 'UX Designer',
                  time: 'Tomorrow, 3:00 PM',
                  interviewer: 'Alex Brown',
                  type: 'Portfolio Review',
                },
                {
                  candidate: 'David Wilson',
                  position: 'Backend Engineer',
                  time: 'Wed, 11:00 AM',
                  interviewer: 'Lisa White',
                  type: 'System Design',
                },
              ].map((interview, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="info" size="sm">
                      {interview.type}
                    </Badge>
                    <Calendar className="w-4 h-4 text-slate-400" />
                  </div>
                  <h4 className="text-white font-semibold mb-1">
                    {interview.candidate}
                  </h4>
                  <p className="text-xs text-slate-400 mb-2">
                    {interview.position}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    {interview.time}
                  </div>
                  <p className="text-xs text-purple-400 mt-2">
                    with {interview.interviewer}
                  </p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </HrLayout>
  );
};

export default HrDashboard;