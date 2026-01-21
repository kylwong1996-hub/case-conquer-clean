import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProblemCard } from "@/components/ProblemCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { industries, Industry, jobTypes } from "@/data/problems";
import { useUserProgress } from "@/hooks/useUserProgress";
import { Search, Filter, CheckCircle, Circle, ChevronDown, Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";

const categories = [
  "All",
  "Market Sizing",
  "Profitability",
  "M&A",
  "Market Entry",
  "Growth Strategy",
  "Operations",
];

const difficulties = ["All", "Easy", "Medium", "Hard"];

export default function Problems() {
  const { problems, passedCount, isLoading } = useUserProgress();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All Industries");
  const [selectedJobType, setSelectedJobType] = useState<string>("All Job Types");
  const [completionFilter, setCompletionFilter] = useState<"all" | "completed" | "attempted" | "todo">("all");

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchesSearch = problem.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || problem.category === selectedCategory;
      const matchesDifficulty =
        selectedDifficulty === "All" || problem.difficulty === selectedDifficulty;
      const matchesCompletion =
        completionFilter === "all" ||
        (completionFilter === "completed" && (problem.status === "completed" || problem.status === "aced")) ||
        (completionFilter === "attempted" && problem.status === "attempted") ||
        (completionFilter === "todo" && problem.status === "not-attempted");
      const matchesIndustry =
        selectedIndustry === "All Industries" || problem.industry === selectedIndustry;
      const matchesJobType =
        selectedJobType === "All Job Types" || problem.jobType === selectedJobType;

      return matchesSearch && matchesCategory && matchesDifficulty && matchesCompletion && matchesIndustry && matchesJobType;
    });
  }, [problems, search, selectedCategory, selectedDifficulty, completionFilter, selectedIndustry, selectedJobType]);

  const progress = Math.round((passedCount / problems.length) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Problem Library
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>{passedCount} / {problems.length} passed</span>
              </div>
              <div className="flex-1 max-w-xs h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-medium text-foreground">{progress}%</span>
            </div>
          </div>

          {/* Filters */}
          <div className="glass rounded-xl p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search cases..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-secondary border-border"
                />
              </div>

              {/* Industry Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 min-w-[200px] justify-between">
                    {selectedIndustry}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-card border-border z-50">
                  <DropdownMenuLabel>Select Industry</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setSelectedIndustry("All Industries")}
                    className="cursor-pointer"
                  >
                    All Industries
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {(Object.keys(industries) as Industry[])
                    .filter(key => key !== "All Industries")
                    .map((industry) => (
                      <DropdownMenuSub key={industry}>
                        <DropdownMenuSubTrigger className="cursor-pointer">
                          {industry}
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="bg-card border-border">
                          <DropdownMenuItem 
                            onClick={() => setSelectedIndustry(industry)}
                            className="cursor-pointer font-medium"
                          >
                            All {industry}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {industries[industry].map((subCategory) => (
                            <DropdownMenuItem 
                              key={subCategory}
                              onClick={() => setSelectedIndustry(industry)}
                              className="cursor-pointer text-muted-foreground"
                            >
                              {subCategory}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Job Type Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 min-w-[180px] justify-between">
                    {selectedJobType}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-card border-border z-50">
                  <DropdownMenuLabel>Select Job Type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {jobTypes.map((jobType) => (
                    <DropdownMenuItem
                      key={jobType}
                      onClick={() => setSelectedJobType(jobType)}
                      className="cursor-pointer"
                    >
                      {jobType}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mt-4">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border">
              {/* Difficulty Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Difficulty:</span>
                {difficulties.map((difficulty) => (
                  <Badge
                    key={difficulty}
                    variant={
                      selectedDifficulty === difficulty
                        ? difficulty.toLowerCase() === "all"
                          ? "default"
                          : (difficulty.toLowerCase() as "easy" | "medium" | "hard")
                        : "category"
                    }
                    className="cursor-pointer"
                    onClick={() => setSelectedDifficulty(difficulty)}
                  >
                    {difficulty}
                  </Badge>
                ))}
              </div>

              {/* Completion Filter */}
              <div className="flex items-center gap-2 ml-auto">
                <Button
                  variant={completionFilter === "completed" ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                  onClick={() => setCompletionFilter(completionFilter === "completed" ? "all" : "completed")}
                >
                  <CheckCircle className="w-4 h-4" />
                  Completed
                </Button>
                <Button
                  variant={completionFilter === "attempted" ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                  onClick={() => setCompletionFilter(completionFilter === "attempted" ? "all" : "attempted")}
                >
                  <Star className="w-4 h-4" />
                  Attempted
                </Button>
                <Button
                  variant={completionFilter === "todo" ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                  onClick={() => setCompletionFilter(completionFilter === "todo" ? "all" : "todo")}
                >
                  <Circle className="w-4 h-4" />
                  Todo
                </Button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {filteredProblems.length} of {problems.length} problems
          </div>

          {/* Problem List */}
          <div className="space-y-3">
            {filteredProblems.map((problem, index) => (
              <ProblemCard key={problem.id} problem={problem} index={index} />
            ))}
          </div>

          {filteredProblems.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No problems match your filters</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                  setSelectedDifficulty("All");
                  setSelectedIndustry("All Industries");
                  setSelectedJobType("All Job Types");
                  setCompletionFilter("all");
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
