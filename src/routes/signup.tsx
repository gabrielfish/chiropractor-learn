import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { notifyNewMember } from "@/lib/notify.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Loader2, CalendarDays, BookOpen, Play, Award } from "lucide-react";
import { PasswordInput } from "@/components/PasswordInput";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const VALID_INVITE = "INNERCIRCLE";
const BOOKING_URL = "https://api.leadconnectorhq.com/widget/booking/se3iS4vBOzoiBEaeoSdC";

export const Route = createFileRoute("/signup")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({
    invite: typeof search.invite === "string" ? search.invite : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign up - DCPG Membership Portal" },
      { name: "description", content: "Activate your DCPG membership and access Ryan Rieder's complete chiropractic teaching library." },
    ],
  }),
  component: SignupPage,
});

const TESTIMONIALS = [
  {
    quote: "New patients increased from 25 to 77 per month — without burnout or gimmicks.",
    name: "Dr. Wendy McCloud",
    clinic: "WDC Physiotherapy UK",
  },
  {
    quote: "80 leads at £1.63 each, 32 new patients booked in just 6 days. Paid for the whole year from one campaign!",
    name: "Dr. Alex Eatly",
    clinic: "Liverpool Chiropractic UK",
  },
  {
    quote: "Since coaching with Ryan my clinic has exploded. We are generating an EXTRA $7,600 per week.",
    name: "Dr. Mike Paull",
    clinic: "",
  },
];

function TestimonialCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(id);
  }, []);

  const t = TESTIMONIALS[active];

  return (
    <div className="w-full bg-primary rounded-2xl px-8 py-10 text-center relative overflow-hidden">
      {/* Large decorative quote mark */}
      <div className="absolute top-4 left-6 text-gold/20 font-serif text-9xl leading-none select-none pointer-events-none">
        "
      </div>

      {/* Stars */}
      <div className="flex justify-center gap-1 mb-5 relative z-10">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-gold text-xl">★</span>
        ))}
      </div>

      {/* Quote */}
      <blockquote className="relative z-10 text-primary-foreground text-lg sm:text-xl italic font-medium leading-relaxed max-w-2xl mx-auto mb-6">
        "{t.quote}"
      </blockquote>

      {/* Attribution */}
      <div className="relative z-10">
        <div className="text-gold font-semibold text-base">{t.name}</div>
        {t.clinic && (
          <div className="text-primary-foreground/60 text-sm mt-0.5">{t.clinic}</div>
        )}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-7 relative z-10">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === active ? "bg-gold w-5" : "bg-primary-foreground/30"}`}
            aria-label={`Testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function NoInvitePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 py-16 text-center">
      {/* Logo */}
      <img src="/dcpg-logo.png" alt="DCPG" style={{ height: 48 }} className="mb-10" />

      {/* Heading */}
      <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground leading-tight mb-4 max-w-xl">
        Ryan Rieder's Inner Circle Teaching Library
      </h1>
      <p className="text-muted-foreground text-lg max-w-md mb-10">
        Get access to 200+ chiropractic growth teachings, courses, and books — built for chiropractors who want to scale.
      </p>

      {/* Feature pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {[
          { icon: <Play className="h-4 w-4" />, label: "200+ video teachings" },
          { icon: <BookOpen className="h-4 w-4" />, label: "Complete books & PDFs" },
          { icon: <Award className="h-4 w-4" />, label: "Proven growth systems" },
        ].map((f) => (
          <div
            key={f.label}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-gold/5 text-sm font-medium text-foreground"
          >
            <span className="text-gold">{f.icon}</span>
            {f.label}
          </div>
        ))}
      </div>

      {/* Primary CTA */}
      <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
        <Button
          size="lg"
          className="bg-gold text-gold-foreground hover:bg-gold/90 font-semibold h-14 px-10 text-base gap-2 mb-5 shadow-lg"
        >
          <CalendarDays className="h-5 w-5" />
          Book a Strategy Call
        </Button>
      </a>
      <p className="text-xs text-muted-foreground mb-8">Free — no commitment required</p>

      {/* Sign in link */}
      <p className="text-sm text-muted-foreground mb-12">
        Already a member?{" "}
        <Link to="/login" className="text-foreground font-semibold hover:text-gold transition-colors">
          Sign In
        </Link>
      </p>

      {/* Social proof carousel */}
      <div className="w-full max-w-2xl">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-6">
          Trusted by chiropractors worldwide
        </p>
        <TestimonialCarousel />
      </div>
    </div>
  );
}

function SignupPage() {
  const { invite } = useSearch({ from: "/signup" });
  if (!invite || invite.toUpperCase() !== VALID_INVITE) {
    return <NoInvitePage />;
  }

  return <SignupForm />;
}

function SignupForm() {
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
            <PasswordInput id="password" autoComplete="new-password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
            <p className="text-xs text-muted-foreground">Minimum 8 characters.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm Password <span className="text-destructive">*</span></Label>
            <PasswordInput id="confirm" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
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
