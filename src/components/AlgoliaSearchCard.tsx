import { Link } from "@tanstack/react-router";
import { Play, FileText, BookOpen, GraduationCap } from "lucide-react";
import type { AlgoliaHit } from "@/lib/algolia";

function TypeBadge({ hit }: { hit: AlgoliaHit }) {
  if (hit.type === "course") {
    return (
      <span className="text-[10px] font-bold tracking-widest uppercase text-gold bg-black/60 border border-gold/40 px-2 py-0.5 rounded">
        COURSE
      </span>
    );
  }
  const ct = hit.content_type ?? "video";
  if (ct === "pdf" || ct === "book") {
    return (
      <span className="text-[10px] font-bold tracking-widest uppercase text-gold bg-black/60 border border-gold/40 px-2 py-0.5 rounded">
        {ct.toUpperCase()}
      </span>
    );
  }
  return (
    <span className="text-[10px] font-bold tracking-widest uppercase text-gold bg-black/60 border border-gold/40 px-2 py-0.5 rounded">
      VIDEO
    </span>
  );
}

function Thumbnail({ hit }: { hit: AlgoliaHit }) {
  if (hit.thumbnail_url) {
    return (
      <img
        src={hit.thumbnail_url}
        alt={hit.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
    );
  }

  if (hit.type === "course") {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #0f1e35 0%, #1a3a5c 100%)" }}
      >
        <GraduationCap className="h-14 w-14 text-gold drop-shadow-lg group-hover:scale-110 transition-transform duration-500" />
      </div>
    );
  }

  const ct = hit.content_type ?? "video";
  if (ct === "book") {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #0f1e35 0%, #1a3a5c 100%)" }}
      >
        <BookOpen className="h-14 w-14 text-gold drop-shadow-lg group-hover:scale-110 transition-transform duration-500" />
      </div>
    );
  }
  if (ct === "pdf") {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #0f1e35 0%, #1a3a5c 100%)" }}
      >
        <FileText className="h-14 w-14 text-gold drop-shadow-lg group-hover:scale-110 transition-transform duration-500" />
      </div>
    );
  }
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #0f1e35 0%, #1a3a5c 100%)" }}
    >
      <div className="rounded-full bg-gold/20 p-4 group-hover:bg-gold/30 transition-colors duration-300">
        <Play className="h-10 w-10 text-gold fill-gold/40 group-hover:fill-gold/60 transition-colors duration-300" />
      </div>
    </div>
  );
}

function cardInner(hit: AlgoliaHit) {
  return (
    <>
      {/* Thumbnail */}
      <div className="aspect-video bg-muted relative overflow-hidden">
        <Thumbnail hit={hit} />
        <span className="absolute top-2 left-2">
          <TypeBadge hit={hit} />
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        {hit.category_name && (
          <div className="text-[11px] uppercase tracking-wider font-semibold text-gold mb-1.5">
            {hit.category_name}
          </div>
        )}

        <h3 className="font-display font-bold text-foreground line-clamp-2 leading-snug mb-1">
          {hit.title}
        </h3>

        {hit.display_author_name && (
          <div className="flex items-center gap-2 mt-1.5">
            <div className="w-5 h-5 rounded-full bg-primary/10 text-gold text-[10px] font-bold flex items-center justify-center">
              {hit.display_author_name.slice(0, 1).toUpperCase()}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              Taught by{" "}
              <span className="text-foreground/90 font-medium">{hit.display_author_name}</span>
            </p>
          </div>
        )}

        {hit.description && (
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
            {hit.description}
          </p>
        )}
      </div>
    </>
  );
}

export function AlgoliaSearchCard({ hit }: { hit: AlgoliaHit }) {
  const cardClass =
    "group block rounded-xl overflow-hidden bg-card border border-border shadow-card hover:shadow-card-hover transition-all";

  if (hit.type === "course") {
    return (
      <Link to="/course/$id" params={{ id: hit.id }} className={cardClass}>
        {cardInner(hit)}
      </Link>
    );
  }

  // PDF / book — open directly
  const directUrl = hit.book_url ?? hit.pdf_url ?? null;
  if (directUrl && !hit.video_url) {
    return (
      <a href={directUrl} target="_blank" rel="noopener noreferrer" className={cardClass}>
        {cardInner(hit)}
      </a>
    );
  }

  return (
    <Link to="/content/$id" params={{ id: hit.id }} className={cardClass}>
      {cardInner(hit)}
    </Link>
  );
}
