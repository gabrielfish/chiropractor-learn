import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Search, Lock, X, Play, CalendarDays } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { searchPublishedContent } from "@/lib/public-search.functions";

const BOOKING_URL =
  "https://api.leadconnectorhq.com/widget/booking/se3iS4vBOzoiBEaeoSdC";

export function LandingSearchModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const search = useServerFn(searchPublishedContent);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(q.trim()), 250);
    return () => clearTimeout(id);
  }, [q]);

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  const { data, isFetching } = useQuery({
    queryKey: ["landing-search", debounced],
    queryFn: () =>
      search({ data: { q: debounced.length > 0 ? debounced : "a", featured: debounced.length === 0 } }),
    enabled: open,
    staleTime: 30_000,
  });

  const results = data?.results ?? [];
  const isFeatured = data?.isFeatured ?? false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 gap-0 overflow-hidden bg-background border-border">
        {/* Search input row */}
        <div className="border-b border-border bg-primary text-primary-foreground px-5 flex items-center gap-3 h-[60px]">
          <Search className="h-6 w-6 text-gold shrink-0" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && onOpenChange(false)}
            placeholder="Search Ryan's teaching library..."
            className="flex-1 bg-transparent border-0 outline-none text-base placeholder:text-primary-foreground/50 text-primary-foreground"
          />
          {/* Gold Search button — desktop only */}
          <Button
            size="sm"
            className="hidden sm:flex bg-gold text-gold-foreground hover:bg-gold/90 font-semibold shrink-0"
            onClick={() => setDebounced(q.trim())}
          >
            Search
          </Button>
          <button
            onClick={() => onOpenChange(false)}
            className="text-primary-foreground/70 hover:text-gold transition-colors ml-1"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results area */}
        <div className="max-h-[60vh] overflow-y-auto p-5 bg-background">
          {/* Loading */}
          {isFetching && (
            <div className="text-center text-sm text-muted-foreground py-10">
              Searching…
            </div>
          )}

          {/* Empty state — prompt */}
          {!isFetching && debounced.length === 0 && results.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-12">
              Start typing to search Ryan's full teaching library.
            </div>
          )}

          {/* Featured / fallback heading */}
          {!isFetching && results.length > 0 && isFeatured && (
            <div className="mb-4">
              {debounced.length > 0 ? (
                <p className="text-sm text-muted-foreground">
                  No exact matches for <span className="font-semibold text-foreground">"{debounced}"</span> — here are some of Ryan's most popular teachings:
                </p>
              ) : (
                <p className="text-sm text-muted-foreground font-medium">
                  Here are some of Ryan's most popular teachings:
                </p>
              )}
            </div>
          )}

          {/* Result grid */}
          {!isFetching && results.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-4">
              {results.map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-xl overflow-hidden border border-border bg-card shadow-card"
                >
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {item.thumbnail_url ? (
                      <img
                        src={item.thumbnail_url}
                        alt={item.title}
                        className="w-full h-full object-cover blur-sm scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                        <Play className="h-10 w-10 text-gold/80" />
                      </div>
                    )}
                    {/* Lock overlay */}
                    <div className="absolute inset-0 bg-primary/70 backdrop-blur-[2px] flex flex-col items-center justify-center text-primary-foreground">
                      <div className="rounded-full bg-gold/20 p-2.5 mb-2">
                        <Lock className="h-4 w-4 text-gold" />
                      </div>
                      <span className="text-xs font-semibold tracking-wide uppercase text-gold">
                        Sign in to access
                      </span>
                    </div>
                    {item.video_duration && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[11px] px-2 py-0.5 rounded z-10">
                        {item.video_duration}
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    {item.category_name && (
                      <div className="text-[10px] uppercase tracking-wider font-semibold text-gold mb-1">
                        {item.category_name}
                      </div>
                    )}
                    <h3 className="font-display font-bold text-sm text-foreground line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* "Want to learn more?" CTA — shown when featured fallback is displayed */}
          {!isFetching && isFeatured && results.length > 0 && (
            <div className="mt-6 rounded-xl border border-gold/30 bg-gold/5 p-5 text-center">
              <p className="text-sm font-semibold text-foreground mb-3">
                Want to learn more? Talk to the DCPG team.
              </p>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                <Button className="bg-gold text-gold-foreground hover:bg-gold/90 font-semibold gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Book a free strategy call
                </Button>
              </a>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="border-t border-border bg-muted/40 p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Unlock unlimited courses and the full DCPG library.
          </p>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              onClick={() => onOpenChange(false)}
              className="text-sm font-medium text-primary hover:text-gold transition-colors"
            >
              Sign In
            </Link>
            <Link to="/signup" onClick={() => onOpenChange(false)}>
              <Button className="bg-gold text-gold-foreground hover:bg-gold/90 font-semibold">
                Sign Up for Access
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
