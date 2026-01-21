import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getCaseTypeBySlug } from "@/data/guideExamples";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  MessageCircleQuestion, 
  GitBranch, 
  Calculator, 
  Target, 
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from "lucide-react";

const GuideExample = () => {
  const { caseType } = useParams<{ caseType: string }>();
  const example = getCaseTypeBySlug(caseType || "");

  if (!example) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Example Not Found</h1>
          <Link to="/guide" className="text-primary hover:underline">
            ← Back to Guide
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        {/* Back Link */}
        <Link 
          to="/guide" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Guide
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">{example.caseType}</Badge>
            <Badge variant="outline">{example.industry}</Badge>
            <Badge variant="outline">{example.difficulty}</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {example.title}
          </h1>
          <p className="text-lg text-muted-foreground">
            Company: <span className="text-foreground">{example.company}</span>
          </p>
        </div>

        {/* Situation */}
        <section className="mb-12">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Target className="w-5 h-5 text-primary" />
                The Situation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {example.situation}
              </p>
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm font-medium text-primary mb-1">Key Question:</p>
                <p className="text-foreground font-medium">{example.question}</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Step 1: Clarifying Questions */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">1</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <MessageCircleQuestion className="w-6 h-6 text-primary" />
              Clarifying Questions
            </h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Before diving into analysis, ask questions to understand the context and gather critical information.
          </p>
          <div className="grid gap-4">
            {example.clarifyingQuestions.map((q, idx) => (
              <Card key={idx} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-primary mb-1">Question:</p>
                      <p className="text-foreground">{q.question}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Answer:</p>
                      <p className="text-muted-foreground">{q.answer}</p>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <p className="text-sm text-emerald-400 flex items-center gap-1">
                        <Lightbulb className="w-4 h-4" />
                        <span className="font-medium">Insight:</span> {q.insight}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Step 2: Framework */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">2</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <GitBranch className="w-6 h-6 text-primary" />
              Structure Your Approach
            </h2>
          </div>
          <Card className="bg-card border-border mb-6">
            <CardHeader>
              <CardTitle className="text-foreground">{example.framework.name}</CardTitle>
              <p className="text-muted-foreground">{example.framework.explanation}</p>
            </CardHeader>
          </Card>
          <div className="grid md:grid-cols-2 gap-4">
            {example.framework.branches.map((branch, idx) => (
              <Card key={idx} className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-foreground">{branch.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{branch.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {branch.subPoints.map((point, pointIdx) => (
                      <li key={pointIdx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <ArrowRight className="w-3 h-3 mt-1 text-primary flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Step 3: Analysis */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">3</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Calculator className="w-6 h-6 text-primary" />
              Analyze & Calculate
            </h2>
          </div>
          <div className="space-y-6">
            {example.analysis.map((section, idx) => (
              <Card key={idx} className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">{section.section}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{section.content}</p>
                  {section.calculation && (
                    <div className="p-4 bg-muted/50 rounded-lg font-mono text-sm">
                      <p className="text-xs text-muted-foreground mb-2 font-sans">Calculations:</p>
                      <pre className="whitespace-pre-wrap text-foreground">{section.calculation}</pre>
                    </div>
                  )}
                  <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-sm text-primary flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span><span className="font-medium">Key Insight:</span> {section.insight}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Step 4: Recommendation */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">4</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              Synthesize & Recommend
            </h2>
          </div>
          
          <Card className="bg-card border-border mb-6">
            <CardHeader>
              <CardTitle className="text-foreground">Main Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-foreground font-medium">
                {example.recommendation.mainRecommendation}
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Supporting Reasons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {example.recommendation.supportingReasons.map((reason, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-400/10 text-emerald-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg text-foreground flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  Risks to Consider
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {example.recommendation.risks.map((risk, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-400/10 text-amber-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        !
                      </span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border mt-6">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {example.recommendation.nextSteps.map((step, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </section>

        {/* Key Takeaways */}
        <section className="mb-12">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                Key Takeaways
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {example.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="text-muted-foreground flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    {takeaway}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Navigation */}
        <div className="flex justify-center">
          <Link 
            to="/guide" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Guide
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GuideExample;
