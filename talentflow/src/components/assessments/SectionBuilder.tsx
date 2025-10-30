import React from 'react';
import { Trash2, GripVertical, Plus } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
import type { Section, Question } from '../../services/db';
import QuestionBuilder from './QuestionBuilder';
import Input from '../ui/Input';

interface SectionBuilderProps {
  section: Section;
  onUpdate: (section: Section) => void;
  onDelete: () => void;
}

const SectionBuilder: React.FC<SectionBuilderProps> = ({
  section,
  onUpdate,
  onDelete,
}) => {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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

  const updateTitle = (title: string) => {
    onUpdate({ ...section, title });
  };

  const updateDescription = (description: string) => {
    onUpdate({ ...section, description });
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      type: 'short-text',
      question: 'New Question',
      required: false,
    };
    onUpdate({
      ...section,
      questions: [...section.questions, newQuestion],
    });
  };

  const updateQuestion = (index: number, question: Question) => {
    const newQuestions = [...section.questions];
    newQuestions[index] = question;
    onUpdate({ ...section, questions: newQuestions });
  };

  const deleteQuestion = (index: number) => {
    onUpdate({
      ...section,
      questions: section.questions.filter((_, i) => i !== index),
    });
  };

  const handleQuestionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const questions = section.questions;
      const oldIndex = questions.findIndex((q) => q.id === active.id);
      const newIndex = questions.findIndex((q) => q.id === over.id);

      onUpdate({ ...section, questions: arrayMove(questions, oldIndex, newIndex) });
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="p-6 rounded-xl bg-white/5 border border-white/10">
      <div className="flex items-start gap-3 mb-4">
        <button
          {...attributes}
          {...listeners}
          className="text-slate-400 hover:text-white mt-2 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        <div className="flex-1">
          <Input
            value={section.title}
            onChange={(e) => updateTitle(e.target.value)}
            className="text-lg font-semibold mb-2"
          />
          
          <textarea
            value={section.description || ''}
            onChange={(e) => updateDescription(e.target.value)}
            placeholder="Section description (optional)"
            rows={2}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
          />
        </div>

        <button
          onClick={onDelete}
          className="text-red-400 hover:text-red-300 mt-2"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleQuestionDragEnd}
        >
          <SortableContext
            items={section.questions.map((q) => q.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {section.questions.map((question, index) => (
                <QuestionBuilder
                  key={question.id}
                  question={question}
                  questionNumber={index + 1}
                  onUpdate={(q) => updateQuestion(index, q)}
                  onDelete={() => deleteQuestion(index)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <button
          onClick={addQuestion}
          className="w-full p-3 border border-dashed border-white/20 rounded-lg text-slate-400 hover:text-white hover:border-white/40 flex items-center justify-center gap-2 mt-4"
        >
          <Plus className="w-4 h-4" />
          Add Question
        </button>
      </div>
    </div>
  );
};

export default SectionBuilder;
