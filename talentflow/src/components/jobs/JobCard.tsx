import React, { useState } from "react";
// --- FIX: Removed motion ---
import {
  Eye,
  Edit,
  Archive,
  MapPin,
  Clock,
  Calendar,
  GripVertical, // <-- ADDED: For the handle
  ArchiveRestore, // <-- ADDED: For unarchive
} from "lucide-react";
import type { Job } from "../../services/db";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
// --- ADDED: Type for the dnd-kit listeners ---
import type { DraggableSyntheticListeners } from "@dnd-kit/core";

interface JobCardProps {
  job: Job;
  onUpdate: (id: string, updates: Partial<Job>) => Promise<void>;
  onEdit?: () => void;
  dragHandleListeners?: DraggableSyntheticListeners; // <-- ADDED: The handle prop
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  onUpdate,
  onEdit,
  dragHandleListeners, // <-- ADDED
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleArchiveToggle = async () => {
    await onUpdate(job.id, {
      status: job.status === "active" ? "archived" : "active",
    });
    setShowDetails(false);
  };

  return (
    <>
      {/* --- FIX: Replaced motion.div with a normal div --- */}
      {/* Added `flex gap-2` to the container */}
      <div className="relative flex gap-2 p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
        {/* --- ADDED: The Drag Handle --- */}
        <div
          {...dragHandleListeners} // <-- Listeners applied ONLY here
          className="flex-shrink-0 cursor-grab active:cursor-grabbing p-2 -ml-2 -my-2 text-slate-500 hover:text-white transition-colors"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-5 h-5" />
        </div>

        {/* Card Content (wrapped in a div to separate from handle) */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                {job.title}
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                {job.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </span>
                )}
                {job.type && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {job.type}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Created {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <Badge
              variant={job.status === "active" ? "success" : "secondary"}
              dot
            >
              {job.status}
            </Badge>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {job.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs border border-purple-500/30"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Actions - These will work now! */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              icon={<Eye className="w-4 h-4" />}
              onClick={() => setShowDetails(true)}
            >
              View
            </Button>
            <Button
              size="sm"
              variant="ghost"
              icon={<Edit className="w-4 h-4" />}
              onClick={onEdit}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant={job.status === "active" ? "danger" : "primary"}
              // --- FIX: Show correct icon for unarchive ---
              icon={
                job.status === "active" ? (
                  <Archive className="w-4 h-4" />
                ) : (
                  <ArchiveRestore className="w-4 h-4" />
                )
              }
              onClick={handleArchiveToggle}
            >
              {job.status === "active" ? "Archive" : "Unarchive"}
            </Button>
          </div>
        </div>
      </div>

      {/* Job Details Modal (Unchanged, but buttons inside will work) */}
      <Modal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title={job.title}
        size="lg"
      >
        <div className="space-y-6">
          {/* Status & Meta */}
          <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-white/10">
            <Badge
              variant={job.status === "active" ? "success" : "secondary"}
              size="lg"
              dot
            >
              {job.status}
            </Badge>
            {job.location && (
              <span className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-purple-400" />
                {job.location}
              </span>
            )}
            {job.type && (
              <span className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-cyan-400" />
                {job.type}
              </span>
            )}
            <span className="flex items-center gap-2 text-slate-400 text-sm">
              <Calendar className="w-4 h-4" />
              Created {new Date(job.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Tags */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-3">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 text-sm border border-purple-500/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          {job.description && (
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-3">
                Description
              </h4>
              <p className="text-slate-400 leading-relaxed">
                {job.description}
              </p>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-3">
                Requirements
              </h4>
              <ul className="space-y-2">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button variant="secondary" onClick={() => setShowDetails(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              icon={<Edit className="w-4 h-4" />}
              onClick={onEdit}
            >
              Edit
            </Button>
            <Button
              variant={job.status === "active" ? "danger" : "primary"}
              // --- FIX: Show correct icon for unarchive ---
              icon={
                job.status === "active" ? (
                  <Archive className="w-4 h-4" />
                ) : (
                  <ArchiveRestore className="w-4 h-4" />
                )
              }
              onClick={handleArchiveToggle}
            >
              {job.status === "active" ? "Archive" : "Unarchive"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default JobCard;