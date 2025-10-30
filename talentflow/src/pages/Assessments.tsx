import React, { useState, useEffect } from 'react';
import { Search, Loader2, Download } from 'lucide-react'; 
import HrLayout from '../components/layout/HrLayout';
import AssessmentCard from '../components/assessments/AssessmentCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button'; 
import { db } from '../services/db';
import type { Assessment, Job } from '../services/db';
import { exportAssessmentsToJSON } from '../utils/export';

const Assessments: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [assessments, setAssessments] = useState<Record<string, Assessment>>({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const allJobs = await db.jobs.where('status').equals('active').toArray();
    const allAssessments = await db.assessments.toArray();
    
    const assessmentMap: Record<string, Assessment> = {};
    allAssessments.forEach((a: Assessment) => {
      assessmentMap[a.jobId] = a;
    });

    setJobs(allJobs);
    setAssessments(assessmentMap);
    setLoading(false);
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <HrLayout title="Assessments">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
      </HrLayout>
    );
  }

  return (
    <HrLayout title="Assessments">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-slate-400">
            Create and manage job-specific assessments and quizzes
          </p>
          <Button
            variant="secondary"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={() => exportAssessmentsToJSON(Object.values(assessments))}
          >
            Export JSON
          </Button>
        </div>

        <Input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <AssessmentCard
              key={job.id}
              job={job}
              assessment={assessments[job.id]}
              onRefresh={loadData}
            />
          ))}
        </div>
      </div>
    </HrLayout>
  );
};

export default Assessments;
