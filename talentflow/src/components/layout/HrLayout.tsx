import React from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';

interface HrLayoutProps {
  children: ReactNode;
  title?: string;
}

const HrLayout: React.FC<HrLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-purple-950/50 to-slate-950 border-b border-white/10 py-12"
          >
            <div className="max-w-7xl mx-auto px-6">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                {title}
              </h1>
            </div>
          </motion.div>
        )}
        
        <div className="max-w-7xl mx-auto px-6 py-12">
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HrLayout;
