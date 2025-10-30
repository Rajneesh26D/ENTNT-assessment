import React from 'react';
import type { Assessment } from '../../services/db';

interface AssessmentPreviewProps {
  assessment: Assessment;
}

const AssessmentPreview: React.FC<AssessmentPreviewProps> = ({ assessment }) => {
  return (
    <div className="p-6 rounded-xl bg-white/5 border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-2">Preview</h2>
      <p className="text-slate-400 text-sm mb-6">
        This is how the assessment will appear to candidates
      </p>

      {assessment.sections.map((section, sectionIndex) => (
        <div key={section.id} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-white/10 text-slate-300 rounded text-sm">
              Section {sectionIndex + 1}
            </span>
            <h3 className="text-xl font-semibold text-white">{section.title}</h3>
          </div>
          
          {section.description && (
            <p className="text-slate-400 text-sm mb-6">{section.description}</p>
          )}

          <div className="space-y-6">
            {section.questions.map((question, qIndex) => (
              <div key={question.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-start gap-3 mb-3">
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs font-medium">
                    Q{qIndex + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-slate-300 font-medium">
                      {question.question}
                      {question.required && <span className="text-red-400 ml-1">*</span>}
                    </p>
                  </div>
                </div>

                {question.type === 'short-text' && (
                  <input
                    type="text"
                    disabled
                    placeholder="Short text answer..."
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-500 cursor-not-allowed"
                  />
                )}

                {question.type === 'long-text' && (
                  <textarea
                    disabled
                    placeholder="Long text answer..."
                    rows={3}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-500 cursor-not-allowed resize-none"
                  />
                )}

                {question.type === 'single-choice' && (
                  <div className="space-y-2">
                    {question.options?.map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-slate-800 border border-slate-700"
                      >
                        <div className="w-4 h-4 rounded-full border-2 border-slate-600" />
                        <span className="text-slate-400">{option}</span>
                      </div>
                    ))}
                  </div>
                )}

                {question.type === 'multi-choice' && (
                  <div className="space-y-2">
                    {question.options?.map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-slate-800 border border-slate-700"
                      >
                        <div className="w-4 h-4 rounded border-2 border-slate-600" />
                        <span className="text-slate-400">{option}</span>
                      </div>
                    ))}
                  </div>
                )}

                {question.type === 'numeric' && (
                  <>
                    <input
                      type="number"
                      disabled
                      placeholder={`Enter number (${question.min || 0} - ${question.max || 100})`}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-500 cursor-not-allowed"
                    />
                    {(question.min !== undefined || question.max !== undefined) && (
                      <p className="mt-2 text-xs text-slate-500">
                        Range: {question.min || 0} to {question.max || 100}
                      </p>
                    )}
                  </>
                )}

                {question.type === 'file-upload' && (
                  <div className="p-4 border-2 border-dashed border-slate-700 rounded-lg text-center">
                    <p className="text-slate-500 text-sm">File upload field</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
        <p className="text-blue-300 text-sm">
          ℹ️ This is a preview only. Candidates will be able to fill and submit this assessment.
        </p>
      </div>
    </div>
  );
};

export default AssessmentPreview;
