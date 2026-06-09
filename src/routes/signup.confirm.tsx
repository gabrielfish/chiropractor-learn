import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { MailCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const searchSchema = z.object({
  email: z.string().optional(),
});

export const Route = createFileRoute("/signup/confirm")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Check your inbox - DCPG Membership Portal" },
      { name: "description", content: "Verify your email to activate your DCPG membership." },
    ],
  }),
  component: ConfirmPage,
});

function ConfirmPage() {
  const { email } = Route.useSearch();

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
          Check your inbox!
        </h1>

        <p className="text-muted-foreground mb-2">
          We sent a confirmation link to
        </p>
        {email && (
          <p className="font-semibold text-foreground mb-6 break-all">{email}</p>
        )}
        <p className="text-muted-foreground mb-8">
          Click it to activate your account and access the DCPG portal.
        </p>

        <Button asChild className="w-full bg-gold text-gold-foreground hover:bg-gold/90 h-11 font-semibold">
          <Link to="/login">Go to Sign In</Link>
        </Button>

        <p className="text-sm text-muted-foreground mt-6">
          Didn't get the email? Check your spam folder or{" "}
          <Link to="/signup" className="text-foreground font-medium hover:underline">
            try again
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
