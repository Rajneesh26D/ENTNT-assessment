import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Eye, Save, Loader2, Plus } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { DragEndEvent } from '@dnd-kit/core';
import HrLayout from '../components/layout/HrLayout';
import SectionBuilder from '../components/assessments/SectionBuilder';
import AssessmentPreview from '../components/assessments/AssessmentPreview';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { db } from '../services/db';
import type { Assessment, Section, Job } from '../services/db';

const AssessmentBuilder: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const loadData = async () => {
      if (!jobId) return;

      setLoading(true);
      const jobData = await db.jobs.get(jobId);
      const assessmentData = await db.assessments.get(jobId);

      setJob(jobData ?? null);
      if (assessmentData) {
        setAssessment(assessmentData);
        setSections(assessmentData.sections || []);
        setTitle(jobData?.title + ' Assessment' || '');
        // Assessment does not have a description property, so use jobData or keep previous state
        setDescription(description || `Assessment for ${jobData?.title} position`);
      } else {
        setTitle(jobData?.title + ' Assessment' || '');
        setDescription(`Assessment for ${jobData?.title} position`);
      }
      setLoading(false);
    };
    loadData();
  }, [jobId, description]);

  const handleSave = async () => {
    if (!jobId) return;

    setSaving(true);
    const assessmentData: Assessment = {
      jobId,
      jobTitle: job?.title,
      sections,
      createdAt: assessment?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.assessments.put(assessmentData);
    setSaving(false);
    alert('Assessment saved successfully!');
  };

  const addSection = () => {
    const newSection: Section = {
      id: `sec-${Date.now()}`,
      title: 'New Section',
      description: '',
      questions: [],
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (index: number, updatedSection: Section) => {
    const newSections = [...sections];
    newSections[index] = updatedSection;
    setSections(newSections);
  };

  const deleteSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  if (loading) {
    return (
      <HrLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
      </HrLayout>
    );
  }

  return (
    <HrLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/hr/assessments"
              className="flex items-center gap-2 text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Assessments
            </Link>
          </div>
          <Button
            variant="secondary"
            icon={<Eye className="w-4 h-4" />}
            onClick={() => setShowPreview(true)}
          >
            Show Preview
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Assessment Builder: {job?.title}
          </h1>
          <p className="text-slate-400">
            Create and customize assessment questions for this position
          </p>
        </div>

        {/* Assessment Details */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-4">Assessment Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Senior Frontend Developer Assessment"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Assessment for DevOps Engineer position"
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Drag and Drop Sections */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sections.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {sections.map((section, index) => (
                <SectionBuilder
                  key={section.id}
                  section={section}
                  onUpdate={(updated) => updateSection(index, updated)}
                  onDelete={() => deleteSection(index)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <button
          onClick={addSection}
          className="w-full p-4 border-2 border-dashed border-white/20 rounded-xl text-slate-400 hover:text-white hover:border-white/40 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Section
        </button>

        {/* Sticky Save Button at Bottom */}
        <div className="sticky bottom-4 bg-slate-950/95 backdrop-blur-sm p-4 rounded-xl border border-white/10 shadow-xl">
          <Button
            variant="primary"
            icon={<Save className="w-4 h-4" />}
            onClick={handleSave}
            isLoading={saving}
            className="w-full sm:w-auto"
          >
            Save
          </Button>
        </div>
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Assessment Preview"
        size="xl"
      >
        {sections.length > 0 ? (
          <AssessmentPreview
            assessment={{
              jobId: jobId || '',
              jobTitle: job?.title,
              sections,
              createdAt: '',
              updatedAt: '',
            }}
          />
        ) : (
          <p className="text-slate-400 text-center py-8">
            No sections added yet. Add sections and questions to see the preview.
          </p>
        )}
      </Modal>
    </HrLayout>
  );
};

export default AssessmentBuilder;
