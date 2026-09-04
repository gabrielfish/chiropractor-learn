import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Play, FileText, Award, Search, Users, BookOpen, Quote, Menu, X, Globe, Sparkles, RefreshCw, ArrowRight } from "lucide-react";
import { LandingSearchModal } from "@/components/LandingSearchModal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DCPG Membership Portal — Ryan Rieder's Teaching Library for Chiropractors" },
      { name: "description", content: "Access Ryan Rieder's complete chiropractic practice growth library. Search and watch unlimited video lessons, download proven resources, and grow your practice." },
      // Open Graph
      { property: "og:title", content: "DCPG Membership Portal — Ryan Rieder's Teaching Library for Chiropractors" },
      { property: "og:description", content: "Access Ryan Rieder's complete chiropractic practice growth library. Search and watch unlimited video lessons, download proven resources, and grow your practice." },
      { property: "og:image", content: "https://learn.dcpracticegrowth.com/ryan-rieder.webp" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Ryan Rieder — DCPG Membership Portal" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://learn.dcpracticegrowth.com" },
      { property: "og:site_name", content: "DCPG Membership Portal" },
      // Twitter / X
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "DCPG Membership Portal — Ryan Rieder's Teaching Library for Chiropractors" },
      { name: "twitter:description", content: "Access Ryan Rieder's complete chiropractic practice growth library. Search and watch unlimited video lessons, download proven resources, and grow your practice." },
      { name: "twitter:image", content: "https://learn.dcpracticegrowth.com/ryan-rieder.webp" },
      { name: "twitter:image:alt", content: "Ryan Rieder — DCPG Membership Portal" },
      // Canonical & robots
      { name: "robots", content: "index, follow" },
    ],
    links: [
      { rel: "canonical", href: "https://learn.dcpracticegrowth.com" },
    ],
  }),
  component: LandingPage,
});

const testimonials = [
  {
    stat: "+380% Revenue Growth",
    quote:
      "Since joining Ryan in 2018, practice earnings increased by £330,000. Visit numbers rose from the 30s to 250 — now we can't fit anyone else in!",
    name: "Dr. Belinda Ambrose",
    clinic: "Aligned Family Chiropractic UK",
  },
  {
    stat: "£200K Extra Revenue",
    quote:
      "On track to generate £650,000 — £200,000 more than last year. Weekly visits up from 400 to 550.",
    name: "Dr. Tom & Dr. Becky Lawrence",
    clinic: "Goose & Hollings Lane Clinic UK",
  },
  {
    stat: "93 Patients in 1 Week",
    quote:
      "Advert live for just 1 week. 120 leads generated. 93 booked and prepaid. Unbelievable results.",
    name: "Dr. Brian & Caira",
    clinic: "Premier Chiropractic",
  },
  {
    stat: "Profit Up 91%",
    quote:
      "Revenue up £652K. Profit up 91%. And I still have my evenings off. Scaled from 290 to 430 weekly visits without burnout.",
    name: "Dr. Phil Mitchell",
    clinic: "",
  },
  {
    stat: "3x New Patients",
    quote:
      "My God, this has been a game changer. New patients increased from 25 to 77 per month — without burnout or gimmicks.",
    name: "Wendy McCloud",
    clinic: "WDC Physiotherapy UK",
  },
  {
    stat: "121 Leads at £1 Each",
    quote:
      "Grand Opening ad generated 121 leads at £1 per lead. Everyone who responded bought a plan — ridiculous ROI!",
    name: "Dr. Mats Flodin",
    clinic: "Roslagens Kiropraktik Sweden",
  },
];

