import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { useUserProgress } from "@/hooks/useUserProgress";
import { industries, jobTypes } from "@/data/problems";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  CheckCircle, 
  Target, 
  TrendingUp, 
  Zap,
  Award,
  Circle,
  Star
} from "lucide-react";

export default function Progress() {
  const { problems: allProblems } = useUserProgress();
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [selectedJobType, setSelectedJobType] = useState<string>("all");

  const filteredProblems = useMemo(() => {
    return allProblems.filter((p) => {
      const industryMatch = selectedIndustry === "all" || p.industry === selectedIndustry;
      const jobTypeMatch = selectedJobType === "all" || p.jobType === selectedJobType;
      return industryMatch && jobTypeMatch;
    });
  }, [allProblems, selectedIndustry, selectedJobType]);

  const attemptedCount = filteredProblems.filter((p) => p.status === "attempted").length;
  const completedCount = filteredProblems.filter((p) => p.status === "completed").length;
  const acedCount = filteredProblems.filter((p) => p.status === "aced").length;
  const passedCount = completedCount + acedCount;
  const totalCount = filteredProblems.length;
  const progress = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;

  const byDifficulty = {
    Easy: filteredProblems.filter((p) => p.difficulty === "Easy"),
    Medium: filteredProblems.filter((p) => p.difficulty === "Medium"),
    Hard: filteredProblems.filter((p) => p.difficulty === "Hard"),
  };

  const byCategory = filteredProblems.reduce((acc, problem) => {
    if (!acc[problem.category]) {
      acc[problem.category] = { total: 0, completed: 0 };
    }
    acc[problem.category].total++;
    if (problem.status === "completed" || problem.status === "aced") {
      acc[problem.category].completed++;
    }
    return acc;
  }, {} as Record<string, { total: number; completed: number }>);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Your Progress
          </h1>
          <p className="text-muted-foreground mb-6">
            Score 70% or higher to pass, 90% or higher to ace a case.
          </p>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Industries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {Object.keys(industries).map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedJobType} onValueChange={setSelectedJobType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Job Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Job Types</SelectItem>
                {jobTypes.map((jobType) => (
                  <SelectItem key={jobType} value={jobType}>
                    {jobType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Showing {totalCount} cases
          </p>
          
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 mb-8 text-sm">
            <span className="flex items-center gap-2">
              <Circle className="w-4 h-4 text-muted-foreground" />
              Attempted (under 70%)
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              Completed (70%+)
            </span>
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              Aced (90%+)
            </span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard
              icon={Circle}
              label="Attempted"
              value={attemptedCount.toString()}
              subtext="under 70%"
              color="text-muted-foreground"
            />
            <StatCard
              icon={CheckCircle}
              label="Completed"
              value={completedCount.toString()}
              subtext="scored 70%+"
              color="text-success"
            />
            <StatCard
              icon={Star}
              label="Aced"
              value={acedCount.toString()}
              subtext="scored 90%+"
              color="text-amber-500"
            />
            <StatCard
              icon={Target}
              label="Pass Rate"
              value={`${progress}%`}
              subtext={`${passedCount} of ${totalCount} passed`}
              color="text-primary"
            />
          </div>

          {/* Progress by Difficulty */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Progress by Difficulty
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(["Easy", "Medium", "Hard"] as const).map((difficulty) => {
                const items = byDifficulty[difficulty];
                const passed = items.filter((p) => p.status === "completed" || p.status === "aced").length;
                const diffProgress = items.length > 0 ? Math.round((passed / items.length) * 100) : 0;
                const difficultyVariant = difficulty.toLowerCase() as "easy" | "medium" | "hard";

                return (
                  <div key={difficulty} className="glass rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant={difficultyVariant} className="text-sm">
                        {difficulty}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {passed}/{items.length}
                      </span>
                    </div>
                    <div className="h-3 bg-secondary rounded-full overflow-hidden mb-2">
                      <div
                        className={`h-full transition-all duration-500 ${
                          difficulty === "Easy"
                            ? "bg-easy"
                            : difficulty === "Medium"
                            ? "bg-medium"
                            : "bg-hard"
                        }`}
                        style={{ width: `${diffProgress}%` }}
                      />
                    </div>
                    <p className="text-right text-sm font-medium text-foreground">
                      {diffProgress}%
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Progress by Category */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Progress by Category
            </h2>
            <div className="glass rounded-xl overflow-hidden">
              <div className="divide-y divide-border">
                {Object.entries(byCategory).map(([category, data]) => {
                  const categoryProgress = Math.round(
                    (data.completed / data.total) * 100
                  );
                  return (
                    <div
                      key={category}
                      className="p-4 flex items-center gap-4 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-foreground">
                            {category}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {data.completed}/{data.total}
                          </span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: `${categoryProgress}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-foreground w-12 text-right">
                        {categoryProgress}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Achievements */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Achievements
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Achievement
                icon={Award}
                title="First Case"
                description="Pass your first case"
                unlocked={passedCount >= 1}
              />
              <Achievement
                icon={Zap}
                title="Quick Learner"
                description="Pass 5 cases"
                unlocked={passedCount >= 5}
              />
              <Achievement
                icon={TrendingUp}
                title="Rising Star"
                description="Pass 10 cases"
                unlocked={passedCount >= 10}
              />
              <Achievement
                icon={Star}
                title="Perfectionist"
                description="Ace 5 cases"
                unlocked={acedCount >= 5}
              />
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  color,
}: {
  icon: typeof CheckCircle;
  label: string;
  value: string;
  subtext: string;
  color: string;
}) {
  return (
    <div className="glass rounded-xl p-6">
      <Icon className={`w-6 h-6 ${color} mb-4`} />
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
      <p className="text-sm text-muted-foreground">{subtext}</p>
    </div>
  );
}

function Achievement({
  icon: Icon,
  title,
  description,
  unlocked,
}: {
  icon: typeof Award;
  title: string;
  description: string;
  unlocked: boolean;
}) {
  return (
    <div
      className={`glass rounded-xl p-6 text-center transition-all ${
        unlocked ? "border-primary/50" : "opacity-50"
      }`}
    >
      <div
        className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center ${
          unlocked ? "bg-primary" : "bg-secondary"
        }`}
      >
        <Icon
          className={`w-6 h-6 ${
            unlocked ? "text-primary-foreground" : "text-muted-foreground"
          }`}
        />
      </div>
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
