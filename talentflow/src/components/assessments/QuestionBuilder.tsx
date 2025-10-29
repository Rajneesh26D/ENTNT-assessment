/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Trash2, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Question, QuestionType } from "../../services/db";
import Input from "../ui/Input";

interface QuestionBuilderProps {
  question: Question;
  questionNumber: number;
  onUpdate: (question: Question) => void;
  onDelete: () => void;
  dragHandleProps?: any; // Add this
}

const QuestionBuilder: React.FC<QuestionBuilderProps> = ({
  question,
  questionNumber,
  onUpdate,
  onDelete,
  dragHandleProps,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleProps = dragHandleProps ?? { ...attributes, ...listeners };

  const updateField = (field: string, value: any) => {
    onUpdate({ ...question, [field]: value });
  };

  const addOption = () => {
    const newOptions = [...(question.options || []), ""];
    updateField("options", newOptions);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(question.options || [])];
    newOptions[index] = value;
    updateField("options", newOptions);
  };

  const removeOption = (index: number) => {
    const newOptions = (question.options || []).filter((_, i) => i !== index);
    updateField("options", newOptions);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-4 rounded-lg bg-white/5 border border-white/10"
    >
      <div className="flex items-start gap-3 mb-4">
        <button
          {...handleProps}
          className="text-slate-400 hover:text-white mt-2 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium">
              Q{questionNumber}
            </span>
            <label className="flex items-center gap-2 text-sm text-slate-400">
              <input
                type="checkbox"
                checked={question.required}
                onChange={(e) => updateField("required", e.target.checked)}
                className="rounded"
              />
              Required
            </label>
          </div>

          {/* Question Type */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Question Type
            </label>
            <select
              value={question.type}
              onChange={(e) =>
                updateField("type", e.target.value as QuestionType)
              }
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 [&>option]:bg-slate-800 [&>option]:text-white"
            >
              <option value="short-text">Short Text</option>
              <option value="long-text">Long Text</option>
              <option value="single-choice">Single Choice</option>
              <option value="multi-choice">Multiple Choice</option>
              <option value="numeric">Numeric</option>
              <option value="file-upload">File Upload</option>
            </select>
          </div>

          {/* Question Text */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Question
            </label>
            <textarea
              value={question.question}
              onChange={(e) => updateField("question", e.target.value)}
              placeholder="New Question"
              rows={2}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
            />
          </div>

          {/* Options for choice questions */}
          {(question.type === "single-choice" ||
            question.type === "multi-choice") && (
            <div className="mb-3">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Options
              </label>
              <div className="space-y-2">
                {(question.options || []).map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                    <button
                      onClick={() => removeOption(index)}
                      className="px-3 text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={addOption}
                  className="text-sm text-purple-400 hover:text-purple-300"
                >
                  + Add Option
                </button>
              </div>
            </div>
          )}

          {/* Min/Max Length for text */}
          {(question.type === "short-text" ||
            question.type === "long-text") && (
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Min Length
                </label>
                <Input
                  type="number"
                  value={question.min || ""}
                  onChange={(e) =>
                    updateField("min", parseInt(e.target.value) || undefined)
                  }
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Max Length
                </label>
                <Input
                  type="number"
                  value={question.maxLength || ""}
                  onChange={(e) =>
                    updateField(
                      "maxLength",
                      parseInt(e.target.value) || undefined
                    )
                  }
                  placeholder="1000"
                />
              </div>
            </div>
          )}

          {/* Min/Max for numeric */}
          {question.type === "numeric" && (
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Min Value
                </label>
                <Input
                  type="number"
                  value={question.min || ""}
                  onChange={(e) =>
                    updateField("min", parseInt(e.target.value) || undefined)
                  }
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Max Value
                </label>
                <Input
                  type="number"
                  value={question.max || ""}
                  onChange={(e) =>
                    updateField("max", parseInt(e.target.value) || undefined)
                  }
                  placeholder="100"
                />
              </div>
            </div>
          )}

          {/* Conditional Logic */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Conditional Logic (Optional)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <select className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 [&>option]:bg-slate-800 [&>option]:text-white">
                <option>None</option>
              </select>
              <select className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 [&>option]:bg-slate-800 [&>option]:text-white">
                <option>Equals</option>
              </select>

              <Input placeholder="Value" />
            </div>
          </div>
        </div>

        <button
          onClick={onDelete}
          className="text-red-400 hover:text-red-300 mt-2"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default QuestionBuilder;
