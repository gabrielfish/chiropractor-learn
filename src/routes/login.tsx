import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Play, FileText, Award } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — DCPG Membership Portal" },
      { name: "description", content: "Sign in to access Ryan Rieder's complete chiropractic teaching library." },
    ],
  }),
  component: LoginPage,
});

async function routeByRole() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id);
  const roleSet = new Set((roles ?? []).map((r) => r.role));
  if (roleSet.has("super_admin") || roleSet.has("author")) {
    throw redirect({ to: "/admin" });
  }
  throw redirect({ to: "/dashboard" });
}

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        try { await routeByRole(); } catch (r) { throw r; }
      }
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
    const roleSet = new Set((roles ?? []).map((r) => r.role));
    if (roleSet.has("super_admin") || roleSet.has("author")) {
      navigate({ to: "/admin" });
    } else {
      navigate({ to: "/dashboard" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left panel */}
      <div className="flex-1 md:basis-3/5 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <div className="font-display text-4xl font-extrabold text-primary tracking-tight">DCPG</div>
            <div className="font-display text-lg text-gold font-bold tracking-wide">Membership Portal</div>
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-foreground leading-tight mb-3">
            Ryan Rieder's complete teaching library, built for chiropractors who want to grow.
          </h1>
          <p className="text-muted-foreground mb-8">
            Search 68+ courses, watch video lessons, download resources, and grow your practice.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gold text-gold-foreground hover:bg-gold/90 h-11 font-semibold">
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          <button className="mt-3 text-sm text-muted-foreground hover:text-primary">Forgot password?</button>

          <div className="my-8 border-t border-border" />

          <p className="text-sm text-muted-foreground">
            Don't have an account? <span className="text-foreground font-medium">Contact your DCPG team.</span>
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="hidden md:flex md:basis-2/5 bg-primary text-primary-foreground items-center justify-center px-10 py-12">
        <div className="max-w-sm">
          <blockquote className="font-display text-2xl leading-snug mb-3">
            "DCPG transformed how I run my practice. The Mastermind sessions alone paid for themselves in a month."
          </blockquote>
          <p className="text-sm text-primary-foreground/70 mb-12">— Dr. Sarah Chen, DC</p>

          <div className="space-y-5">
            <Feature icon={<Play className="h-5 w-5" />} title="Video lessons" desc="Watch on any device, anytime." />
            <Feature icon={<FileText className="h-5 w-5" />} title="PDF resources" desc="Done-for-you templates and scripts." />
            <Feature icon={<Award className="h-5 w-5" />} title="Certificates" desc="Earn recognition as you complete tracks." />
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-lg bg-gold/20 text-gold p-2 flex items-center justify-center">{icon}</div>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-primary-foreground/70">{desc}</div>
      </div>
    </div>
  );
}
