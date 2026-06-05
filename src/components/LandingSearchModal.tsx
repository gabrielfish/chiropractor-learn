import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Search, Lock, X, Play } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { searchPublishedContent } from "@/lib/public-search.functions";

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
    const id = setTimeout(() => setDebounced(q.trim()), 200);
    return () => clearTimeout(id);
  }, [q]);

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  const { data, isFetching } = useQuery({
    queryKey: ["landing-search", debounced],
    queryFn: () => search({ data: { q: debounced } }),
    enabled: open && debounced.length > 0,
    staleTime: 30_000,
  });

  const results = data?.results ?? [];
  const showEmpty = open && debounced.length > 0 && !isFetching && results.length === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 gap-0 overflow-hidden bg-background border-border">
        {/* Header / search input */}
        <div className="border-b border-border bg-primary text-primary-foreground p-5 flex items-center gap-3">
          <Search className="h-5 w-5 text-gold shrink-0" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search Ryan's unlimited free resources and the full DCPG teaching library"
            className="flex-1 bg-transparent border-0 outline-none text-base placeholder:text-primary-foreground/50 text-primary-foreground"
          />
          <button
            onClick={() => onOpenChange(false)}
            className="text-primary-foreground/70 hover:text-gold transition-colors"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-5 bg-background">
          {debounced.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-12">
              Start typing to search Ryan's full teaching library.
            </div>
          )}

          {showEmpty && (
            <div className="text-center text-sm text-muted-foreground py-12">
              No courses found — try another search term.
            </div>
          )}

          {results.length > 0 && (
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
            <Link
              to="/signup"
              onClick={() => onOpenChange(false)}
            >
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
