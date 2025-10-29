import React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import CandidateCard from '../components/candidates/CandidateCard'; 
import type { Candidate } from '../services/db';
// This type matches the 'updateCandidate' function from your hook
type OnUpdateFunc = (id: string, updates: Partial<Candidate>) => Promise<void>;

interface VirtualizedListProps {
  candidates: Candidate[];
  onUpdate: OnUpdateFunc;
}

export const VirtualizedCandidateList: React.FC<VirtualizedListProps> = ({
  candidates,
  onUpdate,
}) => {
  const parentRef = React.useRef<HTMLDivElement>(null);

  // The virtualizer hook now lives inside this component
  const rowVirtualizer = useVirtualizer({
    count: candidates.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120, // Set to your CandidateCard's approx. height
    overscan: 10,
  });

  return (
    <div
      ref={parentRef}
      className="h-[600px] overflow-auto rounded-xl bg-white/5 border border-white/10 p-4"
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const candidate = candidates[virtualRow.index];
          
          // Safety check
          if (!candidate) {
            return null;
          }

          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <CandidateCard candidate={candidate} onUpdate={onUpdate} />
            </div>
          );
        })}
      </div>
    </div>
  );
};