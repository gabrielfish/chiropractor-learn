import { Link } from "@tanstack/react-router";
import { Play, FileText, Book, CheckCircle2 } from "lucide-react";

export interface ContentCardData {
  id: string;
  title: string;
  description?: string | null;
  thumbnail_url?: string | null;
  video_duration?: string | null;
  video_url?: string | null;
  pdf_url?: string | null;
  book_url?: string | null;
  category?: { name?: string | null; slug?: string | null } | null;
  author?: { full_name?: string | null; avatar_url?: string | null; job_title?: string | null } | null;
  completed?: boolean;
}

export function ContentCard({ item }: { item: ContentCardData }) {
  const Icon = item.video_url ? Play : item.pdf_url ? FileText : Book;
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
          <div className="w-full h-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
            <Icon className="h-12 w-12 text-gold/80" />
          </div>
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
        {item.author?.full_name && (
          <div className="flex items-center gap-2 mt-1.5">
            {item.author.avatar_url ? (
              <img src={item.author.avatar_url} alt="" className="w-5 h-5 rounded-full object-cover" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-primary/10 text-gold text-[10px] font-bold flex items-center justify-center">
                {item.author.full_name.slice(0, 1).toUpperCase()}
              </div>
            )}
            <p className="text-xs text-muted-foreground truncate">
              Taught by <span className="text-foreground/90 font-medium">{item.author.full_name}</span>
              {item.author.job_title && <span className="text-muted-foreground"> · {item.author.job_title}</span>}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}
