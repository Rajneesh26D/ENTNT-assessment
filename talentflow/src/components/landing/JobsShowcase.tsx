import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Clock, DollarSign } from 'lucide-react';

const featuredJobs = [
  {
    title: "Senior Frontend Developer",
    description: "Join our team to build cutting-edge web applications with React and TypeScript",
    location: "Remote",
    type: "Full-time",
    salary: "$120k - $160k",
    gradient: "from-purple-500 to-pink-500",
    tags: ["React", "TypeScript", "Tailwind"]
  },
  {
    title: "Product Manager",
    description: "Lead product development and strategy for our next-generation platform",
    location: "New York, NY",
    type: "Full-time",
    salary: "$140k - $180k",
    gradient: "from-cyan-500 to-blue-500",
    tags: ["Strategy", "Agile", "Leadership"]
  },
  {
    title: "UX Designer",
    description: "Create beautiful and intuitive user experiences that delight our customers",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$100k - $140k",
    gradient: "from-orange-500 to-red-500",
    tags: ["Figma", "Design Systems", "UI/UX"]
  }
];

const JobsShowcase: React.FC = () => {
  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

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
            Featured Job Opportunities
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Explore our latest openings and find your dream role
          </p>
        </motion.div>

        {/* Jobs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredJobs.map((job, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              {/* Gradient Header */}
              <div className={`h-2 bg-gradient-to-r ${job.gradient}`} />

              <div className="p-6">
                {/* Job Title */}
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-slate-300 transition-all">
                  {job.title}
                </h3>

                {/* Description */}
                <p className="text-slate-400 mb-6 leading-relaxed">
                  {job.description}
                </p>

                {/* Meta Info */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <MapPin className="w-4 h-4 text-purple-400" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    {job.type}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    {job.salary}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {job.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 rounded-full bg-white/10 text-xs text-slate-300 border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA Button */}
                <Link
                  to="/hr/jobs"
                  className="group/btn inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  View Details
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link
            to="/hr/jobs"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl font-semibold shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 hover:scale-105"
          >
            View All Jobs
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default JobsShowcase;
