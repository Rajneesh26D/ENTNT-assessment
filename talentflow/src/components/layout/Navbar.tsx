import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Building, User, Mail, Phone, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

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

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/hr/dashboard"
              className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-semibold transition-colors hover:bg-purple-700"
            >
              Dashboard
            </Link>
            
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`p-2.5 rounded-lg font-semibold transition-colors ${
                  isProfileOpen 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <User className="w-5 h-5" />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-72 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-lg">Sarah Johnson</h3>
                          <p className="text-slate-400 text-sm">HR Manager</p>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4 pb-4 border-b border-white/10">
                        <div className="flex items-center gap-3 text-slate-300">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span className="text-sm">sarah.johnson@talentflow.com</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <span className="text-sm">+1 (555) 123-4567</span>
                        </div>
                      </div>

                      <button
                        disabled
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800/50 text-slate-500 rounded-lg font-medium cursor-not-allowed opacity-60"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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