import React, { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type Candidate } from "../../services/db";
import { Mail, Briefcase } from "lucide-react";

interface KanbanBoardProps {
  candidates: Candidate[];
  onUpdate: (id: string, updates: Partial<Candidate>) => Promise<void>;
}

const stages: Array<{ id: Candidate["stage"]; label: string; color: string }> =
  [
    { id: "applied", label: "Applied", color: "from-cyan-500 to-blue-500" },
    {
      id: "screening",
      label: "Screening",
      color: "from-yellow-500 to-orange-500",
    },
    {
      id: "technical",
      label: "Technical",
      color: "from-purple-500 to-pink-500",
    },
    { id: "offer", label: "Offer", color: "from-green-500 to-emerald-500" },
    { id: "hired", label: "Hired", color: "from-teal-500 to-cyan-500" },
    { id: "rejected", label: "Rejected", color: "from-red-500 to-pink-500" },
  ];

const SortableCard: React.FC<{ candidate: Candidate }> = ({ candidate }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useSortable({
    id: candidate.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: "none",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 cursor-grab active:cursor-grabbing group mb-3"
    >
      <div className="flex items-start gap-3 mb-2">
        <img
          src={candidate.avatar}
          alt={candidate.name}
          className="w-10 h-10 rounded-full"
          draggable="false"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
            {candidate.name}
          </h4>
          <p className="text-xs text-slate-400 flex items-center gap-1 truncate mt-1">
            <Mail className="w-3 h-3" />
            {candidate.email}
          </p>
        </div>
      </div>
      {candidate.jobTitle && (
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Briefcase className="w-3 h-3" />
          {candidate.jobTitle}
        </div>
      )}
    </div>
  );
};

const DroppableColumn: React.FC<{
  stage: (typeof stages)[0];
  candidates: Candidate[];
}> = ({ stage, candidates }) => {
  const { setNodeRef } = useSortable({
    id: stage.id,
    data: { type: "column" },
  });

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col rounded-xl bg-white/5 border border-white/10 overflow-hidden"
    >
      <div className={`p-4 bg-gradient-to-r ${stage.color}`}>
        <h3 className="text-white font-semibold text-sm mb-1">{stage.label}</h3>
        <p className="text-white/80 text-xs">
          {candidates.length} candidate{candidates.length !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="flex-1 p-3 min-h-[400px] max-h-[600px] overflow-y-auto">
        <SortableContext
          items={candidates.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {candidates.map((candidate) => (
            <SortableCard key={candidate.id} candidate={candidate} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  candidates,
  onUpdate,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [allCandidates, setAllCandidates] = useState<Candidate[]>(candidates);

  useEffect(() => {
    setAllCandidates(candidates);
  }, [candidates]);

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

  const candidatesByStage = React.useMemo(() => {
    return stages.reduce((acc, stage) => {
      acc[stage.id] = allCandidates.filter((c) => c.stage === stage.id);
      return acc;
    }, {} as Record<Candidate["stage"], Candidate[]>);
  }, [allCandidates]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    if (activeId === overId) return;

    const activeCandidate = allCandidates.find((c) => c.id === activeId);
    if (!activeCandidate) return;
    const activeStage = activeCandidate.stage;

    const overIsColumn = over.data.current?.type === "column";
    let targetStage: Candidate["stage"];
    if (overIsColumn) {
      targetStage = overId as Candidate["stage"];
    } else {
      const targetCandidate = allCandidates.find((c) => c.id === overId);
      if (!targetCandidate) return;
      targetStage = targetCandidate.stage;
    }

    if (activeStage === targetStage) {
      if (overIsColumn) return;
      setAllCandidates((prev) => {
        const activeIndex = prev.findIndex((item) => item.id === activeId);
        const overIndex = prev.findIndex((item) => item.id === overId);
        if (activeIndex === -1 || overIndex === -1) return prev;
        return arrayMove(prev, activeIndex, overIndex);
      });
    } else {
      setAllCandidates((prev) =>
        prev.map((item) =>
          item.id === activeId ? { ...item, stage: targetStage } : item
        )
      );
      try {
        await onUpdate(activeId, { stage: targetStage });
      } catch (error) {
        console.error("Failed to update candidate:", error);
        setAllCandidates((prev) =>
          prev.map((item) =>
            item.id === activeId ? { ...item, stage: activeStage } : item
          )
        );
      }
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeCandidate = activeId
    ? allCandidates.find((c) => c.id === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stages.map((stage) => (
          <DroppableColumn
            key={stage.id}
            stage={stage}
            candidates={candidatesByStage[stage.id]}
          />
        ))}
      </div>

      <DragOverlay>
        {activeCandidate ? (
          <div className="p-3 rounded-lg bg-purple-800 border-2 border-purple-500 w-64">
            <div className="flex items-start gap-3">
              <img
                src={activeCandidate.avatar}
                alt={activeCandidate.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white truncate">
                  {activeCandidate.name}
                </h4>
                <p className="text-xs text-slate-300 truncate">
                  {activeCandidate.email}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;