/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { db } from '../services/db';
import type { Assessment } from '../services/db';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const AssessmentTake: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const loadAssessment = React.useCallback(async () => {
    if (!jobId) return;
    const data = await db.assessments.get(jobId);
    setAssessment(data ?? null);
    setLoading(false);
  }, [jobId]);

  useEffect(() => {
    loadAssessment();
  }, [jobId, loadAssessment]);

  const totalQuestions = assessment?.sections.reduce(
    (sum, section) => sum + section.questions.length,
    0
  ) || 0;

  const answeredQuestions = Object.keys(responses).filter(
    key => responses[key] !== '' && responses[key] !== undefined
  ).length;

  const progress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  const handleResponse = (questionId: string, value: any) => {
    setResponses({ ...responses, [questionId]: value });
    if (errors[questionId]) {
      setErrors({ ...errors, [questionId]: '' });
    }
  };

  const validateAndSubmit = () => {
    const newErrors: Record<string, string> = {};

    assessment?.sections.forEach(section => {
      section.questions.forEach(question => {
        if (question.required && !responses[question.id]) {
          newErrors[question.id] = 'This field is required';
        }

        if (question.type === 'numeric' && responses[question.id]) {
          const value = parseInt(responses[question.id]);
          if (question.min !== undefined && value < question.min) {
            newErrors[question.id] = `Minimum value is ${question.min}`;
          }
          if (question.max !== undefined && value > question.max) {
            newErrors[question.id] = `Maximum value is ${question.max}`;
          }
        }

        if ((question.type === 'short-text' || question.type === 'long-text') && responses[question.id]) {
          const length = responses[question.id].length;
          if (question.maxLength && length > question.maxLength) {
            newErrors[question.id] = `Maximum length is ${question.maxLength}`;
          }
        }
      });
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    alert('Assessment submitted successfully!');
    navigate('/hr/assessments');
  };

  if (loading || !assessment) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/hr/assessments')}
          className="flex items-center gap-2 text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {assessment.jobTitle} Assessment
          </h1>
          <p className="text-slate-400 mb-4">
            {assessment.jobTitle} - New York
          </p>
          <p className="text-slate-300">
            Technical assessment for {assessment.jobTitle} position
          </p>
        </div>

        {/* Progress Card */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">
            {assessment.jobTitle} Assessment
          </h2>
          <p className="text-slate-400 mb-4">
            Technical assessment for {assessment.jobTitle} position
          </p>

          <div className="mb-2">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Progress</span>
              <span className="text-white font-semibold">{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <p className="text-slate-500 text-sm">
            {answeredQuestions} of {totalQuestions} questions answered
          </p>
        </div>

        {/* Sections */}
        {assessment.sections.map((section, sectionIndex) => (
          <div key={section.id} className="p-6 rounded-xl bg-slate-900/50 border border-white/10 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-white/10 text-slate-300 rounded text-sm">
                Section {sectionIndex + 1}
              </span>
              <h3 className="text-xl font-semibold text-white">{section.title}</h3>
            </div>
            {section.description && (
              <p className="text-slate-400 mb-6">{section.description}</p>
            )}

            {/* Questions */}
            {section.questions.map((question) => {
              const value = responses[question.id] || '';
              const error = errors[question.id];

              return (
                <div key={question.id} className="mb-6">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {question.question}
                    {question.required && <span className="text-red-400 ml-1">*</span>}
                  </label>

                  {question.type === 'short-text' && (
                    <Input
                      value={value}
                      onChange={(e) => handleResponse(question.id, e.target.value)}
                      placeholder="Your answer..."
                      error={error}
                    />
                  )}

                  {question.type === 'long-text' && (
                    <>
                      <textarea
                        value={value}
                        onChange={(e) => handleResponse(question.id, e.target.value)}
                        placeholder="Your answer..."
                        rows={4}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                      />
                      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
                    </>
                  )}

                  {question.type === 'single-choice' && (
                    <div className="space-y-2">
                      {question.options?.map((option, index) => (
                        <label
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={question.id}
                            value={option}
                            checked={value === option}
                            onChange={(e) => handleResponse(question.id, e.target.value)}
                            className="text-purple-500"
                          />
                          <span className="text-slate-300">{option}</span>
                        </label>
                      ))}
                      {error && <p className="text-sm text-red-400">{error}</p>}
                    </div>
                  )}

                  {question.type === 'multi-choice' && (
                    <div className="space-y-2">
                      {question.options?.map((option, index) => {
                        const selected = Array.isArray(value) ? value : [];
                        return (
                          <label
                            key={index}
                            className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              value={option}
                              checked={selected.includes(option)}
                              onChange={(e) => {
                                const newValue = e.target.checked
                                  ? [...selected, option]
                                  : selected.filter(v => v !== option);
                                handleResponse(question.id, newValue);
                              }}
                              className="text-purple-500"
                            />
                            <span className="text-slate-300">{option}</span>
                          </label>
                        );
                      })}
                      {error && <p className="text-sm text-red-400">{error}</p>}
                    </div>
                  )}

                  {question.type === 'numeric' && (
                    <>
                      <Input
                        type="number"
                        value={value}
                        onChange={(e) => handleResponse(question.id, e.target.value)}
                        placeholder={`${question.min || 0} - ${question.max || 100}`}
                        error={error}
                      />
                      {(question.min !== undefined || question.max !== undefined) && (
                        <p className="mt-1 text-xs text-slate-500">
                          Range: {question.min || 0} to {question.max || 100}
                        </p>
                      )}
                    </>
                  )}

                  {question.type === 'file-upload' && (
                    <>
                      <input
                        type="file"
                        onChange={(e) => handleResponse(question.id, e.target.files?.[0])}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                      />
                      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Submit Section */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <p className="text-slate-400 mb-4">
            Ready to submit? Make sure all required fields are completed.
          </p>
          <Button variant="primary" onClick={validateAndSubmit} className="w-full sm:w-auto">
            Submit Assessment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentTake;
