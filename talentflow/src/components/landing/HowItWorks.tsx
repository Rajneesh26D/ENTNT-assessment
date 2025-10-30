import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Users, ClipboardCheck, CheckCircle } from 'lucide-react';

const steps = [
  {
    number: 1,
    icon: PlusCircle,
    title: "Create Jobs",
    description: "Set up job postings with detailed descriptions, tags, and requirements",
    color: "from-purple-500 to-pink-500"
  },
  {
    number: 2,
    icon: Users,
    title: "Manage Candidates",
    description: "Track applicants through the hiring pipeline with drag-and-drop kanban boards",
    color: "from-cyan-500 to-blue-500"
  },
  {
    number: 3,
    icon: ClipboardCheck,
    title: "Assess Skills",
    description: "Use custom assessments with conditional logic to evaluate candidates",
    color: "from-orange-500 to-red-500"
  },
  {
    number: 4,
    icon: CheckCircle,
    title: "Make Decisions",
    description: "Compare candidates with analytics and make data-driven hiring decisions",
    color: "from-green-500 to-emerald-500"
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-950 to-slate-900 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            How TalentFlow Works
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Four simple steps to transform your hiring process
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-green-500/20" />

          <div className="grid lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative flex flex-col items-center text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`relative z-10 w-20 h-20 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-2xl`}
                >
                  <step.icon className="w-10 h-10 text-white" />
                </motion.div>

                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
                  <div className="text-sm font-bold text-purple-400 mb-2">
                    STEP {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
