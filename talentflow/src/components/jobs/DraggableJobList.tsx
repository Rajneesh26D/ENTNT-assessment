import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Job } from '../../services/db';
import JobCard from './JobCard';

const SortableJobCard: React.FC<{
  job: Job;
  onEdit: (job: Job) => void;
  onUpdate: (id: string, updates: Partial<Job>) => Promise<void>;
}> = ({ job, onEdit, onUpdate }) => {
  const {
    attributes,
    listeners, 
    setNodeRef,
    transform,
    isDragging,
  } = useSortable({
    id: job.id,
    animateLayoutChanges: () => false, 
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: 'none', 
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}    >
      <JobCard
        job={job}
        onUpdate={onUpdate}
        onEdit={() => onEdit(job)}
        dragHandleListeners={listeners} 
      />
    </div>
  );
};

interface DraggableJobListProps {
  jobs: Job[];
  onEdit: (job: Job) => void;
  onUpdate: (id: string, updates: Partial<Job>) => Promise<void>;
  onReorder: (activeId: string, overId: string) => Promise<void>;
}

const DraggableJobList: React.FC<DraggableJobListProps> = ({
  jobs,
  onEdit,
  onUpdate,
  onReorder,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0,
        delay: 0,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      onReorder(active.id as string, over.id as string);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={jobs.map((j) => j.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="grid gap-6">
          {jobs.map((job) => (
            <SortableJobCard
              key={job.id}
              job={job}
              onEdit={onEdit}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default DraggableJobList;