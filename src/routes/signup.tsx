import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { notifyNewMember } from "@/lib/notify.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export const Route = createFileRoute("/signup")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign up - DCPG Membership Portal" },
      { name: "description", content: "Activate your DCPG membership and access Ryan Rieder's complete chiropractic teaching library." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const notifyAdmins = useServerFn(notifyNewMember);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState<string | undefined>(undefined);
  const [practice, setPractice] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return toast.error("Full name is required");
    if (password.length < 8) return toast.error("Password must be at least 8 characters");
    if (password !== confirm) return toast.error("Passwords do not match");

    setLoading(true);

    try {
      // 1. Create the auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
            phone: phone ?? null,
            practice_name: practice || null,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      const userId = data.user?.id;

      // 2. If we have a session the user is immediately logged in (email confirm disabled).
      //    Upsert the full profile row — the DB trigger only writes id/email/full_name,
      //    so we fill in phone and practice_name here.
      if (data.session && userId) {
        await supabase
          .from("profiles")
          .upsert({
            id: userId,
            email,
            full_name: fullName,
            phone: phone ?? null,
            practice_name: practice || null,
          })
          .eq("id", userId);
        // user_roles 'member' row is inserted by the handle_new_user DB trigger —
        // RLS blocks client inserts to user_roles, so we rely on the trigger.
      }

      // 3. Fire-and-forget admin notification — never block or fail signup on this
      notifyAdmins({
        data: {
          fullName,
          email,
          practiceName: practice || null,
        },
      }).catch(() => {});

      // 4. Redirect — use window.location so it fires after Supabase's SIGNED_IN
      //    auth-state event, which would otherwise race with and cancel navigate().
      if (data.session) {
        // Logged in immediately — go straight to dashboard
        window.location.href = "/dashboard";
      } else {
        // Email confirmation required — show holding page with the address
        window.location.href = `/signup/confirm?email=${encodeURIComponent(email)}`;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Signup failed — please try again");
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
          <img src="/dcpg-logo.png" alt="DCPG" style={{ height: 40 }} />
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-foreground leading-tight mb-2">
          Activate your account
        </h1>
        <p className="text-muted-foreground mb-8">
          Join chiropractors growing their practices with Ryan Rieder's complete teaching library.
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
            <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
            <Input id="password" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
            <p className="text-xs text-muted-foreground">Minimum 8 characters.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm Password <span className="text-destructive">*</span></Label>
            <Input id="confirm" type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-gold text-gold-foreground hover:bg-gold/90 h-11 font-semibold inline-flex items-center gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Activating…" : "Activate My Account"}
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
