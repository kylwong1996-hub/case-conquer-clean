import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { problems } from "@/data/problems";
import { Problem } from "@/components/ProblemCard";

interface ProgressData {
  problem_id: string;
  score: number;
  completed: boolean;
}

export type CaseStatus = "not-attempted" | "attempted" | "completed" | "aced";

export function getStatusFromScore(score: number | undefined): CaseStatus {
  if (score === undefined) return "not-attempted";
  if (score >= 90) return "aced";
  if (score >= 70) return "completed";
  return "attempted";
}

export function useUserProgress() {
  const [progressMap, setProgressMap] = useState<Record<string, ProgressData>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data } = await supabase
          .from("problem_progress")
          .select("problem_id, score, completed")
          .eq("user_id", user.id);

        if (data) {
          const map: Record<string, ProgressData> = {};
          data.forEach((item) => {
            map[item.problem_id] = item;
          });
          setProgressMap(map);
        }
      }
      setIsLoading(false);
    };

    fetchProgress();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchProgress();
    });

    return () => subscription.unsubscribe();
  }, []);

  // Merge static problems with user progress
  const problemsWithProgress: (Problem & { status: CaseStatus; score?: number })[] = problems.map((problem) => {
    const progress = progressMap[problem.id];
    return {
      ...problem,
      completed: progress?.completed ?? false,
      score: progress?.score,
      status: getStatusFromScore(progress?.score),
    };
  });

  const attemptedCount = problemsWithProgress.filter((p) => p.status === "attempted").length;
  const completedCount = problemsWithProgress.filter((p) => p.status === "completed").length;
  const acedCount = problemsWithProgress.filter((p) => p.status === "aced").length;
  const passedCount = completedCount + acedCount; // For backward compatibility

  return {
    problems: problemsWithProgress,
    progressMap,
    attemptedCount,
    completedCount,
    acedCount,
    passedCount,
    isLoading,
  };
}
