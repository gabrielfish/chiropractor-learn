import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, FileText, Award, Search, Users, BookOpen, Quote } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DCPG Membership Portal — Ryan Rieder's chiropractic teaching library" },
      {
        name: "description",
        content:
          "Ryan Rieder's complete teaching library, built for chiropractors who want to grow. Video lessons, PDFs, and resources in one portal.",
      },
      { property: "og:title", content: "DCPG Membership Portal" },
      {
        property: "og:description",
        content: "Ryan Rieder's complete teaching library, built for chiropractors who want to grow.",
      },
    ],
  }),
  component: LandingPage,
});

const testimonials = [
  {
    quote:
      "DCPG transformed how I run my practice. The Mastermind sessions alone paid for themselves in a month.",
    name: "Dr. Sarah Chen, DC",
  },
  {
    quote:
      "Ryan's teaching is direct, practical, and rooted in real chiropractic practice. My new patient numbers doubled.",
    name: "Dr. James Patel, DC",
  },
  {
    quote:
      "Having the entire library searchable in one place changed how my team trains. It's the best investment I've made.",
    name: "Dr. Maria Alvarez, DC",
  },
];

const features = [
  {
    icon: <Play className="h-6 w-6" />,
    title: "Video lessons",
    desc: "Stream Ryan's full teaching catalogue on any device, anytime.",
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: "PDFs & downloads",
    desc: "Done-for-you templates, scripts, and protocols ready to use.",
  },
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "Complete books",
    desc: "Download Ryan's published books and reference guides.",
  },
  {
    icon: <Search className="h-6 w-6" />,
    title: "Searchable library",
    desc: "Find any lesson, topic, or resource across 68+ courses instantly.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Built for chiropractors",
    desc: "Every lesson is purpose-built for growing a chiropractic practice.",
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: "Earn certificates",
    desc: "Track your progress and earn recognition as you complete tracks.",
  },
];

function LandingPage() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % testimonials.length), 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-extrabold text-primary tracking-tight">DCPG</span>
            <span className="font-display text-sm text-gold font-bold tracking-wide">Membership Portal</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" className="text-foreground">Sign In</Button>
            </Link>
            <Link to="/login">
              <Button className="bg-gold text-gold-foreground hover:bg-gold/90 font-semibold">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
          <div className="inline-block mb-6 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-semibold tracking-wide uppercase">
            With Ryan Rieder
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Ryan Rieder's complete teaching library, built for chiropractors who want to grow.
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
            Stream 68+ courses, download proven resources, and access the full DCPG library — anywhere, anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/login">
              <Button size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90 font-semibold h-12 px-8 w-full sm:w-auto">
                Sign Up
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 w-full sm:w-auto border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-foreground mb-3">
            Everything you need to grow your practice
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            One portal. Every lesson, resource, and book Ryan has ever taught — searchable and ready when you are.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-border p-6 bg-card hover:border-gold/50 transition-colors"
            >
              <div className="rounded-lg bg-gold/15 text-gold p-3 inline-flex mb-4">{f.icon}</div>
              <div className="font-display text-lg font-bold text-foreground mb-1">{f.title}</div>
              <div className="text-sm text-muted-foreground">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/40 border-y border-border">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <Quote className="h-10 w-10 text-gold mx-auto mb-6" />
          <blockquote
            key={idx}
            className="font-display text-2xl md:text-3xl text-foreground leading-snug mb-6 animate-in fade-in duration-500"
          >
            "{testimonials[idx].quote}"
          </blockquote>
          <p className="text-sm text-muted-foreground font-medium">— {testimonials[idx].name}</p>
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                aria-label={`Show testimonial ${i + 1}`}
                onClick={() => setIdx(i)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === idx ? "bg-gold" : "bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-extrabold text-foreground mb-4">
          Ready to grow your practice?
        </h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Join the chiropractors using DCPG to build stronger, more profitable practices.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/login">
            <Button size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90 font-semibold h-12 px-8 w-full sm:w-auto">
              Sign Up
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline" className="h-12 px-8 w-full sm:w-auto">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div>© {new Date().getFullYear()} DCPG Membership Portal. All rights reserved.</div>
          <div>Built for chiropractors by Ryan Rieder's team.</div>
        </div>
      </footer>
    </div>
  );
}
