import { Link } from "@tanstack/react-router";
import { Play, FileText, BookOpen, CheckCircle2 } from "lucide-react";

export interface ContentCardData {
  id: string;
  title: string;
  description?: string | null;
  thumbnail_url?: string | null;
  video_duration?: string | null;
  video_url?: string | null;
  pdf_url?: string | null;
  book_url?: string | null;
  content_type?: string | null;
  /** Overrides author.full_name for display when set by uploader */
  display_author_name?: string | null;
  category?: { name?: string | null; slug?: string | null } | null;
  author?: { full_name?: string | null; avatar_url?: string | null; job_title?: string | null } | null;
  completed?: boolean;
}

function ContentTypePlaceholder({ item }: { item: ContentCardData }) {
  const isBook = item.content_type === "book" || !!item.book_url;
  const isPdf  = !isBook && (item.content_type === "pdf" || (!!item.pdf_url && !item.video_url));

  if (isBook) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center relative"
        style={{ background: "linear-gradient(135deg, #0f1e35 0%, #1a3a5c 100%)" }}>
        <span className="absolute top-3 left-3 text-[10px] font-bold tracking-widest uppercase text-gold bg-gold/15 px-2 py-0.5 rounded">
          BOOK
        </span>
        <BookOpen className="h-14 w-14 text-gold drop-shadow-lg group-hover:scale-110 transition-transform duration-500" />
      </div>
    );
  }

  if (isPdf) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center relative"
        style={{ background: "linear-gradient(135deg, #0f1e35 0%, #1a3a5c 100%)" }}>
        <span className="absolute top-3 left-3 text-[10px] font-bold tracking-widest uppercase text-gold bg-gold/15 px-2 py-0.5 rounded">
          PDF
        </span>
        <FileText className="h-14 w-14 text-gold drop-shadow-lg group-hover:scale-110 transition-transform duration-500" />
      </div>
    );
  }

  // Video (no thumbnail) or unspecified
  return (
    <div className="w-full h-full flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #0f1e35 0%, #1a3a5c 100%)" }}>
      <div className="rounded-full bg-gold/20 p-4 group-hover:bg-gold/30 transition-colors duration-300">
        <Play className="h-10 w-10 text-gold fill-gold/40 group-hover:fill-gold/60 transition-colors duration-300" />
      </div>
    </div>
  );
}

export function ContentCard({ item }: { item: ContentCardData }) {
  return (
    <Link
      to="/content/$id"
      params={{ id: item.id }}
      className="group block rounded-xl overflow-hidden bg-card border border-border shadow-card hover:shadow-card-hover transition-all"
    >
      <div className="aspect-video bg-muted relative overflow-hidden">
        {item.thumbnail_url ? (
          <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        ) : (
          <ContentTypePlaceholder item={item} />
        )}
        {item.video_duration && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
            {item.video_duration}
          </div>
        )}
        {item.completed && (
          <div className="absolute top-2 right-2 bg-success text-success-foreground rounded-full p-1">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="p-4">
        {item.category?.name && (
          <div className="text-[11px] uppercase tracking-wider font-semibold text-gold mb-1.5">
            {item.category.name}
          </div>
        )}
        <h3 className="font-display font-bold text-foreground line-clamp-2 leading-snug mb-1">
          {item.title}
        </h3>
        {(item.display_author_name || item.author?.full_name) && (() => {
          // display_author_name overrides the author's profile name when set
          const displayName = item.display_author_name || item.author?.full_name!;
          const avatarUrl = item.display_author_name ? null : item.author?.avatar_url;
          const jobTitle = item.display_author_name ? null : item.author?.job_title;
          return (
            <div className="flex items-center gap-2 mt-1.5">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-primary/10 text-gold text-[10px] font-bold flex items-center justify-center">
                  {displayName.slice(0, 1).toUpperCase()}
                </div>
              )}
              <p className="text-xs text-muted-foreground truncate">
                Taught by <span className="text-foreground/90 font-medium">{displayName}</span>
                {jobTitle && <span className="text-muted-foreground"> · {jobTitle}</span>}
              </p>
            </div>
          );
        })()}
      </div>
    </Link>
  );
}
