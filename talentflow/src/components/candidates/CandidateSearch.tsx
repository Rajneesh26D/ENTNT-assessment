import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import Input from '../ui/Input';
import Badge from '../ui/Badge';

interface CandidateSearchProps {
  onSearch: (value: string) => void;
  onStageFilter: (stage: string) => void;
  currentStage: string;
}

const stages: Array<{ value: string; label: string; color: 'primary' | 'warning' | 'info' | 'success' | 'danger' }> = [
  { value: '', label: 'All Stages', color: 'info' },
  { value: 'applied', label: 'Applied', color: 'info' },
  { value: 'screening', label: 'Screening', color: 'warning' },
  { value: 'technical', label: 'Technical', color: 'primary' },
  { value: 'offer', label: 'Offer', color: 'success' },
  { value: 'hired', label: 'Hired', color: 'success' },
  { value: 'rejected', label: 'Rejected', color: 'danger' },
];

const CandidateSearch: React.FC<CandidateSearchProps> = ({
  onSearch,
  onStageFilter,
  currentStage,
}) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Search Bar */}
      <Input
        type="text"
        placeholder="Search by name or email..."
        value={searchValue}
        onChange={handleSearchChange}
        icon={<Search className="w-4 h-4" />}
      />

      {/* Stage Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Filter className="w-4 h-4" />
          <span>Filter by stage:</span>
        </div>
        {stages.map((stage) => (
          <button
            key={stage.value}
            onClick={() => onStageFilter(stage.value)}
            className="transition-transform hover:scale-105"
          >
            <Badge
              variant={currentStage === stage.value ? stage.color : 'secondary'}
              className={`cursor-pointer ${
                currentStage === stage.value
                  ? 'ring-2 ring-purple-500/50'
                  : 'hover:ring-2 hover:ring-white/20'
              }`}
            >
              {stage.label}
            </Badge>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default CandidateSearch;
