import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BookOpen, Target, BarChart3, Users, TrendingUp, Lightbulb, CheckCircle2, ArrowRight, ExternalLink, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
const Guide = () => {
  const frameworks = [
    {
      name: "Profitability Framework",
      description: "Systematic approach to diagnose and solve profit decline issues by breaking down the profit equation into its core components.",
      steps: [
        "Define the problem: Is profit declining, stagnant, or below expectations?",
        "Break down revenue: Price × Volume across segments, products, channels",
        "Analyze cost structure: Fixed vs. variable, direct vs. indirect costs",
        "Identify root causes: Which specific drivers changed and why?",
        "Quantify impact: Size the opportunity for each lever",
        "Propose actionable solutions with expected ROI"
      ],
      details: {
        keyQuestions: [
          "Is this a revenue problem, cost problem, or both?",
          "How do our margins compare to competitors?",
          "What has changed recently (internal or external)?",
          "Which customer segments are most/least profitable?"
        ],
        commonPitfalls: [
          "Jumping to solutions before understanding root cause",
          "Focusing only on costs when revenue is the issue",
          "Ignoring the competitive context"
        ]
      },
      useCase: "When a company is experiencing declining profits, margin compression, or wants to improve overall profitability"
    },
    {
      name: "Market Entry Framework",
      description: "Comprehensive framework to evaluate whether and how to enter a new market, geography, or customer segment.",
      steps: [
        "Assess market attractiveness: Size, growth, profitability, trends",
        "Analyze competitive landscape: Key players, market share, barriers to entry",
        "Evaluate customer needs: Segments, preferences, willingness to pay",
        "Assess company capabilities: Core competencies, resources, gaps",
        "Determine entry strategy: Build, buy, or partner",
        "Develop financial projections and risk assessment"
      ],
      details: {
        keyQuestions: [
          "What is the total addressable market (TAM)?",
          "What are the key success factors in this market?",
          "Do we have the capabilities to compete effectively?",
          "What is the expected payback period?"
        ],
        commonPitfalls: [
          "Overestimating market size or growth",
          "Underestimating competitive response",
          "Ignoring regulatory or cultural barriers"
        ]
      },
      useCase: "When a company wants to expand into new markets, geographies, or launch new products/services"
    },
    {
      name: "M&A Framework",
      description: "Structured approach to evaluate mergers, acquisitions, and strategic partnerships from strategic, financial, and operational perspectives.",
      steps: [
        "Assess strategic rationale: Why this deal? What problem does it solve?",
        "Evaluate target attractiveness: Market position, financials, capabilities",
        "Identify and quantify synergies: Revenue synergies, cost synergies",
        "Conduct valuation analysis: DCF, comparable companies, precedent transactions",
        "Assess integration risks and complexity",
        "Develop post-merger integration plan"
      ],
      details: {
        keyQuestions: [
          "Is this a strategic or financial acquisition?",
          "What synergies can realistically be achieved?",
          "What is the standalone vs. combined value?",
          "Are there cultural or operational fit concerns?"
        ],
        commonPitfalls: [
          "Overestimating synergies (especially revenue)",
          "Underestimating integration costs and complexity",
          "Ignoring cultural fit issues"
        ]
      },
      useCase: "When evaluating whether to acquire, merge with, or form strategic partnerships"
    },
    {
      name: "Pricing Strategy Framework",
      description: "Framework to determine optimal pricing that maximizes value capture while remaining competitive.",
      steps: [
        "Understand cost structure: Variable costs, fixed costs, break-even",
        "Analyze customer value perception: Willingness to pay, value drivers",
        "Study competitive pricing: Direct competitors, substitutes",
        "Select pricing strategy: Cost-plus, value-based, competitive, dynamic",
        "Design pricing structure: Tiers, bundles, discounts",
        "Test and iterate: A/B testing, price elasticity analysis"
      ],
      details: {
        keyQuestions: [
          "What is our cost floor for profitability?",
          "How do customers perceive our value vs. alternatives?",
          "How price-sensitive is our customer base?",
          "What pricing models do competitors use?"
        ],
        commonPitfalls: [
          "Pricing based solely on costs, ignoring value",
          "Racing to the bottom on price",
          "Ignoring price elasticity dynamics"
        ]
      },
      useCase: "When launching new products, entering new markets, or optimizing existing pricing strategies"
    },
    {
      name: "Growth Strategy Framework",
      description: "Ansoff Matrix-based framework to identify and evaluate growth opportunities across products and markets.",
      steps: [
        "Assess current state: Market position, capabilities, resources",
        "Identify growth options using Ansoff Matrix:",
        "  • Market Penetration: Existing products, existing markets",
        "  • Product Development: New products, existing markets",
        "  • Market Development: Existing products, new markets",
        "  • Diversification: New products, new markets",
        "Evaluate each option: Feasibility, attractiveness, risk",
        "Prioritize and develop implementation roadmap"
      ],
      details: {
        keyQuestions: [
          "Where are we underperforming vs. potential?",
          "What are our core capabilities that can be leveraged?",
          "What is our risk appetite?",
          "What resources are required for each option?"
        ],
        commonPitfalls: [
          "Pursuing too many initiatives simultaneously",
          "Ignoring core business while chasing growth",
          "Underestimating execution complexity"
        ]
      },
      useCase: "When a company needs to accelerate revenue growth or diversify revenue streams"
    },
    {
      name: "Operations & Process Improvement",
      description: "Framework to analyze and optimize business processes, supply chains, and operational efficiency.",
      steps: [
        "Map current state: Process flows, bottlenecks, pain points",
        "Benchmark performance: Internal trends, industry standards",
        "Identify improvement opportunities: Waste, variability, delays",
        "Prioritize based on impact and feasibility",
        "Design future state with clear KPIs",
        "Develop implementation plan with change management"
      ],
      details: {
        keyQuestions: [
          "Where are the biggest bottlenecks or inefficiencies?",
          "How do we compare to best-in-class operations?",
          "What is the root cause of operational issues?",
          "What technology or process changes could help?"
        ],
        commonPitfalls: [
          "Optimizing individual steps vs. end-to-end process",
          "Ignoring employee input and change management",
          "Underestimating implementation challenges"
        ]
      },
      useCase: "When improving efficiency, reducing costs, or fixing operational bottlenecks"
    },
    {
      name: "Customer & Market Segmentation",
      description: "Framework to divide markets or customers into distinct groups for targeted strategies.",
      steps: [
        "Define segmentation objectives: What decisions will this inform?",
        "Identify segmentation variables: Demographics, behavior, needs, value",
        "Analyze data to create segments: Cluster analysis, qualitative research",
        "Evaluate segment attractiveness: Size, growth, profitability, fit",
        "Select target segments based on strategy",
        "Develop segment-specific value propositions"
      ],
      details: {
        keyQuestions: [
          "What are the key differentiating characteristics?",
          "Which segments are most profitable or strategic?",
          "How do needs differ across segments?",
          "Can we effectively reach and serve each segment?"
        ],
        commonPitfalls: [
          "Creating too many or too few segments",
          "Segmenting on variables that don't drive behavior",
          "Ignoring segment evolution over time"
        ]
      },
      useCase: "When developing marketing strategy, product strategy, or resource allocation decisions"
    },
    {
      name: "Competitive Response Framework",
      description: "Framework to analyze and respond to competitive threats or market disruptions.",
      steps: [
        "Understand the threat: What is the competitor doing? Why?",
        "Assess impact: Which segments, products, or regions are affected?",
        "Evaluate competitor capabilities: Strengths, weaknesses, sustainability",
        "Identify response options: Fight, accommodate, ignore, or exit",
        "Analyze trade-offs and risks of each option",
        "Develop and implement response plan"
      ],
      details: {
        keyQuestions: [
          "Is this a real threat or temporary noise?",
          "What is the competitor's likely next move?",
          "What are our sustainable advantages?",
          "What are the costs of different responses?"
        ],
        commonPitfalls: [
          "Overreacting to every competitive move",
          "Ignoring disruptive threats until too late",
          "Responding in ways that hurt overall profitability"
        ]
      },
      useCase: "When facing new competitors, price wars, or disruptive market changes"
    },
    {
      name: "Product Launch Framework",
      description: "Comprehensive framework for planning and executing successful new product introductions.",
      steps: [
        "Validate product-market fit: Customer needs, competitive positioning",
        "Define target customer and go-to-market strategy",
        "Set pricing and revenue model",
        "Develop launch plan: Marketing, sales, operations",
        "Establish success metrics and monitoring",
        "Plan for iteration based on market feedback"
      ],
      details: {
        keyQuestions: [
          "What customer problem are we solving?",
          "How are we differentiated from alternatives?",
          "What is the right channel and pricing strategy?",
          "What does success look like in 6/12/24 months?"
        ],
        commonPitfalls: [
          "Launching without clear product-market fit",
          "Underinvesting in go-to-market execution",
          "Failing to iterate based on early feedback"
        ]
      },
      useCase: "When launching new products, features, or services to market"
    },
    {
      name: "Cost Reduction Framework",
      description: "Structured approach to identify and implement sustainable cost savings without compromising quality or growth.",
      steps: [
        "Baseline current costs: Detailed cost breakdown by category",
        "Benchmark against peers and best practices",
        "Identify cost reduction levers: Quick wins vs. structural changes",
        "Prioritize by impact, feasibility, and risk",
        "Develop implementation roadmap with targets",
        "Establish governance and tracking mechanisms"
      ],
      details: {
        keyQuestions: [
          "What are our largest cost categories?",
          "Where are we spending more than peers?",
          "What costs are truly necessary vs. nice-to-have?",
          "How can we reduce costs without hurting quality?"
        ],
        commonPitfalls: [
          "Cutting costs that drive revenue or quality",
          "Focusing only on quick wins vs. structural changes",
          "Failing to sustain savings over time"
        ]
      },
      useCase: "When facing margin pressure, preparing for downturn, or improving competitive position"
    }
  ];

  const caseTypes = [
    {
      icon: BarChart3,
      title: "Profitability",
      slug: "profitability",
      description: "Analyze why profits are declining and recommend solutions",
      examples: ["Revenue optimization", "Cost reduction", "Margin improvement"],
      color: "text-emerald-400"
    },
    {
      icon: Target,
      title: "Market Entry",
      slug: "market-entry",
      description: "Evaluate whether to enter a new market or geography",
      examples: ["Geographic expansion", "New product launch", "Channel strategy"],
      color: "text-blue-400"
    },
    {
      icon: Users,
      title: "Mergers & Acquisitions",
      slug: "mergers-acquisitions",
      description: "Assess potential deals, synergies, and integration",
      examples: ["Acquisition targets", "Due diligence", "Integration planning"],
      color: "text-purple-400"
    },
    {
      icon: TrendingUp,
      title: "Growth Strategy",
      slug: "growth-strategy",
      description: "Identify opportunities to grow revenue or market share",
      examples: ["Market penetration", "Product development", "Diversification"],
      color: "text-primary"
    },
    {
      icon: Lightbulb,
      title: "Operations",
      slug: "operations",
      description: "Improve efficiency and optimize business processes",
      examples: ["Supply chain", "Process improvement", "Capacity planning"],
      color: "text-orange-400"
    }
  ];

  const solvingSteps = [
    {
      step: 1,
      title: "Clarify the Problem",
      description: "Ask questions to understand the context, objectives, and constraints. Never assume—confirm your understanding.",
      tips: ["Restate the problem in your own words", "Ask about timeline and success metrics", "Clarify any ambiguous terms"]
    },
    {
      step: 2,
      title: "Structure Your Approach",
      description: "Create a framework to organize your analysis. Use MECE principles (Mutually Exclusive, Collectively Exhaustive).",
      tips: ["Draw out your structure before diving in", "Explain your reasoning for the structure", "Be flexible to adjust as you learn more"]
    },
    {
      step: 3,
      title: "Analyze & Calculate",
      description: "Work through the key drivers systematically. Show your math and explain your assumptions.",
      tips: ["Round numbers for easier mental math", "Sanity check your calculations", "Focus on the most impactful areas first"]
    },
    {
      step: 4,
      title: "Synthesize & Recommend",
      description: "Bring together your insights into a clear recommendation with supporting evidence.",
      tips: ["Lead with your recommendation", "Support with 2-3 key reasons", "Address risks and next steps"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <BookOpen className="w-3 h-3 mr-1" />
            Case Interview Guide
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Master the Case Interview
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn proven frameworks and strategies to excel in consulting, strategy, and business case interviews.
          </p>
        </div>

        {/* How to Solve a Case */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-primary" />
            How to Solve a Case
          </h2>
          
          <div className="grid gap-6">
            {solvingSteps.map((item) => (
              <Card key={item.step} className="bg-card border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-bold text-lg">{item.step}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-muted-foreground mb-4">{item.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {item.tips.map((tip, idx) => (
                          <div key={idx} className="flex items-center gap-1 text-sm text-muted-foreground">
                            <ArrowRight className="w-3 h-3 text-primary" />
                            {tip}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Case Types */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            Types of Cases
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseTypes.map((type) => (
              <Link key={type.title} to={`/guide/example/${type.slug}`}>
                <Card className="bg-card border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 cursor-pointer h-full group">
                  <CardHeader>
                    <type.icon className={`w-8 h-8 ${type.color} mb-2`} />
                    <CardTitle className="text-foreground flex items-center justify-between">
                      {type.title}
                      <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{type.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {type.examples.map((example) => (
                        <Badge key={example} variant="outline" className="text-xs">
                          {example}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-primary font-medium flex items-center gap-1">
                      View Example Problem
                      <ArrowRight className="w-4 h-4" />
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Frameworks */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-primary" />
            Common Frameworks
          </h2>
          <p className="text-muted-foreground mb-8 max-w-3xl">
            Master these essential consulting frameworks to structure your thinking and solve any business problem systematically.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {frameworks.map((framework, index) => (
              <Accordion type="single" collapsible key={framework.name}>
                <AccordionItem 
                  value={`framework-${index}`}
                  className="bg-card border border-border rounded-lg hover:border-primary/30 transition-colors data-[state=open]:border-primary/50"
                >
                  <AccordionTrigger className="hover:no-underline px-5 py-4">
                    <div className="flex flex-col items-start text-left gap-1">
                      <h3 className="text-base font-semibold text-foreground">{framework.name}</h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5">
                    <div className="space-y-4 pt-2">
                      <p className="text-sm text-muted-foreground">{framework.description}</p>
                      
                      {/* Steps */}
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-2">Key Steps:</p>
                        <ol className="space-y-1.5">
                          {framework.steps.map((step, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Key Questions */}
                      <div className="pt-3 border-t border-border">
                        <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                          <Target className="w-4 h-4 text-primary" />
                          Key Questions
                        </p>
                        <ul className="space-y-1">
                          {framework.details.keyQuestions.map((question, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                              <ArrowRight className="w-3 h-3 text-primary mt-1 flex-shrink-0" />
                              <span>{question}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Pitfalls */}
                      <div className="pt-3 border-t border-border">
                        <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-orange-400" />
                          Common Pitfalls
                        </p>
                        <ul className="space-y-1">
                          {framework.details.commonPitfalls.map((pitfall, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-orange-400 mt-0.5 flex-shrink-0">•</span>
                              <span>{pitfall}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Use Case */}
                      <div className="pt-3 border-t border-border">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold text-foreground">When to use: </span>
                          {framework.useCase}
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Guide;
