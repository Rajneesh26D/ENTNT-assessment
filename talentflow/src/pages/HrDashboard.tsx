import React, { useState } from 'react';
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
import HrLayout from '../components/layout/HrLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

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

const HrDashboard: React.FC = () => {
  const [stats] = useState<StatCard[]>([
    {
      title: 'Total Jobs',
      total: 25,
      subtitle: 'Active',
      subtitleValue: 18,
      icon: Briefcase,
      gradient: 'from-purple-500 to-pink-500',
      trend: 'up',
      trendValue: '+12%',
    },
    {
      title: 'Total Candidates',
      total: 1247,
      subtitle: 'Hired',
      subtitleValue: 89,
      icon: Users,
      gradient: 'from-cyan-500 to-blue-500',
      trend: 'up',
      trendValue: '+23%',
    },
    {
      title: 'Assessments',
      total: 42,
      subtitle: 'Completed',
      subtitleValue: 156,
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

  return (
    <HrLayout title="Dashboard">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Stats Grid */}
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
                {/* Gradient Background */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 blur-3xl`}
                />

                <div className="relative z-10 space-y-4">
                  {/* Icon and Trend */}
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

                  {/* Stats */}
                  <div>
                    <p className="text-sm text-slate-400 mb-1">{stat.title}</p>
                    <p className="text-4xl font-bold text-white mb-2">
                      {stat.total.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
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

        {/* Quick Actions */}
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

        {/* Recent Activities and Performance Chart */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
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
                    {/* Icon */}
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

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {activity.description}
                      </p>
                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* View All Link */}
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

          {/* Performance Overview */}
          <motion.div variants={itemVariants}>
            <Card title="Hiring Pipeline Overview" className="h-full">
              <div className="space-y-6">
                {/* Pipeline Stages */}
                {[
                  { stage: 'Applied', count: 450, color: 'bg-purple-500', percentage: 100 },
                  { stage: 'Screening', count: 280, color: 'bg-cyan-500', percentage: 62 },
                  { stage: 'Technical', count: 120, color: 'bg-orange-500', percentage: 27 },
                  { stage: 'Final Round', count: 45, color: 'bg-green-500', percentage: 10 },
                  { stage: 'Hired', count: 18, color: 'bg-pink-500', percentage: 4 },
                ].map((stage, index) => (
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
                        animate={{ width: `${stage.percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className={`absolute inset-y-0 left-0 ${stage.color} rounded-full`}
                      />
                    </div>
                  </div>
                ))}

                {/* Summary */}
                <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <p className="text-2xl font-bold text-green-400">4%</p>
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

        {/* Upcoming Interviews */}
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
