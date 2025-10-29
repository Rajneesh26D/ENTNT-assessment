import React from "react";
import { Link } from "react-router-dom";
import { Edit, Eye, Plus } from "lucide-react";
import type { Job, Assessment } from "../../services/db";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

interface AssessmentCardProps {
  job: Job;
  assessment?: Assessment;
  onRefresh: () => void;
}

const AssessmentCard: React.FC<AssessmentCardProps> = ({ job, assessment }) => {
  const totalQuestions =
    assessment?.sections.reduce(
      (sum, section) => sum + section.questions.length,
      0
    ) || 0;

  return (
    <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20">
      <h3 className="text-xl font-semibold text-white mb-3">{job.title}</h3>

      <div className="flex gap-2 mb-4">
        {job.location && (
          <Badge variant="secondary" size="sm">
            {job.location}
          </Badge>
        )}
        {job.type && (
          <Badge variant="secondary" size="sm">
            {job.type}
          </Badge>
        )}
      </div>

      {assessment ? (
        <>
          <p className="text-slate-400 text-sm mb-3">
            <span className="font-semibold">{assessment.sections.length}</span>{" "}
            sections, <span className="font-semibold">{totalQuestions}</span>{" "}
            questions
          </p>
          <p className="text-slate-400 text-sm mb-4">
            Technical assessment for {job.title} position
          </p>
          <div className="flex gap-2">
            <Link to={`/hr/assessments/${job.id}`}>
              <Button
                size="sm"
                variant="secondary"
                icon={<Edit className="w-4 h-4" />}
              >
                Edit
              </Button>
            </Link>
            <Link to={`/hr/assessments/take/${job.id}`}>
              <Button
                size="sm"
                variant="ghost"
                icon={<Eye className="w-4 h-4" />}
              >
                Preview
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <>
          <p className="text-slate-400 text-sm mb-4">
            No assessment created yet for this position.
          </p>
          <Link to={`/hr/assessments/${job.id}`}>
            <Button
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
              className="w-full"
            >
              Create Assessment
            </Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default AssessmentCard;
