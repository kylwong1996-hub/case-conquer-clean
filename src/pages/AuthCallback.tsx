import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const run = async () => {
      const url = new URL(window.location.href);
      const params = url.searchParams;

      const oauthError = params.get("error") || params.get("error_code");
      const oauthErrorDescription = params.get("error_description");

      if (oauthError || oauthErrorDescription) {
        toast({
          title: "Google sign-in failed",
          description: oauthErrorDescription || oauthError || "Please try again.",
          variant: "destructive",
        });
        navigate("/auth", { replace: true });
        return;
      }

      // 1) If the auth library already processed the callback (and cleaned the URL),
      // we may not see `?code=`/hash tokens anymore. So check for an existing session first.
      const initialSessionRes = await supabase.auth.getSession();
      let session = initialSessionRes.data.session;

      // 2) If no session yet, attempt to process callback parameters manually.
      if (!session) {
        // Support both OAuth flow styles:
        // - PKCE flow: ?code=... which needs an exchange
        // - Implicit flow: tokens in URL hash
        const codeFromQuery = params.get("code");

        const hash = url.hash?.startsWith("#") ? url.hash.slice(1) : url.hash;
        const hashParams = new URLSearchParams(hash);
        const codeFromHash = hashParams.get("code");
        const code = codeFromQuery || codeFromHash;

        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error("exchangeCodeForSession error:", error);
            toast({
              title: "Google sign-in failed",
              description: error.message,
              variant: "destructive",
            });
            navigate("/auth", { replace: true });
            return;
          }
        } else if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) {
            console.error("setSession error:", error);
            toast({
              title: "Google sign-in failed",
              description: error.message,
              variant: "destructive",
            });
            navigate("/auth", { replace: true });
            return;
          }
        } else {
          toast({
            title: "Google sign-in incomplete",
            description:
              "We didn't receive a sign-in code/token. Please try again (and allow popups if prompted).",
            variant: "destructive",
          });
          navigate("/auth", { replace: true });
          return;
        }

        // Refresh session after processing.
        session = (await supabase.auth.getSession()).data.session;
      }

      if (!session) {
        toast({
          title: "Google sign-in incomplete",
          description: "No active session was created. Please try again.",
          variant: "destructive",
        });
        navigate("/auth", { replace: true });
        return;
      }

      // Clean up any OAuth fragments/query params from the URL
      url.hash = "";
      url.searchParams.delete("code");
      url.searchParams.delete("error");
      url.searchParams.delete("error_code");
      url.searchParams.delete("error_description");
      const cleanedSearch = url.searchParams.toString();
      window.history.replaceState(
        {},
        document.title,
        url.pathname + (cleanedSearch ? `?${cleanedSearch}` : "")
      );

      const redirectTo = localStorage.getItem("postAuthRedirect") || "/";
      localStorage.removeItem("postAuthRedirect");

      const userId = session.user.id;

      // If this tab was opened from the embedded preview, send the session back
      // to the opener so the preview iframe can persist it (storage is partitioned).
      if (session?.access_token && session?.refresh_token && window.opener && !window.opener.closed) {
        window.opener.postMessage(
          {
            type: "LOVABLE_OAUTH_SESSION",
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          },
          window.location.origin
        );
        window.close();
        return;
      }
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (profileError) {
        console.error("Profile lookup error:", profileError);
      }

      if (!profile) {
        navigate("/auth?setup=profile", { replace: true });
        return;
      }

      navigate(redirectTo, { replace: true });
    };

    run();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Signing you in…</p>
      </div>
    </div>
  );
}
