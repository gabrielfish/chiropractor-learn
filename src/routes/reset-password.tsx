import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { KeyRound, ArrowLeft, Loader2 } from "lucide-react";
import { PasswordInput } from "@/components/PasswordInput";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Reset Password — DCPG Membership Portal" },
      { name: "description", content: "Set a new password for your DCPG membership account." },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Supabase sends the recovery token as a URL fragment (#access_token=...&type=recovery)
  // onAuthStateChange fires PASSWORD_RECOVERY when the fragment is present — that's our signal.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    // If the user lands here already authenticated via recovery link (session is already set),
    // getSession() will return the recovery session immediately.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);

    const { error: updateErr } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateErr) {
      setError(updateErr.message);
      toast.error(updateErr.message);
      return;
    }

    toast.success("Password updated — signing you in");
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>

        <div className="mb-8">
          <img src="/dcpg-logo.png" alt="DCPG" style={{ height: 40 }} />
        </div>

        <div className="mx-auto h-14 w-14 rounded-full bg-gold/20 border-2 border-gold/40 flex items-center justify-center mb-6">
          <KeyRound className="h-7 w-7 text-gold" />
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-foreground leading-tight mb-2">
          Set a new password
        </h1>
        <p className="text-muted-foreground mb-8">
          Choose a strong password for your DCPG account.
        </p>

        {!ready ? (
          <div className="rounded-lg border border-border bg-muted/30 px-5 py-5 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Verifying reset link…</p>
            <p>If this takes more than a few seconds, your link may have expired.</p>
            <Link to="/login" className="mt-3 inline-block text-foreground font-medium hover:underline">
              Request a new link
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password <span className="text-destructive">*</span></Label>
              <PasswordInput
                id="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Minimum 8 characters.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm New Password <span className="text-destructive">*</span></Label>
              <PasswordInput
                id="confirm"
                autoComplete="new-password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-gold-foreground hover:bg-gold/90 h-11 font-semibold inline-flex items-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Updating…" : "Update Password"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
