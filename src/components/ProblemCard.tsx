import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Building2, Star, Circle } from "lucide-react";
import { CaseStatus } from "@/hooks/useUserProgress";

export interface Problem {
  id: string;
  title: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  company?: string;
  timeEstimate: number;
  completed?: boolean;
  acceptance?: number;
  industry?: string;
  jobType?: string;
  status?: CaseStatus;
  score?: number;
}

interface ProblemCardProps {
  problem: Problem;
  index?: number;
}

function StatusIcon({ status }: { status?: CaseStatus }) {
  switch (status) {
    case "aced":
      return <Star className="w-4 h-4 text-amber-500 fill-amber-500 flex-shrink-0" />;
    case "completed":
      return <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />;
    case "attempted":
      return <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0" />;
    default:
      return null;
  }
}

export function ProblemCard({ problem, index = 0 }: ProblemCardProps) {
  const difficultyVariant = problem.difficulty.toLowerCase() as "easy" | "medium" | "hard";

  return (
    <Link
      to={`/case/${problem.id}`}
      className="block animate-fade-in"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="glass rounded-xl p-5 transition-all duration-300 hover:bg-secondary/50 hover:border-primary/30 group">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <StatusIcon status={problem.status} />
              <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {problem.title}
              </h3>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="category">{problem.category}</Badge>
              <Badge variant={difficultyVariant}>{problem.difficulty}</Badge>
              {problem.score !== undefined && (
                <Badge variant="outline" className="text-xs">
                  {problem.score}%
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {problem.company && (
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  {problem.company}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {problem.timeEstimate} min
              </span>
              {problem.acceptance && (
                <span className="text-muted-foreground/70">
                  {problem.acceptance}% success rate
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}