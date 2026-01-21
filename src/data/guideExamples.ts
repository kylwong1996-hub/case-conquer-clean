export interface ExampleProblem {
  caseType: string;
  slug: string;
  title: string;
  company: string;
  industry: string;
  difficulty: string;
  situation: string;
  question: string;
  clarifyingQuestions: {
    question: string;
    answer: string;
    insight: string;
  }[];
  framework: {
    name: string;
    explanation: string;
    branches: {
      name: string;
      description: string;
      subPoints: string[];
    }[];
  };
  analysis: {
    section: string;
    content: string;
    calculation?: string;
    insight: string;
  }[];
  recommendation: {
    mainRecommendation: string;
    supportingReasons: string[];
    risks: string[];
    nextSteps: string[];
  };
  keyTakeaways: string[];
}

export const guideExamples: ExampleProblem[] = [
  {
    caseType: "Profitability",
    slug: "profitability",
    title: "TechFlow Software's Declining Margins",
    company: "TechFlow Software",
    industry: "Technology",
    difficulty: "Medium",
    situation: "TechFlow Software is a B2B SaaS company that provides project management tools to mid-sized enterprises. Over the past 18 months, their operating margins have declined from 25% to 15%, despite steady revenue growth of 12% annually. The CEO is concerned and has hired your consulting firm to diagnose the problem and recommend solutions.",
    question: "Why are TechFlow's margins declining, and what should they do about it?",
    clarifyingQuestions: [
      {
        question: "What's the breakdown between revenue growth from new customers vs. existing customers?",
        answer: "60% of growth comes from new customer acquisition, 40% from upselling existing customers.",
        insight: "High new customer acquisition can be expensive—this hints at potential CAC issues."
      },
      {
        question: "Have there been any changes to the cost structure, particularly in sales and engineering?",
        answer: "Sales headcount has doubled in 18 months. Engineering costs have increased 40% due to new product development.",
        insight: "Rapid sales expansion and heavy R&D investment are likely key cost drivers."
      },
      {
        question: "What's the customer retention rate and average contract value?",
        answer: "Retention is 85% annually. Average contract value is $50K, down from $60K two years ago.",
        insight: "Declining ACV while costs rise creates a margin squeeze."
      }
    ],
    framework: {
      name: "Profitability Framework",
      explanation: "Since this is a profitability case, we'll break down the problem into Revenue and Costs, then drill into the key drivers of each.",
      branches: [
        {
          name: "Revenue Analysis",
          description: "Understanding revenue trends and composition",
          subPoints: ["Revenue growth rate and mix", "Average contract value trends", "Customer segmentation by size/value", "Pricing strategy and discounting"]
        },
        {
          name: "Cost Analysis",
          description: "Examining fixed and variable cost drivers",
          subPoints: ["Sales & Marketing costs (CAC)", "Engineering & Product costs", "Customer Success costs", "G&A overhead"]
        },
        {
          name: "Unit Economics",
          description: "Evaluating profitability at the customer level",
          subPoints: ["Customer Acquisition Cost (CAC)", "Lifetime Value (LTV)", "CAC Payback Period", "Gross margin per customer"]
        }
      ]
    },
    analysis: [
      {
        section: "Revenue Deep Dive",
        content: "Revenue has grown from $80M to $100M (25% over 18 months), but average contract value dropped from $60K to $50K. This means they're acquiring more customers but at lower values—likely targeting smaller companies or offering heavy discounts.",
        calculation: "Previous: 1,333 customers × $60K = $80M\nCurrent: 2,000 customers × $50K = $100M\nCustomer growth: 50% | ACV decline: 17%",
        insight: "They're in a 'growth at all costs' mode, sacrificing deal quality for volume."
      },
      {
        section: "Cost Structure Analysis",
        content: "Operating costs increased from $60M to $85M. Sales & Marketing increased from $25M to $45M (80% increase). Engineering went from $20M to $28M (40% increase). Customer Success and G&A remained relatively stable.",
        calculation: "S&M as % of revenue: 25% → 45%\nEngineering as % of revenue: 25% → 28%\nTotal operating costs: 75% → 85% of revenue",
        insight: "Sales & Marketing is the primary margin killer—they're spending $45M to acquire customers that generate $20M in new revenue."
      },
      {
        section: "Unit Economics",
        content: "CAC has increased from $18K to $22.5K per customer. With an ACV of $50K, 85% retention, and 70% gross margin, LTV is approximately $120K. LTV:CAC ratio has dropped from 6.7x to 5.3x.",
        calculation: "CAC = $45M S&M / 2,000 customers = $22.5K\nLTV = $50K × 0.70 GM × (1/0.15 churn) = $233K\nBut only $120K in first 3 years (realistic payback window)",
        insight: "CAC payback is now 16 months vs. 10 months before—cash flow is under pressure."
      }
    ],
    recommendation: {
      mainRecommendation: "TechFlow should shift from volume-based growth to value-based growth, focusing on higher-value customers while optimizing sales efficiency.",
      supportingReasons: [
        "Current CAC is unsustainable—$22.5K to acquire a $50K customer with 16-month payback strains cash flow",
        "The decline in ACV suggests they're targeting the wrong customer segment or over-discounting",
        "Sales productivity has declined—more reps but less revenue per rep"
      ],
      risks: [
        "Reducing sales headcount could slow growth and hurt morale",
        "Moving upmarket requires different sales skills and longer sales cycles",
        "Competitors may capture the SMB segment they're deprioritizing"
      ],
      nextSteps: [
        "Implement customer segmentation to identify highest-value targets",
        "Restructure sales compensation to reward ACV, not just new logos",
        "Reduce sales headcount by 20% through attrition while improving rep productivity",
        "Pause engineering spend on new products; focus on features that drive upsells"
      ]
    },
    keyTakeaways: [
      "Always break down profitability into revenue and cost drivers—don't assume the obvious answer",
      "Unit economics (CAC, LTV, payback) are critical for SaaS and subscription businesses",
      "Growth can mask underlying profitability issues—look at efficiency metrics, not just absolute numbers",
      "Quantify the impact of your recommendations to show business value"
    ]
  },
  {
    caseType: "Market Entry",
    slug: "market-entry",
    title: "FreshBrew's European Expansion",
    company: "FreshBrew Coffee",
    industry: "Retail & Wholesale Trade",
    difficulty: "Medium",
    situation: "FreshBrew is a successful US-based specialty coffee chain with 500 locations across North America. They've achieved $800M in annual revenue with 12% operating margins. The board is considering expansion into Europe, specifically targeting the UK, Germany, and France as initial markets. They want to understand if this is a good opportunity and how to enter.",
    question: "Should FreshBrew expand into Europe, and if so, how should they enter?",
    clarifyingQuestions: [
      {
        question: "What's driving the decision to expand internationally vs. further US growth?",
        answer: "US market is becoming saturated in target demographics. They see 50% of revenue coming from international markets in 10 years.",
        insight: "Long-term strategic vision, but need to validate if Europe specifically is the right choice."
      },
      {
        question: "What's the competitive landscape in target European markets?",
        answer: "Strong local players like Costa (UK), Tchibo (Germany), and independent cafés in France. Starbucks has mixed success.",
        insight: "Established competition means differentiation and local adaptation are critical."
      },
      {
        question: "What's FreshBrew's key differentiator in the US market?",
        answer: "Premium single-origin beans, tech-forward ordering (app), and a 'third place' experience for remote workers.",
        insight: "Need to assess if these differentiators translate to European consumer preferences."
      }
    ],
    framework: {
      name: "Market Entry Framework",
      explanation: "We'll evaluate market attractiveness, competitive dynamics, company capabilities, and entry strategy options to make a recommendation.",
      branches: [
        {
          name: "Market Attractiveness",
          description: "Size, growth, and profitability of target markets",
          subPoints: ["Market size and growth rates", "Consumer spending on coffee", "Demographic trends", "Regulatory environment"]
        },
        {
          name: "Competitive Landscape",
          description: "Understanding existing players and barriers",
          subPoints: ["Key competitors and market share", "Barriers to entry", "Competitive response expected", "White space opportunities"]
        },
        {
          name: "Company Fit",
          description: "FreshBrew's ability to win in this market",
          subPoints: ["Transferable capabilities", "Brand recognition", "Supply chain readiness", "Management capacity"]
        },
        {
          name: "Entry Strategy",
          description: "How to enter the market",
          subPoints: ["Organic build vs. acquisition vs. partnership", "Market sequencing", "Investment required", "Timeline to profitability"]
        }
      ]
    },
    analysis: [
      {
        section: "Market Attractiveness",
        content: "The European specialty coffee market is €25B and growing at 6% annually. The UK is the largest market at €8B, followed by Germany €6B and France €5B. Coffee consumption per capita is highest in Germany (4.5 cups/day) but specialty share is highest in UK (35%).",
        calculation: "UK: €8B × 35% specialty = €2.8B addressable\nGermany: €6B × 20% specialty = €1.2B addressable\nFrance: €5B × 25% specialty = €1.25B addressable",
        insight: "UK offers the best near-term opportunity with highest specialty penetration and English language advantage."
      },
      {
        section: "Competitive Analysis",
        content: "Costa Coffee dominates UK with 2,500 locations and 25% share. Starbucks has struggled in France (closed 40% of locations) but performs well in UK. Germany has fragmented market with strong local loyalty. Consumer research shows 'local authenticity' is valued in France and Germany.",
        insight: "Direct competition with Costa in UK is expensive; France and Germany require significant localization."
      },
      {
        section: "Company Fit Assessment",
        content: "FreshBrew's tech-forward approach aligns with UK consumer preferences. Their premium positioning could work in Germany. Supply chain would need European roasting facility—current US roasting can't serve Europe efficiently. Management has no international experience.",
        insight: "Capability gaps exist in supply chain and management experience—these are addressable but require investment."
      },
      {
        section: "Entry Strategy Options",
        content: "Three options evaluated:\n1. Organic Build: Full control, high investment ($200M+), 5+ years to scale\n2. Acquisition: Buy mid-sized UK chain (e.g., Pret's coffee operations), faster but expensive ($300M+)\n3. Franchise Partnership: Partner with local operators, lower capital, faster entry, less control",
        calculation: "Organic: -$50M/year for 3 years, breakeven year 5, NPV +$80M\nAcquisition: -$300M upfront, synergies $40M/year, NPV +$120M\nFranchise: -$30M upfront, 5% royalties, NPV +$60M",
        insight: "Acquisition offers best NPV but requires significant capital and integration capability they may lack."
      }
    ],
    recommendation: {
      mainRecommendation: "FreshBrew should enter Europe starting with the UK through a hybrid model: acquire a small UK coffee chain (10-20 locations) to learn the market, then expand organically.",
      supportingReasons: [
        "UK is most attractive market due to size ($2.8B addressable), specialty coffee adoption, and language/culture fit",
        "Small acquisition ($50-80M) reduces learning curve while limiting integration risk",
        "Organic expansion post-acquisition leverages acquired knowledge without overcommitting capital"
      ],
      risks: [
        "Acquisition integration failures could damage brand and waste capital",
        "Pound sterling volatility could impact returns",
        "Costa Coffee may respond aggressively to new competitor",
        "Remote working trends post-COVID may reduce 'third place' demand"
      ],
      nextSteps: [
        "Conduct detailed consumer research in UK to validate positioning",
        "Identify 5-10 acquisition targets and begin preliminary discussions",
        "Hire European management team with local market expertise",
        "Develop UK supply chain strategy including European roasting facility"
      ]
    },
    keyTakeaways: [
      "Market entry cases require balancing market attractiveness with company capabilities",
      "Entry mode selection (organic, M&A, partnership) depends on speed, capital, control tradeoffs",
      "International expansion often fails due to underestimating localization needs",
      "Start with one market to learn before expanding—sequence markets strategically"
    ]
  },
  {
    caseType: "Mergers & Acquisitions",
    slug: "mergers-acquisitions",
    title: "MedDevice Corp's Acquisition Target",
    company: "MedDevice Corp",
    industry: "Health & Medical",
    difficulty: "Hard",
    situation: "MedDevice Corp is a $3B revenue medical device manufacturer specializing in cardiovascular devices. Their growth has slowed to 3% annually as the market matures. The CEO wants to acquire InnovateMed, a $400M revenue startup that has developed a breakthrough robotic surgery platform. InnovateMed is asking for a $1.2B valuation (3x revenue). Your team has been asked to evaluate whether this acquisition makes sense.",
    question: "Should MedDevice acquire InnovateMed at the proposed $1.2B valuation?",
    clarifyingQuestions: [
      {
        question: "What's InnovateMed's current financial performance and growth trajectory?",
        answer: "Revenue growing 40% annually, but operating at -15% margins due to heavy R&D investment. Projected to break even in 2 years.",
        insight: "High growth but not yet profitable—valuation depends heavily on future performance."
      },
      {
        question: "What's the competitive landscape for robotic surgery platforms?",
        answer: "Intuitive Surgical dominates with 80% share and $5B revenue. InnovateMed and 3 others are competing for the remaining 20%.",
        insight: "Acquiring InnovateMed gives MedDevice a player in a growing market but against a dominant incumbent."
      },
      {
        question: "What synergies are expected from the combination?",
        answer: "MedDevice's sales force could cross-sell to 5,000 hospitals. Manufacturing synergies could improve InnovateMed's margins by 10 percentage points.",
        insight: "Synergies are significant if they can be realized—execution is key."
      }
    ],
    framework: {
      name: "M&A Framework",
      explanation: "We'll evaluate strategic fit, standalone value, synergies, and risks to determine if the acquisition creates value at the proposed price.",
      branches: [
        {
          name: "Strategic Fit",
          description: "How does InnovateMed fit MedDevice's strategy?",
          subPoints: ["Market adjacency", "Technology capabilities", "Customer overlap", "Long-term strategic value"]
        },
        {
          name: "Standalone Valuation",
          description: "What is InnovateMed worth on its own?",
          subPoints: ["DCF analysis", "Comparable company analysis", "Precedent transactions", "Revenue/growth multiples"]
        },
        {
          name: "Synergy Analysis",
          description: "What value can be created through combination?",
          subPoints: ["Revenue synergies", "Cost synergies", "Time to realize synergies", "Integration costs"]
        },
        {
          name: "Risk Assessment",
          description: "What could go wrong?",
          subPoints: ["Integration risk", "Technology risk", "Regulatory risk", "Key person risk"]
        }
      ]
    },
    analysis: [
      {
        section: "Strategic Fit",
        content: "Robotic surgery is growing at 15% annually and is increasingly adopted in cardiac procedures—MedDevice's core market. InnovateMed's technology would give MedDevice a platform to sell integrated solutions (devices + robotics). 70% of InnovateMed's target hospitals are already MedDevice customers.",
        insight: "Strong strategic fit—this isn't a random diversification but a logical adjacency."
      },
      {
        section: "Standalone Valuation",
        content: "Using DCF with 12% discount rate and 25% terminal growth rate, InnovateMed's standalone value is approximately $800M-$900M. Comparable company analysis (based on Intuitive Surgical at 8x revenue for established players, adjusted down for scale) suggests $700M-$850M. The $1.2B ask implies significant synergy value or growth premium.",
        calculation: "DCF: 5-year projections with 40% → 20% growth slowdown\nYear 5 revenue: $1.1B, 10% margins = $110M operating income\nTerminal value: $110M × 12 multiple = $1.32B\nPV of cash flows + terminal: $850M\nComps: $400M × 2x (startup premium) = $800M",
        insight: "Standalone value is $800-900M. The $1.2B valuation requires $300-400M in synergy value to make sense."
      },
      {
        section: "Synergy Analysis",
        content: "Revenue synergies: MedDevice's sales force could accelerate InnovateMed's hospital penetration, adding $100M revenue by year 3 (worth ~$200M at current multiples). Cost synergies: Manufacturing consolidation could save $40M annually (worth ~$300M at 7.5x EBITDA multiple). Total synergy value: ~$500M, but integration costs estimated at $80M.",
        calculation: "Revenue synergies: $100M × 2x multiple = $200M value\nCost synergies: $40M × 7.5x = $300M value\nTotal synergies: $500M\nIntegration costs: -$80M\nNet synergy value: $420M",
        insight: "With $420M in net synergies, max price should be $800M standalone + $420M = $1.22B."
      },
      {
        section: "Risk Assessment",
        content: "Key risks include: (1) Technology risk—InnovateMed's platform is FDA-approved but has limited field experience; (2) Key person risk—3 founders hold critical IP knowledge; (3) Integration risk—MedDevice has no track record of software integration; (4) Competitive risk—Intuitive Surgical could respond with price cuts.",
        insight: "These risks suggest a 20-30% discount to theoretical max value is prudent."
      }
    ],
    recommendation: {
      mainRecommendation: "MedDevice should pursue the acquisition but negotiate the price down to $950M-$1.05B, reflecting risk-adjusted synergy value.",
      supportingReasons: [
        "Strategic fit is strong—robotic surgery is critical to MedDevice's future in cardiac care",
        "Synergy value of $420M supports a max price of ~$1.2B, but execution risks warrant a discount",
        "Waiting could allow competitors to acquire InnovateMed or let Intuitive Surgical extend its lead"
      ],
      risks: [
        "InnovateMed may reject lower offer and seek other buyers",
        "Integration could distract MedDevice management from core business",
        "Technology may not achieve expected market adoption",
        "Regulatory changes in healthcare could impact demand"
      ],
      nextSteps: [
        "Conduct detailed technical due diligence on InnovateMed's platform",
        "Negotiate retention packages for key founders (3-4 year earnouts)",
        "Develop detailed 100-day integration plan before closing",
        "Begin regulatory strategy for cross-selling to existing hospital customers"
      ]
    },
    keyTakeaways: [
      "M&A valuation requires both standalone analysis and synergy quantification",
      "Synergies must be specific and achievable—vague 'strategic value' doesn't cut it",
      "Risk assessment should inform price negotiation, not just go/no-go decisions",
      "Integration planning should begin before the deal closes"
    ]
  },
  {
    caseType: "Growth Strategy",
    slug: "growth-strategy",
    title: "EduLearn's Path to Scale",
    company: "EduLearn",
    industry: "Education",
    difficulty: "Medium",
    situation: "EduLearn is an online education platform that offers professional certification courses. They've grown to $50M in revenue with 200,000 active learners. Their investors are pushing for aggressive growth—they want EduLearn to reach $200M revenue in 3 years. Currently, growth has plateaued at 15% annually. The CEO needs a strategy to achieve 4x growth.",
    question: "How can EduLearn grow from $50M to $200M revenue in 3 years?",
    clarifyingQuestions: [
      {
        question: "What's the current customer acquisition breakdown and unit economics?",
        answer: "70% organic (SEO, word of mouth), 30% paid. CAC is $100, average revenue per user is $250/year, and retention is 40% year-over-year.",
        insight: "Low CAC but also low retention—improving retention could be a major growth lever."
      },
      {
        question: "What course categories drive the most revenue, and which are growing fastest?",
        answer: "Tech certifications (40% of revenue, growing 25%), Business/Finance (35%, growing 10%), Creative (25%, growing 5%).",
        insight: "Tech is the growth engine—doubling down here makes sense."
      },
      {
        question: "What's the competitive landscape and EduLearn's differentiation?",
        answer: "Main competitors are Coursera, Udemy, and LinkedIn Learning. EduLearn's edge is employer-recognized certifications and hands-on projects.",
        insight: "Certification value and practical skills are the differentiation to protect and expand."
      }
    ],
    framework: {
      name: "Growth Strategy Framework (Ansoff Matrix variant)",
      explanation: "We'll evaluate growth opportunities across the Ansoff Matrix: market penetration, market development, product development, and diversification.",
      branches: [
        {
          name: "Market Penetration",
          description: "Grow within existing market with existing products",
          subPoints: ["Improve conversion rates", "Increase retention", "Expand wallet share", "Optimize pricing"]
        },
        {
          name: "Market Development",
          description: "Take existing products to new markets",
          subPoints: ["Geographic expansion", "New customer segments", "B2B enterprise sales", "Channel partnerships"]
        },
        {
          name: "Product Development",
          description: "Create new products for existing customers",
          subPoints: ["New course categories", "Different learning formats", "Complementary services", "Premium tiers"]
        },
        {
          name: "Diversification",
          description: "New products for new markets",
          subPoints: ["Adjacent markets", "Platform business models", "M&A opportunities"]
        }
      ]
    },
    analysis: [
      {
        section: "Market Penetration Opportunity",
        content: "Current 40% retention is below industry average of 55%. Improving to 55% would add $7.5M annual revenue. Conversion optimization (current 3% trial-to-paid) could add $5M if improved to 4%. Total penetration opportunity: ~$15M additional revenue.",
        calculation: "Retention improvement: 200K users × $250 ARPU × (55%-40%) = $7.5M\nConversion improvement: 500K trials × $250 × (4%-3%) = $1.25M annually, compounds to ~$5M by year 3",
        insight: "Penetration alone can contribute $15M of the $150M growth needed—important but insufficient."
      },
      {
        section: "Market Development Opportunity",
        content: "B2B enterprise sales to companies buying licenses for employees is a $10B market. EduLearn has only 5% B2B mix vs. 40% for Coursera. Building enterprise sales team could capture $50M in B2B revenue by year 3. International expansion to non-English markets could add $20M (currently 10% international).",
        calculation: "B2B: 1,000 enterprise deals × $50K average contract = $50M\nInternational: Current $5M → $25M with localization (5x growth in 3 years)",
        insight: "B2B enterprise is the largest growth lever—it also improves retention as companies renew annually."
      },
      {
        section: "Product Development Opportunity",
        content: "Expanding tech certifications into AI/ML, cybersecurity, and cloud (fastest growing segments) could capture $30M. Launching a premium tier with live instruction and career coaching at 2x price could add $15M from existing users willing to pay more.",
        calculation: "New tech courses: 50K new learners × $300 ARPU × 2 retention cycles = $30M\nPremium tier: 10% of users upgrade to $500 tier = 20K × $500 = $10M + upsell pipeline",
        insight: "Product expansion in high-demand categories has strong ROI given existing content production capabilities."
      },
      {
        section: "Growth Roadmap Summary",
        content: "Combining initiatives: Base case (15% organic growth) reaches $76M by year 3. Add penetration (+$15M), B2B enterprise (+$50M), international (+$20M), new products (+$30M), premium tier (+$15M) = $206M. Some overlap expected, realistic target is $180-200M.",
        insight: "Achieving $200M requires executing across multiple vectors simultaneously—focus is critical."
      }
    ],
    recommendation: {
      mainRecommendation: "EduLearn should pursue a two-phase growth strategy: Phase 1 (Year 1) focuses on B2B enterprise sales and retention improvement; Phase 2 (Years 2-3) adds product expansion and international growth.",
      supportingReasons: [
        "B2B enterprise offers the largest revenue opportunity ($50M) with higher retention and contract values",
        "Retention improvement is high-ROI and foundational—it increases LTV for all other initiatives",
        "Phased approach manages execution risk and allows learning before international investment"
      ],
      risks: [
        "Enterprise sales requires new capabilities and longer sales cycles—may be slower than projected",
        "Premium tier could cannibalize existing revenue if not positioned correctly",
        "Expanding course catalog too quickly could dilute quality and brand",
        "Competitors with more resources may outspend in enterprise market"
      ],
      nextSteps: [
        "Hire VP of Enterprise Sales with B2B EdTech experience",
        "Invest in customer success team to improve retention from 40% to 55%",
        "Develop AI/ML certification courses in partnership with tech companies for credibility",
        "Pilot premium tier with 5,000 users before full launch"
      ]
    },
    keyTakeaways: [
      "Aggressive growth targets require multiple growth levers working simultaneously",
      "Retention improvement is often the highest-ROI growth lever but frequently overlooked",
      "B2B enterprise sales fundamentally change unit economics with higher ACV and retention",
      "Phase growth investments to manage execution risk and maintain focus"
    ]
  },
  {
    caseType: "Operations",
    slug: "operations",
    title: "FastShip Logistics Optimization",
    company: "FastShip Distribution",
    industry: "Transportation",
    difficulty: "Hard",
    situation: "FastShip is a regional logistics company serving e-commerce retailers across the Midwest. They operate 12 distribution centers and a fleet of 500 trucks. Despite growing revenue to $600M, their operating costs have risen faster than revenue, with delivery costs per package increasing 15% over two years. Customer satisfaction scores are declining due to late deliveries. The COO wants to reduce costs while improving service levels.",
    question: "How can FastShip reduce delivery costs while improving on-time delivery performance?",
    clarifyingQuestions: [
      {
        question: "What's the current breakdown of delivery costs?",
        answer: "Labor 45%, Fuel 25%, Vehicle maintenance 15%, Warehouse operations 10%, Other 5%.",
        insight: "Labor is the biggest cost driver—efficiency improvements here have the most impact."
      },
      {
        question: "What's driving the late deliveries?",
        answer: "40% are due to routing inefficiencies, 35% from warehouse delays (slow picking/packing), 25% from vehicle breakdowns.",
        insight: "Multiple root causes require a multi-pronged solution—can't fix just one thing."
      },
      {
        question: "What technology investments have been made recently?",
        answer: "Basic route optimization software exists but is underutilized. No warehouse management system—everything is manual.",
        insight: "Technology adoption gap suggests quick wins from better implementation of existing tools."
      }
    ],
    framework: {
      name: "Operations Improvement Framework",
      explanation: "We'll analyze the value chain to identify inefficiencies, then prioritize improvements by impact and feasibility.",
      branches: [
        {
          name: "Warehouse Operations",
          description: "Efficiency of inbound, storage, and outbound processes",
          subPoints: ["Receiving and put-away", "Storage optimization", "Picking and packing", "Loading efficiency"]
        },
        {
          name: "Transportation",
          description: "Fleet management and delivery execution",
          subPoints: ["Route optimization", "Fleet utilization", "Driver productivity", "Maintenance scheduling"]
        },
        {
          name: "Technology & Data",
          description: "Systems and analytics capabilities",
          subPoints: ["WMS implementation", "Route optimization software", "Predictive analytics", "Real-time tracking"]
        },
        {
          name: "Network Design",
          description: "Distribution center locations and capacity",
          subPoints: ["DC location optimization", "Capacity allocation", "Last-mile strategy", "Hub-and-spoke efficiency"]
        }
      ]
    },
    analysis: [
      {
        section: "Warehouse Operations Analysis",
        content: "Current picking process requires workers to walk an average of 4 miles per shift. Batch picking could reduce this to 2.5 miles. Implementing zone picking and wave planning could improve picks per hour from 80 to 130. This would reduce labor costs by 35% in warehouse operations.",
        calculation: "Current warehouse labor: $600M × 10% × 45% labor = $27M\nPotential savings: $27M × 35% = $9.5M annually\nImplementation cost: $2M for WMS + training",
        insight: "WMS implementation has 4-5x ROI in year one alone."
      },
      {
        section: "Transportation Efficiency",
        content: "Route optimization software is only used for 30% of routes (mostly urban). Full implementation across all routes could reduce miles driven by 18%. Additionally, dynamic routing based on real-time traffic could eliminate 25% of late deliveries caused by routing. Driver shift scheduling is suboptimal—trucks sit idle 25% of potential operating hours.",
        calculation: "Current fuel cost: $600M × 25% = $150M\nMiles reduction: 18% × $150M = $27M savings\nTruck utilization improvement: 500 trucks × 25% more runs × $200/run = $25M new capacity",
        insight: "Transportation optimization offers $27M in direct savings plus capacity for growth without adding trucks."
      },
      {
        section: "Predictive Maintenance",
        content: "25% of late deliveries are from breakdowns. Current maintenance is reactive—trucks are fixed when they break. Implementing predictive maintenance using telematics could reduce breakdowns by 60% and maintenance costs by 20%. This would also reduce late deliveries by 15 percentage points.",
        calculation: "Maintenance costs: $600M × 15% = $90M\nPredictive maintenance savings: 20% × $90M = $18M\nLate delivery reduction: 25% of lates × 60% prevention = 15% improvement",
        insight: "Predictive maintenance addresses both cost and service quality simultaneously."
      },
      {
        section: "Network Optimization",
        content: "Analysis shows 3 of 12 DCs are suboptimally located—they're within 50 miles of each other in low-demand areas. Consolidating to 10 DCs and adding 1 new DC in a high-growth area could reduce network costs by 12% while improving service levels in underserved regions.",
        calculation: "Fixed DC costs: ~$5M each × 12 = $60M\nConsolidation savings: 2 DCs × $5M = $10M\nService improvement in new location: +15% on-time for 20% of deliveries",
        insight: "Network redesign is high-impact but requires 18-24 months to implement fully."
      }
    ],
    recommendation: {
      mainRecommendation: "FastShip should implement a three-phase operations transformation: Phase 1 (immediate) deploys existing route software fully and implements predictive maintenance; Phase 2 (6-12 months) installs WMS across all DCs; Phase 3 (12-24 months) optimizes the DC network.",
      supportingReasons: [
        "Total identified savings are $64M annually ($9.5M warehouse + $27M transport + $18M maintenance + $10M network) against $600M costs (10%+ improvement)",
        "Phased approach prioritizes quick wins (route optimization, predictive maintenance) that fund larger investments",
        "On-time delivery should improve from 85% to 95%+ addressing customer satisfaction concerns"
      ],
      risks: [
        "WMS implementation could face worker resistance—change management is critical",
        "DC consolidation will require retraining and potential layoffs—union and community relations matter",
        "Technology implementations often take longer than planned—build in buffer time",
        "Fuel prices could change, affecting ROI calculations"
      ],
      nextSteps: [
        "Mandate 100% route optimization software usage within 60 days",
        "Deploy telematics on all trucks and begin predictive maintenance program",
        "Issue RFP for WMS vendors and select partner within 90 days",
        "Commission detailed network study to finalize DC consolidation plan"
      ]
    },
    keyTakeaways: [
      "Operations cases require breaking down the value chain to find specific inefficiencies",
      "Quick wins (technology utilization, process improvement) can fund larger transformations",
      "Always quantify both cost savings and service improvements—leadership cares about both",
      "Implementation phasing reduces risk and builds organizational capability progressively"
    ]
  }
];

export const getCaseTypeBySlug = (slug: string): ExampleProblem | undefined => {
  return guideExamples.find(example => example.slug === slug);
};
