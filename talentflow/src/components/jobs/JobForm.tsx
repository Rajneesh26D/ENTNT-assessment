import React, { useState, useEffect } from 'react';
import type { Job } from '../../services/db';
import { db } from '../../services/db';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface JobFormProps {
  isOpen: boolean;
  onClose: () => void;
  job?: Job | null;
  onSuccess: () => void;
}

const JobForm: React.FC<JobFormProps> = ({ isOpen, onClose, job, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    type: 'Full-time',
    requirements: [] as string[],
    tags: [] as string[],
  });

  const [currentRequirement, setCurrentRequirement] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        description: job.description || '',
        location: job.location || '',
        type: job.type || 'Full-time',
        requirements: job.requirements || [],
        tags: job.tags || [],
      });
    } else {
      setFormData({
        title: '',
        description: '',
        location: '',
        type: 'Full-time',
        requirements: [],
        tags: [],
      });
    }
    setErrors({});
  }, [job, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const addRequirement = () => {
    if (currentRequirement.trim()) {
      setFormData({
        ...formData,
        requirements: [...formData.requirements, currentRequirement.trim()],
      });
      setCurrentRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((_, i) => i !== index),
    });
  };

  const addTag = () => {
    if (currentTag.trim()) {
      setFormData({
        ...formData,
        tags: [...formData.tags, currentTag.trim()],
      });
      setCurrentTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index),
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      if (job) {
        await db.jobs.update(job.id, {
          title: formData.title,
          slug: formData.title.toLowerCase().replace(/\s+/g, '-'),
          description: formData.description,
          location: formData.location,
          type: formData.type,
          requirements: formData.requirements,
          tags: formData.tags,
        });
      } else {
        const maxOrder = await db.jobs.toArray().then(jobs => 
          Math.max(0, ...jobs.map(j => j.order))
        );

        await db.jobs.add({
          id: `job-${Date.now()}`,
          title: formData.title,
          slug: formData.title.toLowerCase().replace(/\s+/g, '-') + `-${Date.now()}`,
          status: 'active',
          description: formData.description,
          location: formData.location,
          type: formData.type,
          requirements: formData.requirements,
          tags: formData.tags,
          order: maxOrder + 1,
          createdAt: new Date().toISOString(),
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving job:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={job ? "Edit Job" : "Create New Job"}
      size="lg"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Job Title *
          </label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Senior Frontend Developer"
            error={errors.title}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the role..."
            rows={4}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
          />
          {errors.description && (
            <p className="mt-2 text-sm text-red-400">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Location
            </label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., New York, Remote"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Job Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 [&>option]:bg-slate-800 [&>option]:text-white"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Requirements
          </label>
          <div className="flex gap-2 mb-3">
            <Input
              value={currentRequirement}
              onChange={(e) => setCurrentRequirement(e.target.value)}
              placeholder="Add a requirement..."
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addRequirement())
              }
            />
            <Button onClick={addRequirement} variant="secondary">
              Add
            </Button>
          </div>
          {formData.requirements.length > 0 && (
            <div className="space-y-2">
              {formData.requirements.map((req, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-lg"
                >
                  <span className="text-slate-300 text-sm">{req}</span>
                  <button
                    onClick={() => removeRequirement(index)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Tags
          </label>
          <div className="flex gap-2 mb-3">
            <Input
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              placeholder="Add a tag..."
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addTag())
              }
            />
            <Button onClick={addTag} variant="secondary">
              Add
            </Button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={loading}>
            {job ? "Save Changes" : "Create Job"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default JobForm;
