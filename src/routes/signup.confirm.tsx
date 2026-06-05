import { createFileRoute, Link } from "@tanstack/react-router";
import { MailCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/signup/confirm")({
  head: () => ({
    meta: [
      { title: "Check your email — DCPG Membership Portal" },
      { name: "description", content: "Verify your email to activate your DCPG membership." },
    ],
  }),
  component: ConfirmPage,
});

function ConfirmPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="mx-auto h-16 w-16 rounded-full bg-gold/20 border-2 border-gold/40 flex items-center justify-center mb-6">
          <MailCheck className="h-8 w-8 text-gold" />
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-foreground leading-tight mb-3">
          Check your email
        </h1>
        <p className="text-muted-foreground mb-8">
          Check your email to verify your account — then come back and sign in.
        </p>

        <Button asChild className="w-full bg-gold text-gold-foreground hover:bg-gold/90 h-11 font-semibold">
          <Link to="/login">Go to Sign In</Link>
        </Button>
      </div>
    </div>
  );
}
