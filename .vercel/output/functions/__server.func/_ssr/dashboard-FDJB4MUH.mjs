import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link, d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { L as LoaderCircle, G as Globe, j as Sparkles, k as Calendar, U as Users, D as Download, c as Search, l as GraduationCap, m as ChevronRight, I as Icons, n as Folder, o as CircleCheck, p as Share2, B as BookOpen, F as FileText, P as Play } from "../_libs/lucide-react.mjs";
import { s as supabase } from "./client-IF66mSk9.mjs";
import { algoliasearch } from "../_libs/algoliasearch.mjs";
import { M as MemberNav } from "./MemberNav-C9W_HKgq.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { S as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { c as cn } from "./button-BXrfXN_b.mjs";
import { d as Route$a } from "./router-BgAMxlwC.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/algolia__client-common.mjs";
import "../_libs/algolia__abtesting.mjs";
import "zlib";
import "../_libs/algolia__requester-node-http.mjs";
import "http";
import "https";
import "url";
import "../_libs/algolia__client-abtesting.mjs";
import "../_libs/algolia__client-analytics.mjs";
import "../_libs/algolia__client-insights.mjs";
import "../_libs/@algolia/client-personalization+[...].mjs";
import "../_libs/@algolia/client-query-suggestions+[...].mjs";
import "../_libs/algolia__client-search.mjs";
import "../_libs/algolia__ingestion.mjs";
import "../_libs/algolia__monitoring.mjs";
import "../_libs/algolia__recommend.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/zod.mjs";
const ALGOLIA_INDEX = "dcpg_content";
function getSearchClient() {
  const appId = "8YZK9SUZ9Z";
  const searchKey = "ba3d7781aacaecafe73cfa0318e173bf";
  return algoliasearch(appId, searchKey);
}
const BASE$1 = "https://learn.dcpracticegrowth.com";
async function copyContentLink(id, e) {
  e.preventDefault();
  e.stopPropagation();
  try {
    await navigator.clipboard.writeText(`${BASE$1}/content/${id}`);
    toast.success("Link copied! Anyone who clicks this will need to log in to view it.");
  } catch {
    toast.error("Could not copy link — please copy it from the address bar.");
  }
}
function isDirectOpen(item) {
  return item.content_type === "pdf" || item.content_type === "book" || !item.video_url && (!!item.pdf_url || !!item.book_url);
}
function directUrl(item) {
  return item.book_url ?? item.pdf_url ?? "";
}
function ContentTypePlaceholder({ item }) {
  const isBook = item.content_type === "book" || !!item.book_url;
  const isPdf = !isBook && (item.content_type === "pdf" || !!item.pdf_url && !item.video_url);
  if (isBook) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "w-full h-full flex flex-col items-center justify-center relative",
        style: { background: "linear-gradient(135deg, #0f1e35 0%, #1a3a5c 100%)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-3 left-3 text-[10px] font-bold tracking-widest uppercase text-gold bg-gold/15 px-2 py-0.5 rounded", children: "BOOK" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-14 w-14 text-gold drop-shadow-lg group-hover:scale-110 transition-transform duration-500" })
        ]
      }
    );
  }
  if (isPdf) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "w-full h-full flex flex-col items-center justify-center relative",
        style: { background: "linear-gradient(135deg, #0f1e35 0%, #1a3a5c 100%)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-3 left-3 text-[10px] font-bold tracking-widest uppercase text-gold bg-gold/15 px-2 py-0.5 rounded", children: "PDF" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-14 w-14 text-gold drop-shadow-lg group-hover:scale-110 transition-transform duration-500" })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "w-full h-full flex items-center justify-center",
      style: { background: "linear-gradient(135deg, #0f1e35 0%, #1a3a5c 100%)" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-gold/20 p-4 group-hover:bg-gold/30 transition-colors duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-10 w-10 text-gold fill-gold/40 group-hover:fill-gold/60 transition-colors duration-300" }) })
    }
  );
}
function ContentCard({ item }) {
  const direct = isDirectOpen(item);
  const url = direct ? directUrl(item) : void 0;
  const cardClass = "group block rounded-xl overflow-hidden bg-card border border-border shadow-card hover:shadow-card-hover transition-all";
  const inner = /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-video bg-muted relative overflow-hidden", children: [
      item.thumbnail_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: item.thumbnail_url,
          alt: item.title,
          className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
          loading: "lazy"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(ContentTypePlaceholder, { item }),
      item.video_duration && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded", children: item.video_duration }),
      item.completed && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 right-2 bg-success text-success-foreground rounded-full p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: (e) => copyContentLink(item.id, e),
          className: "absolute bottom-2 right-2 h-7 w-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100",
          "aria-label": "Copy link to this lesson",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-3.5 w-3.5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
      item.category?.name && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] uppercase tracking-wider font-semibold text-gold mb-1.5", children: item.category.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-foreground line-clamp-2 leading-snug mb-1", children: item.title }),
      (item.display_author_name || item.author?.full_name) && (() => {
        const displayName = item.display_author_name || item.author?.full_name;
        const avatarUrl = item.display_author_name ? null : item.author?.avatar_url;
        const jobTitle = item.display_author_name ? null : item.author?.job_title;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1.5", children: [
          avatarUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: avatarUrl, alt: "", className: "w-5 h-5 rounded-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 h-5 rounded-full bg-primary/10 text-gold text-[10px] font-bold flex items-center justify-center", children: displayName.slice(0, 1).toUpperCase() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground truncate", children: [
            "Taught by ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/90 font-medium", children: displayName }),
            jobTitle && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              " · ",
              jobTitle
            ] })
          ] })
        ] });
      })()
    ] })
  ] });
  if (direct && url) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: url, target: "_blank", rel: "noopener noreferrer", className: cardClass, children: inner });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Link,
    {
      to: "/content/$id",
      params: { id: item.id },
      className: cardClass,
      children: inner
    }
  );
}
const BASE = "https://learn.dcpracticegrowth.com";
async function copyCourseLink(id, e) {
  e.preventDefault();
  e.stopPropagation();
  try {
    await navigator.clipboard.writeText(`${BASE}/course/${id}`);
    toast.success("Link copied! Anyone who clicks this will need to log in to view it.");
  } catch {
    toast.error("Could not copy link — please copy it from the address bar.");
  }
}
function CourseCard({ item }) {
  const isComplete = item.completed_count >= item.lesson_count && item.lesson_count > 0;
  const progressPct = item.lesson_count > 0 ? Math.min(100, Math.round(item.completed_count / item.lesson_count * 100)) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/course/$id",
      params: { id: item.id },
      className: "group block rounded-xl overflow-hidden bg-card border border-border shadow-card hover:shadow-card-hover transition-all",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-video bg-muted relative overflow-hidden", children: [
          item.thumbnail_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: item.thumbnail_url,
              alt: item.title,
              className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
              loading: "lazy"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-full h-full flex items-center justify-center",
              style: { background: "linear-gradient(135deg, #0f1e35 0%, #1a3a5c 100%)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "h-14 w-14 text-gold drop-shadow-lg group-hover:scale-110 transition-transform duration-500" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-2 left-2 text-[10px] font-bold tracking-widest uppercase text-gold bg-black/60 border border-gold/40 px-2 py-0.5 rounded", children: "COURSE" }),
          isComplete && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 right-2 bg-success text-success-foreground rounded-full p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: (e) => copyCourseLink(item.id, e),
              className: "absolute bottom-2 right-2 h-7 w-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100",
              "aria-label": "Copy link to this course",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-3.5 w-3.5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
          item.category?.name && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] uppercase tracking-wider font-semibold text-gold mb-1.5", children: item.category.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-foreground line-clamp-2 leading-snug mb-1", children: item.title }),
          item.display_author_name && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 h-5 rounded-full bg-primary/10 text-gold text-[10px] font-bold flex items-center justify-center", children: item.display_author_name.slice(0, 1).toUpperCase() }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground truncate", children: [
              "Taught by",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/90 font-medium", children: item.display_author_name })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
            item.module_count,
            " Modules • ",
            item.lesson_count,
            " Lessons"
          ] }),
          item.completed_count > 0 && item.lesson_count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full bg-gold rounded-full",
                style: { width: progressPct + "%" }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
              item.completed_count,
              " of ",
              item.lesson_count,
              " complete"
            ] })
          ] })
        ] })
      ]
    }
  );
}
function TypeBadge({ hit }) {
  if (hit.type === "course") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold tracking-widest uppercase text-gold bg-black/60 border border-gold/40 px-2 py-0.5 rounded", children: "COURSE" });
  }
  const ct = hit.content_type ?? "video";
  if (ct === "pdf" || ct === "book") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold tracking-widest uppercase text-gold bg-black/60 border border-gold/40 px-2 py-0.5 rounded", children: ct.toUpperCase() });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold tracking-widest uppercase text-gold bg-black/60 border border-gold/40 px-2 py-0.5 rounded", children: "VIDEO" });
}
function Thumbnail({ hit }) {
  if (hit.thumbnail_url) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: hit.thumbnail_url,
        alt: hit.title,
        className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
        loading: "lazy"
      }
    );
  }
  if (hit.type === "course") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        style: { background: "linear-gradient(135deg, #0f1e35 0%, #1a3a5c 100%)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "h-14 w-14 text-gold drop-shadow-lg group-hover:scale-110 transition-transform duration-500" })
      }
    );
  }
  const ct = hit.content_type ?? "video";
  if (ct === "book") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        style: { background: "linear-gradient(135deg, #0f1e35 0%, #1a3a5c 100%)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-14 w-14 text-gold drop-shadow-lg group-hover:scale-110 transition-transform duration-500" })
      }
    );
  }
  if (ct === "pdf") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full flex items-center justify-center",
        style: { background: "linear-gradient(135deg, #0f1e35 0%, #1a3a5c 100%)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-14 w-14 text-gold drop-shadow-lg group-hover:scale-110 transition-transform duration-500" })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "w-full h-full flex items-center justify-center",
      style: { background: "linear-gradient(135deg, #0f1e35 0%, #1a3a5c 100%)" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-gold/20 p-4 group-hover:bg-gold/30 transition-colors duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-10 w-10 text-gold fill-gold/40 group-hover:fill-gold/60 transition-colors duration-300" }) })
    }
  );
}
function cardInner(hit) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-video bg-muted relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Thumbnail, { hit }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-2 left-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypeBadge, { hit }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
      hit.category_name && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] uppercase tracking-wider font-semibold text-gold mb-1.5", children: hit.category_name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-foreground line-clamp-2 leading-snug mb-1", children: hit.title }),
      hit.display_author_name && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 h-5 rounded-full bg-primary/10 text-gold text-[10px] font-bold flex items-center justify-center", children: hit.display_author_name.slice(0, 1).toUpperCase() }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground truncate", children: [
          "Taught by",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/90 font-medium", children: hit.display_author_name })
        ] })
      ] }),
      hit.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed", children: hit.description })
    ] })
  ] });
}
function AlgoliaSearchCard({ hit }) {
  const cardClass = "group block rounded-xl overflow-hidden bg-card border border-border shadow-card hover:shadow-card-hover transition-all";
  if (hit.type === "course") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/course/$id", params: { id: hit.id }, className: cardClass, children: cardInner(hit) });
  }
  const directUrl2 = hit.book_url ?? hit.pdf_url ?? null;
  if (directUrl2 && !hit.video_url) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: directUrl2, target: "_blank", rel: "noopener noreferrer", className: cardClass, children: cardInner(hit) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/content/$id", params: { id: hit.id }, className: cardClass, children: cardInner(hit) });
}
const Breadcrumb = reactExports.forwardRef(({ ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { ref, "aria-label": "breadcrumb", ...props }));
Breadcrumb.displayName = "Breadcrumb";
const BreadcrumbList = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "ol",
    {
      ref,
      className: cn(
        "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
        className
      ),
      ...props
    }
  )
);
BreadcrumbList.displayName = "BreadcrumbList";
const BreadcrumbItem = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { ref, className: cn("inline-flex items-center gap-1.5", className), ...props })
);
BreadcrumbItem.displayName = "BreadcrumbItem";
const BreadcrumbLink = reactExports.forwardRef(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Comp,
    {
      ref,
      className: cn("transition-colors hover:text-foreground", className),
      ...props
    }
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";
const BreadcrumbPage = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      ref,
      role: "link",
      "aria-disabled": "true",
      "aria-current": "page",
      className: cn("font-normal text-foreground", className),
      ...props
    }
  )
);
BreadcrumbPage.displayName = "BreadcrumbPage";
const BreadcrumbSeparator = ({ children, className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "li",
  {
    role: "presentation",
    "aria-hidden": "true",
    className: cn("[&>svg]:w-3.5 [&>svg]:h-3.5", className),
    ...props,
    children: children ?? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, {})
  }
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";
function Dashboard() {
  const {
    q
  } = Route$a.useSearch();
  const query = q?.trim() ?? "";
  const searchInputRef = reactExports.useRef(null);
  const [contentFilter, setContentFilter] = reactExports.useState("all");
  const [visibleLessonCount, setVisibleLessonCount] = reactExports.useState(9);
  const [visibleCourseCount, setVisibleCourseCount] = reactExports.useState(9);
  const [visibleAlgoliaCount, setVisibleAlgoliaCount] = reactExports.useState(20);
  reactExports.useEffect(() => {
    setVisibleLessonCount(9);
    setVisibleCourseCount(9);
    setVisibleAlgoliaCount(20);
  }, [contentFilter, query]);
  const categoriesQ = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("categories").select("*").order("order");
      if (error) throw error;
      return data;
    }
  });
  const contentQ = useQuery({
    queryKey: ["content", "published", query],
    queryFn: async () => {
      const term = query.replace(/[%,()]/g, " ").trim();
      let categoryIds = [];
      if (term) {
        const {
          data: cats
        } = await supabase.from("categories").select("id").ilike("name", `%${term}%`);
        categoryIds = (cats ?? []).map((c) => c.id);
      }
      let req = supabase.from("content").select("*, category:categories(name,slug)").eq("status", "published").order("published_at", {
        ascending: false
      });
      if (term) {
        const orParts = [`title.ilike.%${term}%`, `description.ilike.%${term}%`, `tags.cs.{${term}}`];
        if (categoryIds.length) {
          orParts.push(`category_id.in.(${categoryIds.join(",")})`);
        }
        req = req.or(orParts.join(","));
      }
      const {
        data,
        error
      } = await req.limit(100);
      if (error) throw error;
      const authorIds = Array.from(new Set((data ?? []).map((d) => d.author_id).filter(Boolean)));
      let authorsById = /* @__PURE__ */ new Map();
      if (authorIds.length) {
        const {
          data: authors
        } = await supabase.from("author_profiles_public").select("id,full_name,avatar_url,job_title").in("id", authorIds);
        authorsById = new Map((authors ?? []).map((a) => [a.id, a]));
      }
      return (data ?? []).map((row) => ({
        ...row,
        author: row.author_id ? authorsById.get(row.author_id) ?? null : null
      }));
    }
  });
  const BOOK_TITLES = ["Conversion Alchemy System", "New Patient Avalanche System", "New Patient Retention System", "Practice Growth Speaking Secrets"];
  const booksQ = useQuery({
    queryKey: ["dashboard-books"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("content").select("id, title, book_url, book_name").eq("status", "published").eq("content_type", "book");
      if (error) throw error;
      const byTitle = new Map((data ?? []).map((d) => [d.title.toLowerCase().trim(), d]));
      return BOOK_TITLES.map((title) => ({
        title,
        content: byTitle.get(title.toLowerCase()) ?? null
      }));
    }
  });
  const categoryCountsQ = useQuery({
    queryKey: ["category-content-counts"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("content").select("category_id").eq("status", "published").not("category_id", "is", null);
      if (error) throw error;
      const counts = {};
      for (const row of data ?? []) {
        if (row.category_id) {
          counts[row.category_id] = (counts[row.category_id] ?? 0) + 1;
        }
      }
      return counts;
    }
  });
  const coursesQ = useQuery({
    queryKey: ["published-courses"],
    queryFn: async () => {
      const db = supabase;
      const {
        data: courses,
        error
      } = await db.from("courses").select("*, category:categories(name,slug)").eq("status", "published").order("created_at", {
        ascending: false
      });
      if (error) throw error;
      if (!courses || courses.length === 0) return [];
      const courseIds = courses.map((c) => c.id);
      const [{
        data: mods
      }, {
        data: lsns
      }] = await Promise.all([db.from("course_modules").select("id,course_id").in("course_id", courseIds), db.from("course_lessons").select("id,course_id").in("course_id", courseIds)]);
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      const progressMap = /* @__PURE__ */ new Map();
      if (user) {
        const {
          data: prog
        } = await db.from("course_progress").select("course_id").in("course_id", courseIds).eq("user_id", user.id).eq("completed", true);
        for (const p of prog ?? []) progressMap.set(p.course_id, (progressMap.get(p.course_id) ?? 0) + 1);
      }
      const modMap = /* @__PURE__ */ new Map();
      const lsnMap = /* @__PURE__ */ new Map();
      for (const m of mods ?? []) modMap.set(m.course_id, (modMap.get(m.course_id) ?? 0) + 1);
      for (const l of lsns ?? []) lsnMap.set(l.course_id, (lsnMap.get(l.course_id) ?? 0) + 1);
      const mapped = courses.map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        thumbnail_url: c.thumbnail_url,
        display_author_name: c.display_author_name ?? "Dr Ryan Rieder",
        category: c.category,
        module_count: modMap.get(c.id) ?? 0,
        lesson_count: lsnMap.get(c.id) ?? 0,
        completed_count: progressMap.get(c.id) ?? 0,
        status: c.status
      }));
      const seen = /* @__PURE__ */ new Set();
      return mapped.filter((c) => {
        if (seen.has(c.id)) return false;
        seen.add(c.id);
        return true;
      });
    }
  });
  const algoliaQ = useQuery({
    queryKey: ["algolia-search", query],
    enabled: !!query,
    queryFn: async () => {
      const client = getSearchClient();
      if (!client) return null;
      const res = await client.searchSingleIndex({
        indexName: ALGOLIA_INDEX,
        searchParams: {
          query,
          hitsPerPage: 50
        }
      });
      return res.hits ?? [];
    }
  });
  const matchedCategory = categoriesQ.data?.find((c) => c.name.toLowerCase() === query.toLowerCase());
  const algoliaHits = algoliaQ.data ?? null;
  const usingAlgolia = !!query && algoliaHits !== null;
  const algoliaContentHits = usingAlgolia ? algoliaHits.filter((h) => h.type === "content") : [];
  const algoliaCourseHits = usingAlgolia ? algoliaHits.filter((h) => h.type === "course") : [];
  const filteredCourses = usingAlgolia ? algoliaCourseHits.map((h) => ({
    id: h.id,
    title: h.title,
    description: h.description ?? null,
    thumbnail_url: h.thumbnail_url ?? null,
    display_author_name: h.display_author_name ?? "Dr Ryan Rieder",
    category: h.category_name ? {
      name: h.category_name,
      slug: h.category_slug ?? null
    } : null,
    module_count: 0,
    lesson_count: 0,
    completed_count: 0,
    status: "published"
  })) : (coursesQ.data ?? []).filter((c) => {
    if (!query) return true;
    if (matchedCategory) return c.category?.name?.toLowerCase() === matchedCategory.name.toLowerCase();
    const lq = query.toLowerCase();
    return (c.title?.toLowerCase() ?? "").includes(lq) || (c.description?.toLowerCase() ?? "").includes(lq);
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(MemberNav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 flex gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "hidden lg:block w-48 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3", children: "Filter" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "space-y-1", children: [{
          key: "all",
          label: "All Content"
        }, {
          key: "lessons",
          label: "Single Lessons"
        }, {
          key: "courses",
          label: "Courses"
        }].map(({
          key,
          label
        }) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setContentFilter(key), className: "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors " + (contentFilter === key ? "bg-gold/10 text-gold font-semibold" : "text-muted-foreground hover:bg-muted hover:text-foreground"), children: label }, key)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:hidden flex gap-2 mb-6 overflow-x-auto pb-1 -mx-1 px-1", children: [{
          key: "all",
          label: "All Content"
        }, {
          key: "lessons",
          label: "Lessons"
        }, {
          key: "courses",
          label: "Courses"
        }].map(({
          key,
          label
        }) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setContentFilter(key), className: "shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors " + (contentFilter === key ? "bg-gold text-gold-foreground border-gold" : "border-border text-muted-foreground hover:border-gold/40 hover:text-foreground"), children: label }, key)) }),
        matchedCategory && /* @__PURE__ */ jsxRuntimeExports.jsx(Breadcrumb, { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BreadcrumbList, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BreadcrumbItem, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(BreadcrumbLink, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", children: "Home" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(BreadcrumbSeparator, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(BreadcrumbItem, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(BreadcrumbPage, { children: matchedCategory.name }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: `text-center max-w-3xl mx-auto ${query ? "mb-6" : "mb-12"}`, children: [
          !query && /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl md:text-4xl font-extrabold text-foreground mb-6", children: "What do you want to learn today?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(HeroSearch, { inputRef: searchInputRef, isSearching: contentQ.isLoading && !!query }),
          !query && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-4 text-sm", children: "Search the library, or browse by category below." })
        ] }),
        query && !matchedCategory && /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-2xl font-bold mb-6 flex items-center gap-2", children: [
          'Results for "',
          query,
          '"',
          algoliaQ.isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }),
          !algoliaQ.isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-normal text-base", children: [
            "(",
            usingAlgolia ? algoliaHits.length : (contentQ.data?.length ?? 0) + filteredCourses.length,
            ")"
          ] })
        ] }),
        !query && contentFilter !== "courses" && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-12", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold mb-4", children: "Browse by category" }),
          categoriesQ.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3", children: Array.from({
            length: 8
          }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[60px] rounded-xl bg-muted animate-pulse" }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryGrid, { categories: categoriesQ.data, categoryCounts: categoryCountsQ.data })
        ] }),
        !query && contentFilter !== "courses" && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-12", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold mb-4", children: "Tools & Resources" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [{
            title: "Website AI Audit Tool",
            description: "Get a free AI audit of your chiropractic website",
            button: "Open Tool",
            href: "https://audit.dcpracticegrowth.com/",
            icon: Globe
          }, {
            title: "Workshop AI Builder",
            description: "Build your next workshop with AI in minutes",
            button: "Open Tool",
            href: "https://workshop-builder.dcpracticegrowth.com/",
            icon: Sparkles
          }, {
            title: "Book A Call With Ryan",
            description: "Schedule a 1-on-1 strategy call with Ryan directly",
            button: "Book Now",
            href: "https://go.dcpracticegrowth.com/ryans-calendar",
            icon: Calendar
          }, {
            title: "Join The Inner Circle",
            description: "Connect with 300+ chiropractors in Ryan's private Facebook group",
            button: "Join Now",
            href: "https://www.facebook.com/groups/ryanriederinnercircle",
            icon: Users
          }].map((tool) => /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: tool.href, target: "_blank", rel: "noopener noreferrer", className: "group rounded-xl bg-card border border-border p-5 shadow-card hover:shadow-card-hover hover:border-gold transition-all flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-primary/5 text-gold p-2.5 w-fit mb-3 group-hover:bg-gold/10 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(tool.icon, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-sm text-foreground leading-tight mb-1", children: tool.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs leading-relaxed flex-1 mb-4", children: tool.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center justify-center rounded-lg bg-gold text-gold-foreground font-semibold text-xs px-4 py-2 hover:bg-gold/90 transition-colors", children: tool.button })
          ] }, tool.title)) })
        ] }),
        !query && contentFilter !== "courses" && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-12", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold", children: "Ryan's Books" }) }),
          booksQ.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: Array.from({
            length: 4
          }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[140px] rounded-xl bg-muted animate-pulse" }, i)) }) : null,
          !booksQ.isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [{
            title: "Conversion Alchemy System",
            desc: "Step-by-step what to say to patients so they pay without friction or hard sales tactics.",
            cover: "/ca.webp"
          }, {
            title: "New Patient Avalanche System",
            desc: "How to grow a seven figure chiropractic practice from six figures or less.",
            cover: "/npa.webp"
          }, {
            title: "New Patient Retention System",
            desc: "Your system to attract, retain and grow a loyal patient base that stays for life.",
            cover: "/prs.png"
          }, {
            title: "Practice Growth Speaking Secrets",
            desc: "How Ryan used live events and workshops to generate consistent high quality new patients.",
            cover: "/ss.webp"
          }].map((book) => {
            const match = booksQ.data?.find((b) => b.title === book.title);
            const content = match?.content;
            const contentId = content?.id ?? null;
            const bookUrl = content?.book_url ?? null;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group relative rounded-xl bg-primary border border-primary/80 overflow-hidden hover:border-gold/60 transition-all shadow-card flex", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-28 sm:w-32 shrink-0 relative overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: book.cover, alt: book.title, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 p-4 flex flex-col justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-extrabold text-primary-foreground text-sm leading-tight mb-1", children: book.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-primary-foreground/70 leading-relaxed", children: book.desc })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3", children: bookUrl ? /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: bookUrl, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-2 rounded-lg bg-gold text-gold-foreground font-semibold text-xs px-3 py-1.5 hover:bg-gold/90 transition-colors", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3.5 w-3.5" }),
                  "Download Free Book"
                ] }) : contentId ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/content/$id", params: {
                  id: contentId
                }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2 rounded-lg bg-gold text-gold-foreground font-semibold text-xs px-3 py-1.5 hover:bg-gold/90 transition-colors", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3.5 w-3.5" }),
                  "Download Free Book"
                ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2 rounded-lg bg-gold/30 text-gold-foreground/50 font-semibold text-xs px-3 py-1.5 cursor-not-allowed", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3.5 w-3.5" }),
                  "Coming Soon"
                ] }) })
              ] })
            ] }, book.title);
          }) })
        ] }),
        usingAlgolia && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mb-10", children: algoliaQ.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5", children: Array.from({
          length: 6
        }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[16/12] rounded-xl bg-muted animate-pulse" }, i)) }) : algoliaHits.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            searchInputRef.current?.focus();
            searchInputRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "center"
            });
          }, className: "mx-auto mb-6 w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center cursor-pointer hover:bg-primary/10 transition-colors", "aria-label": "Focus search bar", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-8 w-8 text-gold" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display text-xl font-bold text-foreground mb-2", children: [
            'No results for "',
            query,
            '"'
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-md mx-auto mb-10", children: 'Try different keywords — for example "new patient" instead of "how do I get more new patients"' }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display text-lg font-bold text-foreground mb-4", children: "Browse by category instead" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryGrid, { categories: categoriesQ.data, categoryCounts: categoryCountsQ.data }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard", className: "text-sm text-primary hover:text-gold transition-colors inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "←" }),
              " Back to dashboard"
            ] }) })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5", children: algoliaHits.slice(0, visibleAlgoliaCount).map((hit) => /* @__PURE__ */ jsxRuntimeExports.jsx(AlgoliaSearchCard, { hit }, hit.objectID)) }),
          visibleAlgoliaCount < algoliaHits.length && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setVisibleAlgoliaCount((n) => n + 20), className: "px-6 py-2.5 rounded-full border-2 border-border hover:border-gold text-sm font-medium text-muted-foreground hover:text-foreground transition-colors", children: [
            "Load More (",
            algoliaHits.length - visibleAlgoliaCount,
            " remaining)"
          ] }) })
        ] }) }),
        !usingAlgolia && contentFilter !== "lessons" && filteredCourses.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "h-5 w-5 text-gold" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold", children: "Courses" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
              "(",
              filteredCourses.length,
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5", children: filteredCourses.slice(0, visibleCourseCount).map((course) => /* @__PURE__ */ jsxRuntimeExports.jsx(CourseCard, { item: course }, course.id)) }),
          visibleCourseCount < filteredCourses.length && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setVisibleCourseCount((n) => n + 9), className: "px-6 py-2.5 rounded-full border-2 border-border hover:border-gold text-sm font-medium text-muted-foreground hover:text-foreground transition-colors", children: [
            "Load More (",
            filteredCourses.length - visibleCourseCount,
            " remaining)"
          ] }) })
        ] }),
        !usingAlgolia && contentFilter !== "courses" && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-xl font-bold mb-4 flex items-center gap-2", children: [
            query ? "Matching lessons" : "Recently added",
            (contentQ.isLoading || algoliaQ.isLoading) && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin text-muted-foreground" })
          ] }),
          (usingAlgolia ? algoliaQ.isLoading : contentQ.isLoading) ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5", children: Array.from({
            length: 3
          }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[16/12] rounded-xl bg-muted animate-pulse" }, i)) }) : (usingAlgolia ? algoliaContentHits : contentQ.data ?? []).length === 0 ? query ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
              searchInputRef.current?.focus();
              searchInputRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center"
              });
            }, className: "mx-auto mb-6 w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center cursor-pointer hover:bg-primary/10 transition-colors", "aria-label": "Focus search bar", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-8 w-8 text-gold" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display text-xl font-bold text-foreground mb-2", children: [
              'No results for "',
              query,
              '"'
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-md mx-auto mb-10", children: 'Try shorter keywords — for example search "new patient" instead of "how to get new patients"' }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display text-lg font-bold text-foreground mb-4", children: "Browse by category instead" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryGrid, { categories: categoriesQ.data, categoryCounts: categoryCountsQ.data }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard", className: "text-sm text-primary hover:text-gold transition-colors inline-flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "←" }),
                " Back to dashboard"
              ] }) })
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-16 rounded-xl bg-card border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "No content published yet. Check back soon." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5", children: (usingAlgolia ? algoliaContentHits.map((h) => ({
              id: h.id,
              title: h.title,
              description: h.description ?? null,
              thumbnail_url: h.thumbnail_url ?? null,
              video_url: h.video_url ?? null,
              pdf_url: h.pdf_url ?? null,
              book_url: h.book_url ?? null,
              content_type: h.content_type ?? null,
              display_author_name: h.display_author_name ?? null,
              category: h.category_name ? {
                name: h.category_name,
                slug: h.category_slug ?? null
              } : null
            })) : contentQ.data ?? []).slice(0, visibleLessonCount).map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(ContentCard, { item }, item.id)) }),
            (() => {
              const total = usingAlgolia ? algoliaContentHits.length : (contentQ.data ?? []).length;
              return visibleLessonCount < total ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setVisibleLessonCount((n) => n + 9), className: "px-6 py-2.5 rounded-full border-2 border-border hover:border-gold text-sm font-medium text-muted-foreground hover:text-foreground transition-colors", children: [
                "Load More (",
                total - visibleLessonCount,
                " remaining)"
              ] }) }) : null;
            })()
          ] })
        ] })
      ] })
    ] })
  ] });
}
const SEARCH_PLACEHOLDERS = ["Search for marketing strategies...", "Find Ryan's Facebook Ads training...", "How do I grow my new patient numbers...", "Search quarterly meeting training..."];
function HeroSearch({
  inputRef,
  isSearching = false
}) {
  const navigate = useNavigate();
  const [q, setQ] = reactExports.useState("");
  const [phIdx, setPhIdx] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const t = setInterval(() => setPhIdx((i) => (i + 1) % SEARCH_PLACEHOLDERS.length), 3e3);
    return () => clearInterval(t);
  }, []);
  const onSubmit = async (e) => {
    e.preventDefault();
    const term = q.trim();
    if (term) {
      const {
        data
      } = await supabase.auth.getUser();
      if (data.user?.id) {
        supabase.from("search_logs").insert({
          query: term,
          user_id: data.user.id
        }).then(() => {
        });
      }
    }
    navigate({
      to: "/dashboard",
      search: {
        q
      }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "relative w-full max-w-2xl mx-auto", children: [
    isSearching ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gold animate-spin pointer-events-none" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: inputRef, value: q, onChange: (e) => setQ(e.target.value), placeholder: SEARCH_PLACEHOLDERS[phIdx], "aria-label": "Search library", style: {
      fontSize: "16px"
    }, className: "w-full h-14 pl-12 sm:pl-14 pr-24 sm:pr-32 rounded-full border-2 border-border bg-card shadow-card transition-all focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/20 placeholder:text-muted-foreground/70" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled: isSearching, className: "absolute right-2 top-1/2 -translate-y-1/2 h-10 px-3 sm:px-5 rounded-full bg-gold text-gold-foreground font-semibold text-sm hover:bg-gold/90 transition-colors whitespace-nowrap disabled:opacity-70 inline-flex items-center gap-1.5", children: [
      isSearching && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }),
      isSearching ? "Searching…" : "Search"
    ] })
  ] });
}
function CategoryGrid({
  categories,
  categoryCounts
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3", children: (categories ?? []).map((c) => {
    const Icon = Icons[c.icon ?? "Folder"] ?? Folder;
    const count = categoryCounts?.[c.id] ?? 0;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard", search: {
      q: c.name
    }, className: "group relative rounded-xl bg-card border border-border p-4 shadow-card hover:shadow-card-hover hover:border-gold transition-all flex items-center gap-3", children: [
      count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-2.5 right-2.5 min-w-[1.25rem] h-5 px-1.5 rounded-full bg-gold text-gold-foreground text-[10px] font-bold flex items-center justify-center leading-none", children: count }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-primary/5 text-primary p-2.5 group-hover:bg-gold/10 group-hover:text-gold transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-sm text-foreground leading-tight pr-5", children: c.name })
    ] }, c.id);
  }) });
}
export {
  Dashboard as component
};
