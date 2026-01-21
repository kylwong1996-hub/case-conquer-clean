import { Link } from "react-router-dom";
import { 
  TrendingUp, 
  DollarSign, 
  Building2, 
  Users, 
  Lightbulb, 
  Globe,
  ArrowRight 
} from "lucide-react";

const categories = [
  {
    icon: TrendingUp,
    name: "Market Sizing",
    count: 85,
    color: "text-info",
    description: "Estimate market sizes and TAM calculations",
  },
  {
    icon: DollarSign,
    name: "Profitability",
    count: 72,
    color: "text-success",
    description: "Revenue optimization and cost reduction",
  },
  {
    icon: Building2,
    name: "M&A",
    count: 58,
    color: "text-primary",
    description: "Mergers, acquisitions, and due diligence",
  },
  {
    icon: Users,
    name: "Market Entry",
    count: 64,
    color: "text-medium",
    description: "New market and product launch strategies",
  },
  {
    icon: Lightbulb,
    name: "Growth Strategy",
    count: 91,
    color: "text-easy",
    description: "Scaling businesses and expansion planning",
  },
  {
    icon: Globe,
    name: "Operations",
    count: 47,
    color: "text-hard",
    description: "Supply chain and process optimization",
  },
];

export function CategoriesSection() {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Practice by Category
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Master every type of case interview with our structured problem library
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              to={`/problems?category=${category.name.toLowerCase().replace(" ", "-")}`}
              className="group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="glass rounded-xl p-6 h-full transition-all duration-300 hover:bg-secondary/50 hover:border-primary/30 hover:glow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-secondary ${category.color}`}>
                    <category.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {category.count} problems
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {category.description}
                </p>
                <div className="flex items-center text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Start practicing
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}