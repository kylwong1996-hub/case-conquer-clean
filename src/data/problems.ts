import { Problem } from "@/components/ProblemCard";

export const jobTypes = [
  "All Job Types",
  "Consultant",
  "Marketing",
  "Sales",
  "Strategy and Operations",
  "HR",
  "Finance",
] as const;

export type JobType = typeof jobTypes[number];

export const industries = {
  "All Industries": [],
  "Health & Medical": ["Hospitals", "Pharmaceuticals", "Biotech", "Nursing", "Therapy", "Group Insurance/Benefits"],
  "Technology": ["Software Development", "IT Support", "Telecommunications", "E-commerce"],
  "Finance & Insurance": ["Banking", "Investment", "Insurance Agencies", "Real Estate"],
  "Hospitality & Tourism": ["Hotels", "Restaurants", "Food Service", "Travel"],
  "Manufacturing": ["Automotive", "Electronics", "Product Development", "Construction Materials"],
  "Retail & Wholesale Trade": ["Stores", "E-commerce", "Distribution"],
  "Transportation": ["Trucking", "Airlines", "Warehousing", "Logistics"],
  "Arts, Media & Entertainment": ["Film", "Music", "Publishing", "Design", "Sports"],
  "Education": ["Schools", "Universities", "Childcare", "Educational Services"],
  "Public Services": ["Government", "Law Enforcement", "Emergency Response", "Utilities"],
};

export type Industry = keyof typeof industries;

