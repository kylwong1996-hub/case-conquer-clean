import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, BookOpen, User, GraduationCap, LogOut } from "lucide-react";
import logo from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="CaseForesight" className="h-8 w-auto" />
            <span className="text-lg font-bold text-foreground">CaseForesight</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link to="/problems">
              <Button
                variant={isActive("/problems") ? "secondary" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Problems
              </Button>
            </Link>
            <Link to="/guide">
              <Button
                variant={isActive("/guide") ? "secondary" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <GraduationCap className="w-4 h-4" />
                Guide
              </Button>
            </Link>
            <Link to="/progress">
              <Button
                variant={isActive("/progress") ? "secondary" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Progress
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {user.email}
                </span>
                <Button variant="ghost" size="sm" className="gap-2" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm" className="hidden sm:inline-flex">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