const features = [
  {
    icon: <Play className="h-6 w-6" />,
    title: "Video lessons",
    desc: "Watch Ryan's full teaching catalogue on any device, anytime.",
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
    desc: "Find any lesson, topic, or resource across unlimited courses instantly.",
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

function TestimonialCard({ t }: { t: typeof testimonials[number] }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 flex flex-col gap-4 h-full">
      <div className="font-display text-3xl font-extrabold text-gold tracking-tight">
        {t.stat}
      </div>
      <blockquote className="text-sm text-muted-foreground leading-relaxed flex-1">
        "{t.quote}"
      </blockquote>
      <div className="border-t border-border pt-4">
        <div className="font-semibold text-foreground text-sm">{t.name}</div>
        {t.clinic && (
          <div className="text-xs text-muted-foreground mt-0.5">{t.clinic}</div>
        )}
      </div>
    </div>
  );
}

function LandingPage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAllTestimonials, setShowAllTestimonials] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center shrink-0">
            <img src="/dcpg-logo.png" alt="DCPG" style={{ height: 40 }} />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" className="text-foreground">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gold text-gold-foreground hover:bg-gold/90 font-semibold">Sign Up</Button>
            </Link>
            {/* Inline search bar — desktop only */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden lg:flex items-center gap-2 h-10 px-4 rounded-lg border border-border bg-muted/50 text-muted-foreground hover:border-gold hover:text-gold transition-colors text-sm w-56"
            >
              <Search className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left truncate">Search Ryan's library...</span>
            </button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search courses"
              onClick={() => setSearchOpen(true)}
              className="lg:hidden text-foreground hover:text-gold"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile nav */}
          <div className="flex md:hidden items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search courses"
              onClick={() => setSearchOpen(true)}
              className="text-foreground hover:text-gold"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="text-foreground hover:text-gold"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            mobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1 border-t border-border">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-foreground font-medium py-3 px-2 rounded-lg hover:bg-muted transition-colors"
            >
              Home
            </Link>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-foreground font-medium py-3 px-2 rounded-lg hover:bg-muted transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gold font-semibold py-3 px-2 rounded-lg hover:bg-muted transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative text-white overflow-hidden">
        {/* Hero background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero.webp')" }}
          aria-hidden="true"
        />
        {/* Content sits above the image */}
        <div className="relative max-w-5xl mx-auto px-5 sm:px-6 py-14 sm:py-20 md:py-28 text-center">
          <div className="inline-block mb-5 sm:mb-6 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-semibold tracking-wide uppercase">
            With Ryan Rieder
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight mb-5 sm:mb-6">
            Ryan Rieder's complete teaching library, built for chiropractors who want to grow.
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8 sm:mb-10">
            Search and watch Ryan Rieder's complete teaching library — unlimited access, built exclusively for chiropractors.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/signup">
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

          {/* Hero search bar */}
          <div className="mt-8 max-w-xl mx-auto w-full px-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full h-[60px] flex items-center gap-3 px-5 rounded-xl bg-white/10 border border-white/20 hover:border-gold/60 hover:bg-white/15 transition-all text-left group"
            >
              <Search className="h-6 w-6 text-gold shrink-0 group-hover:scale-110 transition-transform" />
              <span className="flex-1 text-primary-foreground/60 text-base">
                Search Ryan's teaching library...
              </span>
              <span className="hidden sm:block text-xs font-semibold bg-gold/20 text-gold px-3 py-1 rounded-full">
                Search
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Free Tools & Resources */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <div className="inline-block mb-3 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-semibold tracking-wide uppercase">
            Free for chiropractors
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-foreground mb-3">
            Free tools &amp; resources
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Practical tools built by DCPG to help you grow your practice — no credit card, no catch.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {[
            {
              icon: <Globe className="h-6 w-6" />,
              title: "Website Audit",
              desc: "Get a free audit of your chiropractic website",
              href: "https://audit.dcpracticegrowth.com",
              cta: "Get free audit",
            },
            {
              icon: <Sparkles className="h-6 w-6" />,
              title: "Content Builder",
              desc: "Generate social media content for your practice in seconds",
              href: "https://contentgen.dcpracticegrowth.com",
              cta: "Build content",
            },
            {
              icon: <RefreshCw className="h-6 w-6" />,
              title: "Patient Reactivation",
              desc: "Win back inactive patients automatically",
              href: "https://reactivation.dcpracticegrowth.com",
              cta: "Reactivate patients",
            },
            {
              icon: <BookOpen className="h-6 w-6" />,
              title: "Free Books",
              desc: "Download Ryan's 4 bestselling chiropractic growth books",
              href: "https://learn.dcpracticegrowth.com/signup?invite=INNERCIRCLE",
              cta: "Download books",
            },
          ].map((tool) => (
            <a
              key={tool.title}
              href={tool.href}
              target={tool.href.startsWith("https://learn.") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="group flex flex-col justify-between rounded-2xl bg-primary p-7 hover:bg-primary/90 transition-colors"
            >
              <div>
                <div className="inline-flex items-center justify-center rounded-xl bg-gold/20 text-gold p-3 mb-5 group-hover:bg-gold/30 transition-colors">
                  {tool.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-primary-foreground mb-2">
                  {tool.title}
                </h3>
                <p className="text-primary-foreground/70 text-sm leading-relaxed">
                  {tool.desc}
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-gold text-sm font-semibold group-hover:gap-2.5 transition-all">
                {tool.cta}
                <ArrowRight className="h-4 w-4" />
              </div>
            </a>
          ))}
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
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <Quote className="h-10 w-10 text-gold mx-auto mb-4" />
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-foreground mb-3">
              Real results from real chiropractors
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Practitioners across the UK and beyond who've grown their practices with Ryan Rieder's teaching.
            </p>
          </div>

          {/* Desktop: full 3×2 grid, all 6 cards equal height */}
          <div className="hidden md:grid md:grid-cols-3 gap-6 items-stretch">
            {testimonials.map((t) => (
              <TestimonialCard key={t.name} t={t} />
            ))}
          </div>

          {/* Mobile: single column, first 3 visible, Show more reveals rest */}
          <div className="md:hidden flex flex-col gap-4">
            {testimonials.slice(0, showAllTestimonials ? testimonials.length : 3).map((t) => (
              <TestimonialCard key={t.name} t={t} />
            ))}
            {!showAllTestimonials && (
              <button
                onClick={() => setShowAllTestimonials(true)}
                className="mt-2 w-full py-3 rounded-xl border border-border text-sm font-semibold text-foreground hover:border-gold hover:text-gold transition-colors"
              >
                Show {testimonials.length - 3} more results ↓
              </button>
            )}
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
          <Link to="/signup">
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
      <footer className="border-t border-border bg-background">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground text-center sm:text-left">
          <div>© 2026 DCPG. All rights reserved.</div>
          <nav className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
            <a
              href="https://dcpracticegrowth.com/privacy-cookie-policy/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors"
            >
              Privacy &amp; Cookie Policy
            </a>
            <a
              href="https://dcpracticegrowth.com/terms-of-service/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors"
            >
              Terms of Service
            </a>
          </nav>
        </div>
      </footer>

      <LandingSearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
