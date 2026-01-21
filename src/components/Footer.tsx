import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={logo} alt="CaseForesight" className="h-8 w-auto" />
              <span className="text-lg font-bold text-foreground">CaseForesight</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Master business case interviews with our comprehensive practice platform. 
              Land your dream job at top consulting firms.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Practice</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/problems" className="hover:text-foreground transition-colors">All Problems</Link></li>
              <li><Link to="/problems?difficulty=easy" className="hover:text-foreground transition-colors">Easy Cases</Link></li>
              <li><Link to="/problems?difficulty=medium" className="hover:text-foreground transition-colors">Medium Cases</Link></li>
              <li><Link to="/problems?difficulty=hard" className="hover:text-foreground transition-colors">Hard Cases</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/frameworks" className="hover:text-foreground transition-colors">Frameworks</Link></li>
              <li><Link to="/companies" className="hover:text-foreground transition-colors">Company Guides</Link></li>
              <li><Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} CaseForesight. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}