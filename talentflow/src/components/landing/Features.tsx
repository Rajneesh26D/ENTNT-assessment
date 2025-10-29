import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Users, ClipboardList, BarChart3, Zap, Shield } from 'lucide-react';

const features = [
  {
    icon: Briefcase,
    title: "Job Management",
    description: "Create, edit, and organize job postings with drag-and-drop simplicity",
    color: "from-purple-500 to-pink-500",
    delay: 0.1
  },
  {
    icon: Users,
    title: "Candidate Tracking",
    description: "Track candidates through every stage with visual kanban boards",
    color: "from-cyan-500 to-blue-500",
    delay: 0.2
  },
  {
    icon: ClipboardList,
    title: "Assessment Tools",
    description: "Create custom assessments with conditional logic and validation",
    color: "from-orange-500 to-red-500",
    delay: 0.3
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Get insights into your hiring pipeline with live dashboards",
    color: "from-green-500 to-emerald-500",
    delay: 0.4
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized performance with virtualized lists for 1000+ candidates",
    color: "from-yellow-500 to-orange-500",
    delay: 0.5
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data stays local with IndexedDB encryption",
    color: "from-indigo-500 to-purple-500",
    delay: 0.6
  }
];

const Features: React.FC = () => {
  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Everything you need to manage your hiring process efficiently
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: feature.delay }}
              whileHover={{ y: -8 }}
              className="group relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-slate-300 transition-all">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
