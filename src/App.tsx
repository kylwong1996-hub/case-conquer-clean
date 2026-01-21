import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RequireAuth } from "@/components/RequireAuth";
import Index from "./pages/Index";
import Problems from "./pages/Problems";
import CaseDetail from "./pages/CaseDetail";
import Progress from "./pages/Progress";
import Guide from "./pages/Guide";
import GuideExample from "./pages/GuideExample";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/problems" element={<RequireAuth><Problems /></RequireAuth>} />
          <Route path="/case/:id" element={<RequireAuth allowSampleCase="1"><CaseDetail /></RequireAuth>} />
          <Route path="/progress" element={<RequireAuth><Progress /></RequireAuth>} />
          <Route path="/guide" element={<RequireAuth><Guide /></RequireAuth>} />
          <Route path="/guide/example/:caseType" element={<RequireAuth><GuideExample /></RequireAuth>} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
