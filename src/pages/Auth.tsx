import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import logo from "@/assets/logo.png";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { industries, jobTypes } from "@/data/problems";

// Filter out "All" options for the profile setup
const industryOptions = Object.keys(industries).filter(i => i !== "All Industries") as string[];
const jobTypeOptions = jobTypes.filter(j => j !== "All Job Types") as string[];

const authSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const nameSchema = z.string().min(2, { message: "Name must be at least 2 characters" });

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; newPassword?: string; confirmPassword?: string; displayName?: string }>({});
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const isEmbeddedPreview = (() => {
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  })();

  const [oauthUrl, setOauthUrl] = useState<string | null>(null);

  useEffect(() => {
    // Check URL hash for recovery token BEFORE setting up auth listener
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const isRecoveryFlow = hashParams.get("type") === "recovery";

    if (isRecoveryFlow) {
      setShowPasswordReset(true);
      return; // Don't run session checks during recovery
    }

    // Check if we need to show profile setup from URL param
    const needsProfileSetup = searchParams.get("setup") === "profile";
    if (needsProfileSetup) {
      setShowProfileSetup(true);
    }

    let isMounted = true;

    const checkProfileAndRedirect = async (session: any) => {
      if (!session || !isMounted) return;

      // Check if user has a profile
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (!isMounted) return;

      if (error) {
        console.error("Error fetching profile:", error);
      }

      if (!profile) {
        // Pre-fill display name from Google profile if available
        const userName =
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name ||
          "";
        if (userName) {
          setDisplayName(userName);
        }
        setShowProfileSetup(true);
      } else {
        // User has profile, redirect to the page they were trying to access
        const fromState = (location.state as any)?.from?.pathname;
        const fromStorage = localStorage.getItem("postAuthRedirect") || undefined;
        let target = fromState || fromStorage || "/";
        // Prevent loops where the stored target is the auth page itself.
        if (typeof target === "string" && target.startsWith("/auth")) {
          target = "/";
        }
        localStorage.removeItem("postAuthRedirect");
        navigate(target, { replace: true });
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          setShowPasswordReset(true);
        } else if (event === "SIGNED_IN" && session) {
          await checkProfileAndRedirect(session);
        }
      }
    );

    // If we had to do OAuth in a new tab (embedded preview), the callback page
    // will postMessage the session back here so we can persist it in this iframe.
    const onMessage = async (event: MessageEvent) => {
      if (!isMounted) return;
      if (event.origin !== window.location.origin) return;

      const data = (event.data ?? {}) as any;
      if (data.type !== "LOVABLE_OAUTH_SESSION") return;
      if (!data.access_token || !data.refresh_token) return;

      setOauthUrl(null);
      setLoading(true);

      const { error } = await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });

      if (error) {
        console.error("setSession (postMessage) error:", error);
        toast({
          title: "Google sign-in failed",
          description: error.message,
          variant: "destructive",
        });
        if (isMounted) setLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      await checkProfileAndRedirect(session);

      if (isMounted) setLoading(false);
    };

    window.addEventListener("message", onMessage);

    // Initial session check
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      await checkProfileAndRedirect(session);
    });

    return () => {
      isMounted = false;
      window.removeEventListener("message", onMessage);
      subscription.unsubscribe();
    };
  }, [navigate, location.state, searchParams]);

  const validateForm = () => {
    const result = authSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "email") fieldErrors.email = err.message;
        if (err.path[0] === "password") fieldErrors.password = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const validateEmail = () => {
    const emailResult = z.string().trim().email({ message: "Invalid email address" }).safeParse(email);
    if (!emailResult.success) {
      setErrors({ email: emailResult.error.errors[0].message });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setOauthUrl(null);

    // Preserve where the user was trying to go (works across full-page OAuth redirects)
    const from = (location.state as any)?.from?.pathname || "/";
    localStorage.setItem("postAuthRedirect", from);

    const redirectTo = `${window.location.origin}/auth/callback`;

    // In embedded previews (iframes), Google refuses to render in-frame.
    // We request the OAuth URL and prompt the user to continue in a new tab.
    if (isEmbeddedPreview) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });

      setLoading(false);

      if (error) {
        toast({
          title: "Google sign in failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data?.url) {
        const opened = window.open(data.url, "_blank");
        if (!opened) {
          // Some embedded environments block popups/new tabs. Don't redirect the iframe,
          // because Google will show a blocked/refused-to-connect page.
          setOauthUrl(data.url);
          toast({
            title: "Open in a new tab",
            description: "This preview blocks Google sign-in. Use the link above to continue in a new tab.",
          });
        } else {
          toast({
            title: "Continue in new tab",
            description: "Finish Google sign-in in the tab that just opened, then return here.",
          });
        }
      }

      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Google sign in failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Verification code sent",
        description: "Please check your email for the 6-digit verification code.",
      });
      setShowVerification(true);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter the 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: verificationCode,
      type: "signup",
    });
    setLoading(false);

    if (error) {
      toast({
        title: "Verification failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Email verified",
        description: "Your account has been verified successfully.",
      });
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });
    setLoading(false);

    if (error) {
      toast({
        title: "Resend failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Code resent",
        description: "A new verification code has been sent to your email.",
      });
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setLoading(true);
    const redirectUrl = `${window.location.origin}/auth`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    setLoading(false);

    if (error) {
      toast({
        title: "Reset failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Check your email",
        description: "If an account exists with this email, you'll receive a password reset link. If you don't see it, check your spam folder or verify the email is registered.",
      });
      setShowForgotPassword(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      setErrors({ newPassword: "Password must be at least 6 characters" });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }
    
    setErrors({});
    setLoading(true);
    
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);

    if (error) {
      toast({
        title: "Password update failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
      setShowPasswordReset(false);
      navigate("/");
    }
  };

  const handleProfileSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const nameResult = nameSchema.safeParse(displayName);
    if (!nameResult.success) {
      setErrors({ displayName: nameResult.error.errors[0].message });
      return;
    }
    
    setErrors({});
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Error",
        description: "No user session found. Please sign in again.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    
    const { error } = await supabase.from("profiles").insert({
      user_id: user.id,
      display_name: displayName.trim(),
      industries: selectedIndustries,
      job_types: selectedJobTypes,
    });
    
    setLoading(false);

    if (error) {
      toast({
        title: "Profile setup failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile created",
        description: "Welcome to CaseForesight!",
      });
      const from = (location.state as any)?.from?.pathname || "/";
      navigate(from);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="CaseForesight" className="h-12 w-auto" />
          </div>
          <CardTitle className="text-2xl">
          {showProfileSetup ? "Complete Your Profile" : "Welcome to CaseForesight"}
          </CardTitle>
          <CardDescription>
            {showProfileSetup 
              ? "We're excited to have you! Please create a profile to unlock access to our full library of 900+ case interview practice problems."
              : "Sign in or create an account to continue"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isEmbeddedPreview && oauthUrl && !showProfileSetup && !showPasswordReset && !showForgotPassword && !showVerification ? (
            <div className="mb-4 rounded-md border border-input bg-muted p-3">
              <p className="text-sm font-medium text-foreground">Google sign-in needs a new tab</p>
              <p className="mt-1 text-sm text-muted-foreground">
                This preview blocks accounts.google.com in-frame. Open the link below to continue.
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <Button asChild className="w-full sm:w-auto">
                  <a href={oauthUrl} target="_blank" rel="noopener noreferrer">
                    Continue with Google
                  </a>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => setOauthUrl(null)}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          ) : null}

          {showProfileSetup ? (
            <form onSubmit={handleProfileSetup} className="space-y-6 mt-4">
              <div className="space-y-2">
                <Label htmlFor="display-name">Your Name</Label>
                <Input
                  id="display-name"
                  type="text"
                  placeholder="John Doe"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
                {errors.displayName && <p className="text-sm text-destructive">{errors.displayName}</p>}
              </div>

              <div className="space-y-3">
                <Label>Industries you're interested in</Label>
                <p className="text-sm text-muted-foreground">Select all that apply</p>
                <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto border rounded-md p-3">
                  {industryOptions.map((industry) => (
                    <div key={industry} className="flex items-center space-x-2">
                      <Checkbox
                        id={`industry-${industry}`}
                        checked={selectedIndustries.includes(industry)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedIndustries([...selectedIndustries, industry]);
                          } else {
                            setSelectedIndustries(selectedIndustries.filter(i => i !== industry));
                          }
                        }}
                      />
                      <label
                        htmlFor={`industry-${industry}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {industry}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Job functions you're interested in</Label>
                <p className="text-sm text-muted-foreground">Select all that apply</p>
                <div className="grid grid-cols-1 gap-2 border rounded-md p-3">
                  {jobTypeOptions.map((jobType) => (
                    <div key={jobType} className="flex items-center space-x-2">
                      <Checkbox
                        id={`jobtype-${jobType}`}
                        checked={selectedJobTypes.includes(jobType)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedJobTypes([...selectedJobTypes, jobType]);
                          } else {
                            setSelectedJobTypes(selectedJobTypes.filter(j => j !== jobType));
                          }
                        }}
                      />
                      <label
                        htmlFor={`jobtype-${jobType}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {jobType}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Complete Setup
              </Button>
            </form>
          ) : showPasswordReset ? (
            <div className="space-y-4 mt-4">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Enter your new password below
                </p>
              </div>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Password
                </Button>
              </form>
            </div>
          ) : showVerification ? (
            <div className="space-y-4 mt-4">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  We sent a verification code to <strong>{email}</strong>
                </p>
              </div>
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={verificationCode}
                    onChange={(value) => setVerificationCode(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <Button type="submit" className="w-full" disabled={loading || verificationCode.length !== 6}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verify Email
                </Button>
              </form>
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the code?
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResendCode}
                  disabled={loading}
                >
                  Resend Code
                </Button>
              </div>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setShowVerification(false);
                  setVerificationCode("");
                }}
              >
                Back to Sign Up
              </Button>
            </div>
          ) : showForgotPassword ? (
            <div className="space-y-4 mt-4">
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Reset Link
                </Button>
              </form>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setShowForgotPassword(false)}
              >
                Back to Sign In
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="signin-password">Password</Label>
                      <Button
                        type="button"
                        variant="link"
                        className="px-0 h-auto text-sm text-muted-foreground"
                        onClick={() => setShowForgotPassword(true)}
                      >
                        Forgot password?
                      </Button>
                    </div>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign Up
                  </Button>
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
