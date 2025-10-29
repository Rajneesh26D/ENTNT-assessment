import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import Input from '../ui/Input';
import Badge from '../ui/Badge';

interface JobFiltersProps {
  onSearch: (value: string) => void;
  onStatusFilter: (status: string) => void;
  currentStatus: string;
}

const statusOptions = [
  { value: '', label: 'All Jobs', color: 'info' as const },
  { value: 'active', label: 'Active', color: 'success' as const },
  { value: 'archived', label: 'Archived', color: 'secondary' as const },
];

const JobFilters: React.FC<JobFiltersProps> = ({
  onSearch,
  onStatusFilter,
  currentStatus,
}) => {
  const [searchValue, setSearchValue] = React.useState('');

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
        placeholder="Search by title or tags..."
        value={searchValue}
        onChange={handleSearchChange}
        icon={<Search className="w-4 h-4" />}
      />

      {/* Status Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Filter className="w-4 h-4" />
          <span>Filter by status:</span>
        </div>
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onStatusFilter(option.value)}
            className="transition-transform hover:scale-105"
          >
            <Badge
              variant={currentStatus === option.value ? option.color : 'secondary'}
              className={`cursor-pointer ${
                currentStatus === option.value
                  ? 'ring-2 ring-purple-500/50'
                  : 'hover:ring-2 hover:ring-white/20'
              }`}
            >
              {option.label}
            </Badge>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default JobFilters;