// Helper to generate problems - 15 per Industry x JobType combination
const generateProblems = (): Problem[] => {
  const industries_list: Industry[] = [
    "Health & Medical",
    "Technology", 
    "Finance & Insurance",
    "Hospitality & Tourism",
    "Manufacturing",
    "Retail & Wholesale Trade",
    "Transportation",
    "Arts, Media & Entertainment",
    "Education",
    "Public Services"
  ];

  const jobTypes_list: JobType[] = [
    "Consultant",
    "Marketing",
    "Sales",
    "Strategy and Operations",
    "HR",
    "Finance"
  ];

  const categories = ["Market Entry", "Profitability", "Market Sizing", "M&A", "Growth Strategy", "Operations"];
  const difficulties: ("Easy" | "Medium" | "Hard")[] = ["Easy", "Medium", "Hard"];
  const companies = ["McKinsey", "BCG", "Bain", "Deloitte", undefined];

  // Problem titles by industry and job type
  const problemTitles: Record<string, Record<string, string[]>> = {
    "Health & Medical": {
      "Consultant": [
        "Healthcare Digital Transformation Strategy",
        "Hospital Network Optimization",
        "Telemedicine Platform Implementation",
        "Healthcare AI Adoption Roadmap",
        "Patient Experience Redesign",
        "Medical Device Market Entry",
        "Pharmaceutical Pricing Strategy",
        "Healthcare Analytics Implementation",
        "Clinical Pathway Optimization",
        "Health System Merger Integration",
        "Healthcare Population Health Management",
        "Medical Center Expansion Planning",
        "Healthcare Value-Based Care Transition",
        "Ambulatory Surgery Center Strategy",
        "Healthcare Interoperability Roadmap"
      ],
      "Marketing": [
        "Pharmaceutical Brand Launch",
        "Hospital Marketing Campaign",
        "Medical Device B2B Marketing",
        "Telehealth Awareness Campaign",
        "Patient Acquisition Strategy",
        "Healthcare Content Marketing",
        "Physician Outreach Program",
        "Medical Tourism Marketing",
        "Healthcare Social Media Strategy",
        "Wellness Program Branding",
        "Clinical Trial Recruitment Marketing",
        "Healthcare App User Acquisition",
        "Medical Practice Reputation Management",
        "Healthcare Influencer Partnership",
        "Patient Education Content Strategy"
      ],
      "Sales": [
        "Medical Device Sales Transformation",
        "Pharmaceutical Rep Optimization",
        "Healthcare SaaS Sales Strategy",
        "Hospital Equipment Sales",
        "Diagnostic Solutions Sales",
        "Healthcare Services Cross-Selling",
        "Medical Supply Distribution Sales",
        "Telehealth Platform Sales",
        "Healthcare IT Solutions Sales",
        "Laboratory Services Sales Strategy",
        "Healthcare Staffing Solutions Sales",
        "Medical Imaging Equipment Sales",
        "Healthcare Consulting Services Sales",
        "Pharmacy Benefit Management Sales",
        "Remote Patient Monitoring Sales"
      ],
      "Strategy and Operations": [
        "Hospital Bed Utilization Optimization",
        "Emergency Department Flow",
        "Surgical Suite Scheduling",
        "Patient Discharge Process",
        "Medical Supply Chain Optimization",
        "Healthcare Workforce Planning",
        "Clinical Laboratory Operations",
        "Pharmacy Operations Efficiency",
        "Medical Records Digitization",
        "Healthcare Quality Improvement",
        "Outpatient Clinic Workflow Redesign",
        "Medical Equipment Maintenance Strategy",
        "Healthcare Call Center Optimization",
        "Patient Transport Logistics",
        "Healthcare Inventory Management"
      ],
      "HR": [
        "Physician Retention Strategy",
        "Nursing Workforce Development",
        "Healthcare Talent Acquisition",
        "Medical Staff Scheduling",
        "Healthcare Employee Engagement",
        "Clinical Leadership Development",
        "Healthcare DEI Initiative",
        "Medical Residency Program Design",
        "Healthcare Burnout Prevention",
        "Allied Health Recruitment",
        "Healthcare Executive Compensation",
        "Medical Fellowship Program Design",
        "Healthcare Succession Planning",
        "Clinical Staff Performance Management",
        "Healthcare Remote Work Policy"
      ],
      "Finance": [
        "Hospital Financial Turnaround",
        "Healthcare M&A Due Diligence",
        "Medical Practice Valuation",
        "Healthcare Revenue Cycle",
        "Pharmaceutical R&D Investment",
        "Healthcare Cost Reduction",
        "Medical Equipment Financing",
        "Healthcare Payer Negotiations",
        "Clinical Trial Budgeting",
        "Healthcare Capital Planning",
        "Healthcare Debt Restructuring",
        "Medical Group Buy-In Analysis",
        "Healthcare Contract Renegotiation",
        "Pharmacy 340B Program Optimization",
        "Healthcare Value Analysis Committee"
      ]
    },
    "Technology": {
      "Consultant": [
        "Cloud Migration Strategy",
        "Digital Transformation Roadmap",
        "AI Implementation Planning",
        "Cybersecurity Assessment",
        "Tech Stack Modernization",
        "Data Strategy Development",
        "Platform Architecture Design",
        "DevOps Transformation",
        "Technology Due Diligence",
        "IT Operating Model Redesign",
        "Edge Computing Strategy",
        "Blockchain Implementation Advisory",
        "Tech Startup Advisory",
        "API Strategy Development",
        "Zero Trust Security Framework"
      ],
      "Marketing": [
        "SaaS Product Launch",
        "Developer Marketing Strategy",
        "Tech Brand Repositioning",
        "B2B Tech Content Marketing",
        "Product-Led Growth Marketing",
        "Tech Conference Marketing",
        "Developer Community Building",
        "Tech Thought Leadership",
        "Enterprise Software Marketing",
        "Tech Startup Go-to-Market",
        "Open Source Marketing Strategy",
        "Tech Partner Co-Marketing",
        "Developer Advocacy Program",
        "Tech Webinar Strategy",
        "Software Review Site Optimization"
      ],
      "Sales": [
        "Enterprise Software Sales",
        "SaaS Sales Process Optimization",
        "Tech Partner Channel Strategy",
        "Cloud Services Sales",
        "Cybersecurity Solutions Sales",
        "Data Platform Sales Strategy",
        "AI/ML Solutions Sales",
        "Tech Account Management",
        "SMB Tech Sales Scaling",
        "Technology Upselling Strategy",
        "IT Managed Services Sales",
        "Tech Reseller Strategy",
        "Developer Tools Sales",
        "Tech RFP Response Optimization",
        "Software Renewal Strategy"
      ],
      "Strategy and Operations": [
        "Software Development Efficiency",
        "IT Service Desk Optimization",
        "Cloud Cost Optimization",
        "Tech Support Operations",
        "Data Center Operations",
        "Agile Transformation",
        "Technology Vendor Management",
        "IT Asset Management",
        "Software Release Management",
        "Tech Operations Automation",
        "Incident Management Process",
        "Tech Documentation Strategy",
        "QA Process Optimization",
        "Tech Onboarding Process",
        "Platform Reliability Engineering"
      ],
      "HR": [
        "Tech Talent Acquisition",
        "Developer Experience Design",
        "Remote Engineering Team",
        "Tech Skills Development",
        "Engineering Manager Training",
        "Tech Diversity Initiative",
        "Software Engineer Retention",
        "Tech Compensation Strategy",
        "Technical Career Paths",
        "Tech Culture Building",
        "Tech Internship Program",
        "Engineering Performance Reviews",
        "Tech Contractor Management",
        "Tech Employee Referral Program",
        "Engineering Onboarding Process"
      ],
      "Finance": [
        "Tech Startup Valuation",
        "SaaS Metrics Optimization",
        "Tech M&A Analysis",
        "Software Revenue Recognition",
        "Tech Company IPO Readiness",
        "Cloud Economics Modeling",
        "Tech Budget Planning",
        "Software Licensing Strategy",
        "Tech Investment Analysis",
        "R&D Tax Credit Optimization",
        "Tech Vendor Cost Negotiation",
        "SaaS Churn Financial Impact",
        "Tech Infrastructure ROI",
        "Software Capitalization Policy",
        "Tech Revenue Forecasting"
      ]
    },
    "Finance & Insurance": {
      "Consultant": [
        "Banking Digital Transformation",
        "Insurance Product Innovation",
        "Wealth Management Strategy",
        "Fintech Partnership Strategy",
        "Regulatory Compliance Roadmap",
        "Banking Customer Experience",
        "Insurance Distribution Strategy",
        "Investment Platform Design",
        "Financial Services M&A",
        "Credit Risk Management",
        "Open Banking Strategy",
        "Insurance Claims Modernization",
        "Banking ESG Integration",
        "Embedded Finance Strategy",
        "RegTech Implementation Advisory"
      ],
      "Marketing": [
        "Banking App Marketing",
        "Insurance Brand Campaign",
        "Wealth Management Marketing",
        "Fintech Product Launch",
        "Financial Literacy Campaign",
        "Insurance Lead Generation",
        "Banking Customer Acquisition",
        "Investment Services Marketing",
        "Credit Card Marketing Strategy",
        "Mortgage Marketing Optimization",
        "Banking Rewards Program Marketing",
        "Insurance Referral Program",
        "Investment App Social Marketing",
        "Banking Community Engagement",
        "Insurance Digital Advertising"
      ],
      "Sales": [
        "Insurance Agency Sales",
        "Banking Product Cross-Sell",
        "Investment Advisory Sales",
        "Commercial Lending Sales",
        "Insurance Broker Management",
        "Wealth Management Client Development",
        "Banking Business Development",
        "Financial Services Partnerships",
        "Insurance Renewal Strategy",
        "Banking Sales Transformation",
        "Private Banking Client Acquisition",
        "Business Insurance Sales",
        "Investment Product Distribution",
        "Banking Merchant Services Sales",
        "Insurance Territory Management"
      ],
      "Strategy and Operations": [
        "Insurance Claims Optimization",
        "Banking Branch Operations",
        "Investment Operations Efficiency",
        "Loan Processing Automation",
        "Insurance Underwriting Process",
        "Banking Call Center Operations",
        "Fraud Detection Operations",
        "Payment Processing Optimization",
        "Account Opening Digitization",
        "Financial Reporting Automation",
        "Banking Compliance Operations",
        "Insurance Policy Administration",
        "Investment Back Office Optimization",
        "Banking Treasury Operations",
        "Insurance Document Management"
      ],
      "HR": [
        "Bank Employee Experience",
        "Insurance Talent Development",
        "Financial Advisor Recruitment",
        "Banking Culture Transformation",
        "Insurance Sales Training",
        "Financial Services DEI",
        "Bank Workforce Planning",
        "Insurance Leadership Development",
        "Financial Services Retention",
        "Banking Skills Development",
        "Financial Analyst Training Program",
        "Insurance Adjuster Recruitment",
        "Banking Branch Manager Development",
        "Investment Analyst Career Path",
        "Financial Services Compliance Training"
      ],
      "Finance": [
        "Bank Profitability Analysis",
        "Insurance Reserve Optimization",
        "Investment Portfolio Strategy",
        "Credit Risk Modeling",
        "Insurance Pricing Strategy",
        "Banking Capital Management",
        "Wealth Management Fee Analysis",
        "Insurance Reinsurance Strategy",
        "Bank Cost Reduction",
        "Financial Services Budgeting",
        "Insurance Loss Ratio Analysis",
        "Banking NIM Optimization",
        "Investment Fee Structure Design",
        "Credit Card Portfolio Analysis",
        "Insurance Catastrophe Modeling"
      ]
    },
    "Hospitality & Tourism": {
      "Consultant": [
        "Hotel Chain Expansion Strategy",
        "Restaurant Concept Development",
        "Travel Platform Strategy",
        "Resort Brand Positioning",
        "Hospitality Digital Transformation",
        "Tourism Destination Development",
        "Hotel Revenue Management",
        "Restaurant Franchise Strategy",
        "Travel Experience Design",
        "Hospitality Sustainability Strategy",
        "Boutique Hotel Strategy",
        "Food Delivery Platform Strategy",
        "Casino Resort Optimization",
        "Cruise Line Advisory",
        "Vacation Rental Market Entry"
      ],
      "Marketing": [
        "Hotel Loyalty Program Marketing",
        "Restaurant Brand Campaign",
        "Destination Marketing Strategy",
        "Travel Influencer Marketing",
        "Hospitality Social Media",
        "Hotel Direct Booking Campaign",
        "Restaurant Local Marketing",
        "Tourism Content Marketing",
        "Resort Package Marketing",
        "Travel App Marketing",
        "Restaurant Delivery App Marketing",
        "Hotel Group Booking Marketing",
        "Tourism Partnership Marketing",
        "Restaurant Review Management",
        "Hospitality Email Marketing"
      ],
      "Sales": [
        "Hotel Group Sales Strategy",
        "Restaurant Catering Sales",
        "Travel Agency Partnerships",
        "Corporate Travel Sales",
        "Event Venue Sales",
        "Hotel OTA Strategy",
        "Restaurant Delivery Partnerships",
        "Tourism Package Sales",
        "Resort Membership Sales",
        "Travel Corporate Accounts",
        "Convention Center Sales",
        "Restaurant Private Event Sales",
        "Hospitality Vendor Partnerships",
        "Hotel Meeting Space Sales",
        "Tourism B2B Sales"
      ],
      "Strategy and Operations": [
        "Hotel Operations Optimization",
        "Restaurant Kitchen Efficiency",
        "Travel Booking Platform Operations",
        "Resort Amenity Management",
        "Hotel Housekeeping Optimization",
        "Restaurant Inventory Management",
        "Tourism Operations Digitization",
        "Hotel Check-in Automation",
        "Restaurant Table Management",
        "Travel Customer Service Operations",
        "Hotel Concierge Service Design",
        "Restaurant Supply Chain Management",
        "Resort Spa Operations",
        "Hotel Energy Management",
        "Restaurant Quality Control"
      ],
      "HR": [
        "Hotel Seasonal Staffing",
        "Restaurant Workforce Retention",
        "Tourism Industry Training",
        "Hospitality Career Development",
        "Hotel Management Development",
        "Restaurant Team Building",
        "Travel Agent Training",
        "Hospitality DEI Initiative",
        "Resort Employee Experience",
        "Restaurant Manager Training",
        "Hotel Front Desk Training",
        "Chef Recruitment Strategy",
        "Hospitality Internship Program",
        "Resort Entertainment Staff",
        "Restaurant Server Excellence Program"
      ],
      "Finance": [
        "Hotel Revenue Optimization",
        "Restaurant Profitability Analysis",
        "Travel Platform Valuation",
        "Resort Capital Planning",
        "Hotel Acquisition Analysis",
        "Restaurant Cost Management",
        "Tourism Investment Strategy",
        "Hospitality Working Capital",
        "Hotel Lease Negotiations",
        "Restaurant Franchise Economics",
        "Hotel REVPAR Optimization",
        "Restaurant Break-Even Analysis",
        "Tourism Seasonal Cash Flow",
        "Resort Amenity ROI",
        "Hospitality Labor Cost Management"
      ]
    },
    "Manufacturing": {
      "Consultant": [
        "Smart Factory Implementation",
        "Manufacturing Digital Transformation",
        "Supply Chain Resilience Strategy",
        "Industry 4.0 Roadmap",
        "Lean Manufacturing Assessment",
        "Manufacturing Sustainability Strategy",
        "Product Development Strategy",
        "Manufacturing M&A Integration",
        "Global Manufacturing Footprint",
        "Quality Management System Design",
        "Additive Manufacturing Strategy",
        "Manufacturing Reshoring Analysis",
        "Circular Economy Implementation",
        "Manufacturing IoT Integration",
        "Production Capacity Planning"
      ],
      "Marketing": [
        "Industrial Brand Building",
        "B2B Manufacturing Marketing",
        "Product Launch Marketing",
        "Trade Show Strategy",
        "Industrial Content Marketing",
        "Manufacturing Thought Leadership",
        "OEM Marketing Strategy",
        "Industrial Digital Marketing",
        "Manufacturing Case Studies",
        "Product Catalog Optimization",
        "Industrial Video Marketing",
        "Manufacturing LinkedIn Strategy",
        "Technical Documentation Marketing",
        "Industrial SEO Strategy",
        "Manufacturing Email Campaigns"
      ],
      "Sales": [
        "Industrial Equipment Sales",
        "Manufacturing Rep Optimization",
        "B2B Distribution Strategy",
        "OEM Account Management",
        "Industrial Solutions Selling",
        "Manufacturing E-commerce",
        "Distributor Network Strategy",
        "Industrial Inside Sales",
        "Manufacturing Pricing Strategy",
        "Aftermarket Parts Sales",
        "Industrial Spare Parts Sales",
        "Manufacturing Service Contracts",
        "Industrial RFQ Process",
        "Manufacturing Key Account Strategy",
        "Industrial Technical Sales"
      ],
      "Strategy and Operations": [
        "Manufacturing Cost Reduction",
        "Production Planning Optimization",
        "Quality Control Enhancement",
        "Manufacturing Automation",
        "Plant Layout Optimization",
        "Inventory Management",
        "Manufacturing Maintenance",
        "Production Scheduling",
        "Supply Chain Operations",
        "Manufacturing Safety Program",
        "Predictive Maintenance Implementation",
        "Manufacturing MES Implementation",
        "Shop Floor Digitization",
        "Manufacturing Waste Reduction",
        "Production Line Balancing"
      ],
      "HR": [
        "Factory Workforce Development",
        "Manufacturing Recruitment",
        "Plant Leadership Development",
        "Manufacturing Skills Training",
        "Factory Employee Engagement",
        "Manufacturing Safety Culture",
        "Shift Scheduling Optimization",
        "Manufacturing Retention Strategy",
        "Technical Skills Program",
        "Manufacturing Diversity Initiative",
        "Apprenticeship Program Design",
        "Manufacturing Supervisor Training",
        "Plant Worker Upskilling",
        "Manufacturing Labor Relations",
        "Factory Ergonomics Program"
      ],
      "Finance": [
        "Manufacturing Profitability",
        "Capital Equipment Investment",
        "Manufacturing Cost Accounting",
        "Plant ROI Analysis",
        "Manufacturing Working Capital",
        "Product Line Profitability",
        "Manufacturing M&A Analysis",
        "Factory Automation ROI",
        "Manufacturing Budget Planning",
        "Supply Chain Financing",
        "Manufacturing Overhead Allocation",
        "Plant Closure Cost Analysis",
        "Manufacturing Inventory Valuation",
        "Industrial Equipment Leasing",
        "Manufacturing Tariff Impact Analysis"
      ]
    },
    "Retail & Wholesale Trade": {
      "Consultant": [
        "Omnichannel Retail Strategy",
        "E-commerce Transformation",
        "Retail Store Network Optimization",
        "Retail Customer Experience",
        "Wholesale Distribution Strategy",
        "Retail Brand Strategy",
        "Category Management Strategy",
        "Retail Technology Roadmap",
        "Merchandise Planning Strategy",
        "Retail Expansion Strategy",
        "Direct-to-Consumer Strategy",
        "Retail Private Label Strategy",
        "Pop-Up Store Strategy",
        "Retail Subscription Model",
        "Retail Data Analytics Strategy"
      ],
      "Marketing": [
        "Retail Loyalty Program",
        "E-commerce Marketing Strategy",
        "Retail Brand Campaign",
        "Wholesale Marketing Strategy",
        "Retail Social Commerce",
        "Store Opening Marketing",
        "Retail Personalization",
        "Seasonal Marketing Campaign",
        "Retail Email Marketing",
        "Wholesale Trade Marketing",
        "Retail SMS Marketing",
        "Retail Influencer Collaboration",
        "Store Event Marketing",
        "Retail Mobile App Marketing",
        "Retail Customer Segmentation"
      ],
      "Sales": [
        "Retail Sales Training",
        "E-commerce Conversion Optimization",
        "Wholesale Account Management",
        "Retail Clienteling Strategy",
        "Distribution Sales Strategy",
        "Retail Upselling Program",
        "B2B Wholesale Sales",
        "Retail Partnership Sales",
        "E-commerce Marketplace Sales",
        "Retail Franchise Sales",
        "Retail Pop-Up Sales Strategy",
        "Wholesale Pricing Negotiations",
        "Retail Gift Card Sales",
        "Retail Corporate Sales",
        "E-commerce Chat Sales"
      ],
      "Strategy and Operations": [
        "Retail Inventory Optimization",
        "E-commerce Fulfillment",
        "Store Operations Efficiency",
        "Retail Supply Chain",
        "Wholesale Warehouse Operations",
        "Retail Loss Prevention",
        "E-commerce Returns Management",
        "Store Labor Optimization",
        "Retail Space Planning",
        "Distribution Center Operations",
        "Retail POS System Optimization",
        "Buy-Online-Pickup-In-Store Operations",
        "Retail Pricing Operations",
        "Store Maintenance Operations",
        "Retail Customer Service Operations"
      ],
      "HR": [
        "Retail Employee Engagement",
        "Store Manager Development",
        "Retail Seasonal Hiring",
        "Retail Training Program",
        "Warehouse Workforce Planning",
        "Retail Retention Strategy",
        "Store Team Culture",
        "Retail DEI Initiative",
        "Retail Career Pathways",
        "Wholesale Employee Development",
        "Retail Associate Scheduling",
        "Store Leadership Pipeline",
        "Retail Performance Incentives",
        "Retail Employee Recognition",
        "Retail Onboarding Excellence"
      ],
      "Finance": [
        "Retail Profitability Analysis",
        "E-commerce Unit Economics",
        "Store Portfolio Optimization",
        "Retail Working Capital",
        "Wholesale Margin Analysis",
        "Retail M&A Due Diligence",
        "Inventory Financing Strategy",
        "Retail Lease Analysis",
        "E-commerce Investment",
        "Retail Cost Reduction",
        "Retail Markdown Optimization",
        "Store P&L Management",
        "Retail Vendor Terms Negotiation",
        "Retail Shrinkage Analysis",
        "Retail Capital Expenditure Planning"
      ]
    },
    "Transportation": {
      "Consultant": [
        "Logistics Network Optimization",
        "Transportation Digital Transformation",
        "Fleet Management Strategy",
        "Last-Mile Delivery Strategy",
        "Airline Route Optimization",
        "Freight Strategy Development",
        "Transportation Sustainability",
        "Supply Chain Consulting",
        "Mobility Strategy",
        "Transportation M&A Advisory",
        "Autonomous Vehicle Strategy",
        "Cold Chain Logistics Advisory",
        "Port Operations Consulting",
        "Rail Freight Strategy",
        "Electric Fleet Transition"
      ],
      "Marketing": [
        "Logistics Brand Building",
        "Transportation Service Marketing",
        "Airline Marketing Strategy",
        "Freight Marketing Campaign",
        "Last-Mile Service Marketing",
        "Transportation B2B Marketing",
        "Shipping Services Marketing",
        "Fleet Services Marketing",
        "Logistics Thought Leadership",
        "Transportation Digital Marketing",
        "Trucking Company Branding",
        "Airline Loyalty Marketing",
        "Logistics Customer Testimonials",
        "Transportation Trade Show Strategy",
        "Freight Rate Marketing"
      ],
      "Sales": [
        "Freight Carrier Sales",
        "Logistics Solutions Sales",
        "Transportation Account Management",
        "Airline Corporate Sales",
        "Trucking Sales Strategy",
        "Warehouse Services Sales",
        "Shipping Contract Negotiations",
        "Fleet Services Sales",
        "Transportation Partnerships",
        "Logistics Cross-Selling",
        "Intermodal Sales Strategy",
        "Logistics Technology Sales",
        "Transportation Broker Sales",
        "Fleet Telematics Sales",
        "Warehousing Space Sales"
      ],
      "Strategy and Operations": [
        "Airline Operations Optimization",
        "Warehouse Operations Efficiency",
        "Fleet Maintenance Optimization",
        "Transportation Scheduling",
        "Last-Mile Operations",
        "Freight Terminal Operations",
        "Driver Scheduling Optimization",
        "Logistics Technology Implementation",
        "Transportation Safety Program",
        "Route Optimization",
        "Cross-Docking Operations",
        "Fleet Fuel Management",
        "Transportation Compliance Operations",
        "Logistics Visibility Implementation",
        "Carrier Management Operations"
      ],
      "HR": [
        "Driver Recruitment Strategy",
        "Airline Crew Scheduling",
        "Transportation Safety Training",
        "Logistics Workforce Planning",
        "Fleet Driver Retention",
        "Transportation Leadership Development",
        "Warehouse Employee Engagement",
        "Airline Talent Management",
        "Transportation DEI Initiative",
        "Driver Training Program",
        "Logistics Manager Development",
        "Transportation Dispatcher Training",
        "Fleet Driver Wellness Program",
        "Warehouse Shift Management",
        "Transportation Compliance Training"
      ],
      "Finance": [
        "Fleet Financing Strategy",
        "Transportation Profitability",
        "Airline Revenue Management",
        "Logistics Cost Reduction",
        "Trucking Investment Analysis",
        "Transportation M&A Analysis",
        "Fleet Leasing vs Buying",
        "Fuel Cost Management",
        "Transportation Capital Planning",
        "Warehouse ROI Analysis",
        "Freight Rate Optimization",
        "Transportation Insurance Cost",
        "Logistics Network Cost Modeling",
        "Fleet Depreciation Strategy",
        "Transportation Contract Pricing"
      ]
    },
    "Arts, Media & Entertainment": {
      "Consultant": [
        "Media Digital Transformation",
        "Entertainment Industry Strategy",
        "Streaming Platform Strategy",
        "Music Industry Advisory",
        "Film Studio Strategy",
        "Sports Franchise Consulting",
        "Publishing Strategy",
        "Gaming Industry Analysis",
        "Entertainment M&A Advisory",
        "Content Strategy Development",
        "Podcast Network Strategy",
        "Esports Organization Advisory",
        "NFT and Digital Collectibles Strategy",
        "Live Entertainment Venue Strategy",
        "Creator Economy Platform Strategy"
      ],
      "Marketing": [
        "Film Marketing Campaign",
        "Music Artist Marketing",
        "Streaming Service Marketing",
        "Sports Team Marketing",
        "Publishing Marketing Strategy",
        "Entertainment Influencer Marketing",
        "Gaming Marketing Strategy",
        "Media Brand Building",
        "Event Marketing Strategy",
        "Content Marketing for Entertainment",
        "Podcast Promotion Strategy",
        "Album Launch Marketing",
        "Sports Merchandise Marketing",
        "Theater Production Marketing",
        "Gaming Esports Marketing"
      ],
      "Sales": [
        "Media Advertising Sales",
        "Entertainment Sponsorship Sales",
        "Music Licensing Sales",
        "Film Distribution Sales",
        "Sports Sponsorship Strategy",
        "Publishing Rights Sales",
        "Gaming Partnership Sales",
        "Media Subscription Sales",
        "Event Ticket Sales Strategy",
        "Content Licensing Sales",
        "Sports Broadcasting Rights Sales",
        "Music Merchandise Sales",
        "Film Co-Production Sales",
        "Gaming In-App Purchase Strategy",
        "Entertainment VIP Experience Sales"
      ],
      "Strategy and Operations": [
        "Film Production Operations",
        "Streaming Platform Operations",
        "Music Venue Operations",
        "Sports Event Operations",
        "Publishing Production Workflow",
        "Entertainment Venue Management",
        "Gaming Studio Operations",
        "Media Content Operations",
        "Live Event Production",
        "Broadcast Operations Optimization",
        "Content Moderation Operations",
        "Music Festival Operations",
        "Sports Stadium Operations",
        "Publishing Digital Workflow",
        "Entertainment Ticketing Operations"
      ],
      "HR": [
        "Entertainment Talent Management",
        "Film Crew Development",
        "Music Industry HR Strategy",
        "Sports Team HR",
        "Publishing Workforce Planning",
        "Entertainment DEI Initiative",
        "Gaming Talent Acquisition",
        "Media Leadership Development",
        "Creative Workforce Retention",
        "Entertainment Skills Training",
        "Sports Athlete Development",
        "Film Production Staffing",
        "Music Tour Crew Management",
        "Gaming Developer Culture",
        "Entertainment Freelancer Management"
      ],
      "Finance": [
        "Film Financing Strategy",
        "Entertainment Valuation",
        "Music Royalty Analysis",
        "Sports Franchise Valuation",
        "Publishing Financial Planning",
        "Streaming Economics",
        "Gaming Investment Analysis",
        "Media M&A Due Diligence",
        "Entertainment Budget Management",
        "Content Investment ROI",
        "Sports Stadium Financing",
        "Music Catalog Valuation",
        "Film Tax Credit Optimization",
        "Gaming Monetization Analysis",
        "Entertainment Insurance Planning"
      ]
    },
    "Education": {
      "Consultant": [
        "University Strategy Development",
        "EdTech Platform Strategy",
        "K-12 District Consulting",
        "Online Learning Strategy",
        "Higher Education Transformation",
        "Education Technology Assessment",
        "Student Success Strategy",
        "Curriculum Development Strategy",
        "Education Partnership Strategy",
        "Academic Program Portfolio",
        "Vocational Training Strategy",
        "Education Accreditation Advisory",
        "Learning Management System Strategy",
        "Education Accessibility Consulting",
        "STEM Program Development"
      ],
      "Marketing": [
        "University Enrollment Marketing",
        "EdTech Product Marketing",
        "School District Marketing",
        "Online Course Marketing",
        "Student Recruitment Campaign",
        "Education Brand Building",
        "Alumni Engagement Marketing",
        "Educational Content Marketing",
        "School Open House Marketing",
        "Higher Education Advertising",
        "Graduate Program Marketing",
        "Education Social Media Strategy",
        "Student Testimonial Marketing",
        "Education Webinar Marketing",
        "School Athletics Marketing"
      ],
      "Sales": [
        "EdTech Sales Strategy",
        "University Partnerships Sales",
        "Educational Services Sales",
        "Corporate Training Sales",
        "K-12 Technology Sales",
        "Higher Education Solutions Sales",
        "Online Learning Platform Sales",
        "Educational Publishing Sales",
        "School District Account Management",
        "Education Consulting Sales",
        "Curriculum Sales Strategy",
        "Education Assessment Sales",
        "Student Information System Sales",
        "Education Furniture Sales",
        "Tutoring Services Sales"
      ],
      "Strategy and Operations": [
        "University Operations Optimization",
        "School District Efficiency",
        "Online Learning Operations",
        "Student Services Operations",
        "Educational Facilities Management",
        "Academic Scheduling Optimization",
        "Admissions Process Redesign",
        "Campus Operations",
        "Library Services Optimization",
        "Education Technology Operations",
        "Student Transportation Operations",
        "Campus Dining Operations",
        "Education IT Support Operations",
        "School Safety Operations",
        "Student Housing Operations"
      ],
      "HR": [
        "Teacher Recruitment Strategy",
        "Faculty Development Program",
        "Education Staff Retention",
        "School Leadership Development",
        "University Workforce Planning",
        "Education DEI Initiative",
        "Teacher Training Program",
        "Academic Staff Engagement",
        "Education Compensation Strategy",
        "School Culture Building",
        "Professor Tenure Process",
        "School Counselor Development",
        "Education Administrator Training",
        "Teacher Mentorship Program",
        "Education Staff Wellness"
      ],
      "Finance": [
        "University Financial Planning",
        "Education Budget Optimization",
        "School District Financing",
        "EdTech Investment Analysis",
        "Higher Education Endowment",
        "Tuition Pricing Strategy",
        "Education Grant Management",
        "School Capital Planning",
        "Education Cost Analysis",
        "Online Program Economics",
        "Student Financial Aid Strategy",
        "University Revenue Diversification",
        "Education Bond Financing",
        "School Fundraising Strategy",
        "Education Cost-Per-Student Analysis"
      ]
    },
    "Public Services": {
      "Consultant": [
        "Government Digital Transformation",
        "Public Sector Strategy",
        "Emergency Services Optimization",
        "Utilities Strategy Development",
        "Municipal Services Consulting",
        "Government Technology Assessment",
        "Public Safety Strategy",
        "Regulatory Agency Consulting",
        "Government Process Redesign",
        "Public Sector M&A Advisory",
        "Smart City Initiative",
        "Government Shared Services",
        "Public Housing Strategy",
        "Government Cybersecurity Advisory",
        "Public Health System Strategy"
      ],
      "Marketing": [
        "Government Services Marketing",
        "Public Utility Brand Campaign",
        "Emergency Services Awareness",
        "Municipal Program Marketing",
        "Public Health Campaign",
        "Government Recruitment Marketing",
        "Utility Customer Engagement",
        "Public Transit Marketing",
        "Government Digital Outreach",
        "Community Engagement Campaign",
        "Voter Registration Campaign",
        "Government App Promotion",
        "Public Safety Awareness",
        "Environmental Initiative Marketing",
        "Government Transparency Campaign"
      ],
      "Sales": [
        "Government Contract Sales",
        "Public Sector Solutions Sales",
        "Utility Services Sales",
        "Municipal Technology Sales",
        "Government Partnerships",
        "Public Safety Equipment Sales",
        "Utilities Business Development",
        "Government Consulting Sales",
        "Public Sector Account Management",
        "Municipal Services Sales",
        "Government IT Sales",
        "Public Works Equipment Sales",
        "Government Training Services Sales",
        "Utilities Smart Meter Sales",
        "Government RFP Strategy"
      ],
      "Strategy and Operations": [
        "Government IT Modernization",
        "Public Transit Operations",
        "Emergency Response Optimization",
        "Utilities Operations Efficiency",
        "Municipal Services Delivery",
        "Government Contact Center",
        "Public Records Management",
        "Utilities Network Operations",
        "Government Procurement Process",
        "Public Works Operations",
        "Government Permit Processing",
        "Utilities Outage Management",
        "Public Safety Dispatch Operations",
        "Government Fleet Management",
        "Municipal Waste Operations"
      ],
      "HR": [
        "Government Workforce Modernization",
        "Public Sector Recruitment",
        "Emergency Services Training",
        "Municipal Employee Development",
        "Government DEI Initiative",
        "Public Sector Retention",
        "Utilities Workforce Planning",
        "Government Leadership Development",
        "Public Safety Training Program",
        "Civil Service Reform",
        "Government Succession Planning",
        "Public Sector Performance Management",
        "First Responder Wellness",
        "Government Intern Program",
        "Municipal Union Relations"
      ],
      "Finance": [
        "Government Budget Optimization",
        "Public Sector Cost Reduction",
        "Utilities Financial Planning",
        "Municipal Bond Strategy",
        "Government Audit Preparation",
        "Public Sector Pension Analysis",
        "Utilities Rate Design",
        "Government Grant Management",
        "Municipal Capital Planning",
        "Public Infrastructure Investment",
        "Government Asset Management",
        "Public Sector Revenue Optimization",
        "Utilities Capital Investment",
        "Government Procurement Savings",
        "Public Sector Financial Transparency"
      ]
    }
  };

  const problems: Problem[] = [];
  let id = 1;

  for (const industry of industries_list) {
    for (const jobType of jobTypes_list) {
      const titles = problemTitles[industry][jobType];
      for (let i = 0; i < 15; i++) {
        problems.push({
          id: String(id),
          title: titles[i],
          category: categories[i % categories.length],
          difficulty: difficulties[i % 3],
          company: companies[i % 5],
          timeEstimate: 20 + (i % 5) * 10,
          acceptance: 35 + (i % 5) * 12,
          industry: industry,
          jobType: jobType,
        });
        id++;
      }
    }
  }

  return problems;
};

