import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { teamSignup } from "@/lib/team-signup.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export const Route = createFileRoute("/team-signup")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Team Sign up — DCPG Membership Portal" },
      { name: "description", content: "Activate your DCPG team member account with your access code." },
    ],
  }),
  component: TeamSignupPage,
});

function TeamSignupPage() {
  const navigate = useNavigate();
  const signupFn = useServerFn(teamSignup);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState<string | undefined>(undefined);
  const [practice, setPractice] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return toast.error("Full name is required");
    if (!accessCode.trim()) return toast.error("Team access code is required");
    if (password.length < 8) return toast.error("Password must be at least 8 characters");
    if (password !== confirm) return toast.error("Passwords do not match");

    setLoading(true);
    try {
      await signupFn({
        data: {
          fullName,
          email,
          password,
          phone: phone ?? null,
          practice: practice || null,
          accessCode,
        },
      });
      // Sign them in immediately (email_confirm is set server-side)
      const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
      if (signInErr) {
        toast.success("Account created — please sign in.");
        navigate({ to: "/login" });
        return;
      }
      toast.success("Welcome to the team!");
      navigate({ to: "/admin" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="mb-8">
          <div className="font-display text-4xl font-extrabold text-primary tracking-tight">DCPG</div>
          <div className="font-display text-lg text-gold font-bold tracking-wide">Team Portal</div>
        </div>

        <div className="flex items-center gap-2 text-gold mb-2">
          <ShieldCheck className="h-5 w-5" />
          <span className="text-sm font-semibold uppercase tracking-wider">Team members only</span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-foreground leading-tight mb-2">
          Activate your team member account
        </h1>
        <p className="text-muted-foreground mb-8">
          Team members publish content directly to the DCPG library. You need an access code from your admin to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name <span className="text-destructive">*</span></Label>
            <Input id="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
            <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone number <span className="text-muted-foreground text-xs">(optional)</span></Label>
            <PhoneInput
              id="phone"
              international
              defaultCountry="US"
              value={phone}
              onChange={setPhone}
              className="phone-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="practice">Practice Name <span className="text-muted-foreground text-xs">(optional)</span></Label>
            <Input id="practice" value={practice} onChange={(e) => setPractice(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accessCode">Team Access Code <span className="text-destructive">*</span></Label>
            <Input
              id="accessCode"
              required
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="border-gold/40 focus-visible:ring-gold"
              placeholder="Enter the code provided by your DCPG admin"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
            <Input id="password" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
            <p className="text-xs text-muted-foreground">Minimum 8 characters.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm Password <span className="text-destructive">*</span></Label>
            <Input id="confirm" type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-gold text-gold-foreground hover:bg-gold/90 h-11 font-semibold">
            {loading ? "Activating…" : "Activate Author Account"}
          </Button>
        </form>

        <div className="my-8 border-t border-border" />

        <p className="text-sm text-muted-foreground text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-foreground font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
