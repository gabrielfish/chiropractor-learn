import { Link } from "@tanstack/react-router";
import { GraduationCap, CheckCircle2, Share2 } from "lucide-react";

const BASE = "https://learn.dcpracticegrowth.com";

async function copyCourseLink(id: string, e: React.MouseEvent) {
  e.preventDefault();
  e.stopPropagation();
  try {
    await navigator.clipboard.writeText(`${BASE}/course/${id}`);
    const btn = e.currentTarget as HTMLButtonElement;
    const orig = btn.title;
    btn.title = "Copied!";
    setTimeout(() => { btn.title = orig; }, 1500);
  } catch {/* ignore */}
}

export interface CourseCardData {
  id: string;
  title: string;
  description?: string | null;
  thumbnail_url?: string | null;
  display_author_name?: string | null;
  category?: { name?: string | null; slug?: string | null } | null;
  module_count: number;
  lesson_count: number;
  completed_count: number;
  status: string;
}

export function CourseCard({ item }: { item: CourseCardData }) {
  const isComplete = item.completed_count >= item.lesson_count && item.lesson_count > 0;
  const progressPct =
    item.lesson_count > 0
      ? Math.min(100, Math.round((item.completed_count / item.lesson_count) * 100))
      : 0;

  return (
    <Link
      to="/course/$id"
      params={{ id: item.id }}
      className="group block rounded-xl overflow-hidden bg-card border border-border shadow-card hover:shadow-card-hover transition-all"
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-muted relative overflow-hidden">
        {item.thumbnail_url ? (
          <img
            src={item.thumbnail_url}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #0f1e35 0%, #1a3a5c 100%)" }}
          >
            <GraduationCap className="h-14 w-14 text-gold drop-shadow-lg group-hover:scale-110 transition-transform duration-500" />
          </div>
        )}

        {/* COURSE badge */}
        <span className="absolute top-2 left-2 text-[10px] font-bold tracking-widest uppercase text-gold bg-black/60 border border-gold/40 px-2 py-0.5 rounded">
          COURSE
        </span>

        {/* Completed badge */}
        {isComplete && (
          <div className="absolute top-2 right-2 bg-success text-success-foreground rounded-full p-1">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        )}
        {/* Share button */}
        <button
          type="button"
          title="Copy link"
          onClick={(e) => copyCourseLink(item.id, e)}
          className="absolute bottom-2 right-2 h-7 w-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100"
          aria-label="Copy link to this course"
        >
          <Share2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Card body */}
      <div className="p-4">
        {item.category?.name && (
          <div className="text-[11px] uppercase tracking-wider font-semibold text-gold mb-1.5">
            {item.category.name}
          </div>
        )}

        <h3 className="font-display font-bold text-foreground line-clamp-2 leading-snug mb-1">
          {item.title}
        </h3>

        {item.display_author_name && (
          <div className="flex items-center gap-2 mt-1.5">
            <div className="w-5 h-5 rounded-full bg-primary/10 text-gold text-[10px] font-bold flex items-center justify-center">
              {item.display_author_name.slice(0, 1).toUpperCase()}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              Taught by{" "}
              <span className="text-foreground/90 font-medium">{item.display_author_name}</span>
            </p>
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-1">
          {item.module_count} Modules • {item.lesson_count} Lessons
        </p>

        {item.completed_count > 0 && item.lesson_count > 0 && (
          <div className="mt-2.5">
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gold rounded-full"
                style={{ width: progressPct + "%" }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {item.completed_count} of {item.lesson_count} complete
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}
