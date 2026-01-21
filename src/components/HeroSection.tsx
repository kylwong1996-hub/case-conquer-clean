import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Clock, BarChart3 } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-background/50" />
      
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />

      <div className="container relative mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">
              500+ business case problems
            </span>
          </div>

          {/* Heading */}
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            Master Business
            <br />
            <span className="text-gradient">Case Interviews</span>
          </h1>

          {/* Subheading */}
          <p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            Practice real consulting and business cases. Build frameworks, 
            sharpen your analytical skills, and land your dream job.
          </p>

          {/* CTAs */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <Link to="/problems">
              <Button size="lg" className="gap-2 glow">
                Start Practicing
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/problems/1">
              <Button size="lg" variant="outline">
                View Sample Case
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <StatCard icon={Target} value="500+" label="Case Problems" />
            <StatCard icon={Clock} value="50+" label="Hours of Content" />
            <StatCard icon={BarChart3} value="12" label="Categories" />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ 
  icon: Icon, 
  value, 
  label 
}: { 
  icon: typeof Target; 
  value: string; 
  label: string;
}) {
  return (
    <div className="glass rounded-xl p-6 text-center">
      <Icon className="w-6 h-6 text-primary mx-auto mb-3" />
      <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}