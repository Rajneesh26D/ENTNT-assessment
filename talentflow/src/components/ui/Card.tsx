import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<"div"> {
  title?: string;
  footer?: React.ReactNode;
  hover?: boolean;
  gradient?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  footer,
  className = '',
  children,
  hover = true,
  gradient = false,
  ...props
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : {}}
      transition={{ duration: 0.3 }}
      className={`
        relative rounded-2xl 
        ${gradient 
          ? 'bg-gradient-to-br from-white/10 to-white/5' 
          : 'bg-white/5'
        }
        backdrop-blur-sm border border-white/10 
        ${hover ? 'hover:border-white/20 hover:shadow-xl hover:shadow-purple-500/10' : ''}
        transition-all duration-300 overflow-hidden
        ${className}
      `}
      {...props}
    >
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300" />
      )}
      
      <div className="relative z-10">
        {title && (
          <div className="px-6 py-4 border-b border-white/10">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
          </div>
        )}
        
        <div className="p-6">
          {children as React.ReactNode}
        </div>
        
        {footer && (
          <div className="px-6 py-4 border-t border-white/10 bg-white/5">
            {footer}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Card;
