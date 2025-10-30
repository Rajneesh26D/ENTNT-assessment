import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Building  } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Jobs', path: '/hr/jobs' },
    { name: 'Candidates', path: '/hr/candidates' },
    { name: 'Assessments', path: '/hr/assessments' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 ${
        isScrolled
          ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500">
              <Building  className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              TalentFlow
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 relative">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {link.name}

                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navbar-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                    initial={false}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Link
              to="/hr/dashboard"
              className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-semibold transition-colors hover:bg-purple-700"
            >
              Dashboard
            </Link>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="md:hidden mt-4 pt-4 border-t border-white/10 overflow-hidden"
            >
              <div className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                      location.pathname === link.path
                        ? 'bg-white/10 text-white'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  to="/hr/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold text-center transition-colors hover:bg-purple-700"
                >
                  Dashboard
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;