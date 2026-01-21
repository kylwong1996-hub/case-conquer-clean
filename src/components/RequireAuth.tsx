import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface RequireAuthProps {
  children: ReactNode;
  allowSampleCase?: string; // Allow specific case ID without auth
}

export function RequireAuth({ children, allowSampleCase }: RequireAuthProps) {
  const { isAuthenticated, hasProfile, isLoading } = useAuth();
  const location = useLocation();

  // Check if current path is allowed as sample
  if (allowSampleCase && location.pathname === `/case/${allowSampleCase}`) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!hasProfile) {
    return <Navigate to="/auth?setup=profile" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
