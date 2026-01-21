import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProblemCard } from "@/components/ProblemCard";
import { problems } from "@/data/problems";
import { ArrowRight } from "lucide-react";

export function FeaturedProblems() {
  const featured = problems.slice(0, 6);

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Popular Cases
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Start with these frequently asked interview cases from top consulting firms
            </p>
          </div>
          <Link to="/problems" className="hidden md:block">
            <Button variant="outline" className="gap-2">
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {featured.map((problem, index) => (
            <ProblemCard key={problem.id} problem={problem} index={index} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link to="/problems">
            <Button variant="outline" className="gap-2">
              View All Problems
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}