export const problems: Problem[] = generateProblems();

// Generate case details for all problems
const generateCaseDetails = (): Record<string, {
  title: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  timeEstimate: number;
  company?: string;
  context: string;
  question: string;
  hints: string[];
  framework: string[];
}> => {
  const details: Record<string, any> = {};

  // Context templates by industry
  const contextTemplates: Record<string, string[]> = {
    "Health & Medical": [
      "A major healthcare system with multiple hospitals is facing challenges in {area}. They operate 15 facilities with $3B in annual revenue and serve 2 million patients annually.",
      "A pharmaceutical company with $5B in revenue is looking to {goal}. They have a portfolio of 50 drugs and are facing patent expirations on key products.",
      "A regional health network is evaluating {initiative}. Current operations span 8 hospitals and 100 outpatient clinics with 20,000 employees.",
      "A biotech startup has developed a breakthrough therapy and needs help with {challenge}. They've raised $200M and are preparing for commercialization.",
      "A group insurance provider serving 5 million members wants to {objective}. They're facing margin pressure from rising healthcare costs."
    ],
    "Technology": [
      "A SaaS company with $100M ARR is facing {challenge}. They have 500 enterprise customers and are growing 30% YoY but seeing increasing churn.",
      "A tech giant is considering {initiative} in a rapidly evolving market. They have $50B in revenue but are seeing competitive pressure from startups.",
      "A cybersecurity firm wants to {goal}. They've grown to $200M in revenue through acquisitions and need to integrate their platform.",
      "A cloud infrastructure provider is evaluating {strategy}. They're the third-largest player with 15% market share and $8B in revenue.",
      "An AI/ML startup needs help with {challenge}. They have a breakthrough technology and $50M in funding but limited go-to-market capability."
    ],
    "Finance & Insurance": [
      "A regional bank with $50B in assets is facing {challenge}. They have 200 branches and are seeing customer migration to digital-first competitors.",
      "An insurance company with $10B in premiums wants to {goal}. They've been slow to digitize and are losing market share to insurtechs.",
      "A wealth management firm is considering {initiative}. They manage $100B in assets but face fee pressure and advisor attrition.",
      "A fintech startup has achieved product-market fit and needs to {objective}. They have 100,000 users and $15M ARR.",
      "A private equity firm is evaluating {strategy} for their portfolio company. The target has $500M in revenue and strong cash flow."
    ],
    "Hospitality & Tourism": [
      "A hotel chain with 200 properties is facing {challenge}. They've seen occupancy decline 20% and need to transform their business model.",
      "A restaurant group with 50 locations wants to {goal}. They've grown through acquisitions and need to standardize operations.",
      "A travel platform is evaluating {initiative}. They have 10M users but face competition from larger OTAs.",
      "A resort company needs help with {strategy}. They operate 12 luxury properties and are seeing changing customer preferences.",
      "A food service company wants to {objective}. They serve 500 corporate accounts and are facing labor shortages."
    ],
    "Manufacturing": [
      "An automotive supplier with $2B in revenue is facing {challenge}. They supply major OEMs but are seeing the industry shift to EVs.",
      "A consumer goods manufacturer wants to {goal}. They operate 10 plants globally and face supply chain disruptions.",
      "An industrial equipment company is evaluating {initiative}. They've been in business 50 years but face digital-native competitors.",
      "A aerospace supplier needs help with {strategy}. They're a tier-1 supplier with $1B in revenue and long-term contracts.",
      "A construction materials company wants to {objective}. They have 25% market share in their region but face margin pressure."
    ],
    "Retail & Wholesale Trade": [
      "A national retailer with 500 stores is facing {challenge}. E-commerce represents only 10% of sales and they're losing share to Amazon.",
      "A wholesale distributor wants to {goal}. They serve 10,000 customers and are seeing disintermediation from manufacturers.",
      "An e-commerce company is evaluating {initiative}. They have $200M in GMV but face rising customer acquisition costs.",
      "A specialty retailer needs help with {strategy}. They have a loyal customer base but aging store fleet.",
      "A department store chain wants to {objective}. They operate 100 stores but have seen traffic decline 30% over 5 years."
    ],
    "Transportation": [
      "A trucking company with 2,000 vehicles is facing {challenge}. They're seeing driver shortages and fuel cost volatility.",
      "An airline is evaluating {initiative}. They operate 200 aircraft and serve 80 destinations but have high fixed costs.",
      "A logistics company wants to {goal}. They handle 1M packages daily but face competition from Amazon Logistics.",
      "A freight forwarding company needs help with {strategy}. They have global operations but fragmented systems.",
      "A last-mile delivery startup wants to {objective}. They've raised $100M but are losing money on every delivery."
    ],
    "Arts, Media & Entertainment": [
      "A streaming platform with 20M subscribers is facing {challenge}. They spend $2B on content but face competition from larger players.",
      "A sports franchise is evaluating {initiative}. They're valued at $2B but have an aging stadium and stagnant attendance.",
      "A music label wants to {goal}. They have a catalog of 50,000 songs but streaming has transformed economics.",
      "A gaming company needs help with {strategy}. They have 50M active players but face high user acquisition costs.",
      "A publishing company wants to {objective}. Print revenue is declining 10% annually and digital hasn't scaled."
    ],
    "Education": [
      "A university with 30,000 students is facing {challenge}. Enrollment has declined 15% and they face competition from online programs.",
      "An EdTech company wants to {goal}. They have 1M learners but face high churn and low engagement.",
      "A K-12 school district is evaluating {initiative}. They serve 100,000 students and face budget constraints.",
      "A corporate training company needs help with {strategy}. They serve Fortune 500 clients but face L&D budget cuts.",
      "An online university wants to {objective}. They've grown to 100,000 students but face regulatory scrutiny."
    ],
    "Public Services": [
      "A city government with 1M residents is facing {challenge}. They have aging infrastructure and budget constraints.",
      "A utility company is evaluating {initiative}. They serve 2M customers and face pressure to decarbonize.",
      "A transportation authority wants to {goal}. They operate 500 buses and see ridership declining.",
      "An emergency services department needs help with {strategy}. Response times have increased 20%.",
      "A federal agency wants to {objective}. They process 10M applications annually with legacy systems."
    ]
  };

  const genericHints = [
    "Start by understanding the current state and key pain points",
    "Consider both internal capabilities and external market factors",
    "Think about quick wins vs. strategic long-term initiatives",
    "Evaluate the financial implications of different approaches",
    "Consider implementation challenges and change management"
  ];

  const genericFramework = [
    "Current State Assessment: Understand baseline performance and gaps",
    "Root Cause Analysis: Identify key drivers and interdependencies",
    "Option Development: Generate 2-3 strategic alternatives",
    "Evaluation Criteria: Define success metrics and decision factors",
    "Implementation Roadmap: Prioritize actions and define timeline"
  ];

  for (const problem of problems) {
    const templates = contextTemplates[problem.industry];
    const template = templates[(parseInt(problem.id) - 1) % templates.length];
    
    details[problem.id] = {
      title: problem.title,
      category: problem.category,
      difficulty: problem.difficulty,
      timeEstimate: problem.timeEstimate,
      company: problem.company,
      context: template
        .replace("{challenge}", "strategic challenges related to " + problem.title.toLowerCase())
        .replace("{goal}", "achieve success in " + problem.title.toLowerCase())
        .replace("{initiative}", "a major initiative around " + problem.title.toLowerCase())
        .replace("{strategy}", "their approach to " + problem.title.toLowerCase())
        .replace("{objective}", "improve their " + problem.title.toLowerCase())
        .replace("{area}", problem.title.toLowerCase()),
      question: `How should the client approach ${problem.title.toLowerCase()}? What strategic recommendations would you make?`,
      hints: [
        `Consider the specific challenges related to ${problem.title.toLowerCase()}`,
        ...genericHints.slice(0, 3)
      ],
      framework: genericFramework
    };
  }

  return details;
};

export const caseDetails = generateCaseDetails();
