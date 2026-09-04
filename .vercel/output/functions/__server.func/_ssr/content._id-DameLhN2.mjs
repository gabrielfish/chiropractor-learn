import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { T as notFound } from "../_libs/tanstack__router-core.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { s as supabase } from "./client-IF66mSk9.mjs";
import { M as MemberNav } from "./MemberNav-C9W_HKgq.mjs";
import { B as Button, c as cn } from "./button-BXrfXN_b.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { c as confetti } from "../_libs/canvas-confetti.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription } from "./dialog-pXddDSBH.mjs";
import { b as checkAndIssueCategory } from "./certificates.functions-DY-Kix5X.mjs";
import { g as Route$6 } from "./router-BgAMxlwC.mjs";
import "../_libs/seroval.mjs";
import { A as ArrowLeft, L as LoaderCircle, o as CircleCheck, F as FileText, W as Book, D as Download, V as Facebook, Y as MessageCircle, Z as Twitter, f as Linkedin } from "../_libs/lucide-react.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
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
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
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
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "./createSsrRpc-Bc62EJ78.mjs";
import "./server-BomfFVcN.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-dN1VnyDc.mjs";
import "../_libs/zod.mjs";
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
function youtubeEmbed(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (!m) return null;
  return `https://www.youtube.com/embed/${m[1]}?rel=0&modestbranding=1`;
}
function isYoutube(url) {
  return !!url && /(?:youtube\.com|youtu\.be)/.test(url);
}
function VideoPlayer({
  videoUrl,
  title = "Video",
  posterUrl,
  className = ""
}) {
  const wrapClass = `aspect-video w-full rounded-xl overflow-hidden bg-black shadow-card ${className}`;
  const ytEmbed = youtubeEmbed(videoUrl);
  if (ytEmbed) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: wrapClass, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "iframe",
      {
        src: ytEmbed,
        title,
        allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
        allowFullScreen: true,
        className: "w-full h-full border-0"
      }
    ) });
  }
  if (videoUrl && !isYoutube(videoUrl)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: wrapClass, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "video",
      {
        src: videoUrl,
        controls: true,
        playsInline: true,
        poster: posterUrl ?? void 0,
        className: "w-full h-full",
        controlsList: "nodownload"
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${wrapClass} flex items-center justify-center`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "No video for this lesson" }) });
}
function LessonCompleteModal({ open, onClose, lessonTitle }) {
  reactExports.useEffect(() => {
    if (!open) return;
    const end = Date.now() + 1200;
    const colors = ["#C9A24A", "#0B1B3A", "#ffffff"];
    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 70, origin: { x: 0 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 70, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
    confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 }, colors });
  }, [open]);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const casualMsg = `I just completed ${lessonTitle} taught by Ryan Rieder on the DCPG Membership Portal! #ChiropracticGrowth #DCPG`;
  const shortMsg = `Just completed "${lessonTitle}" with Ryan Rieder on the DCPG Membership Portal! #ChiropracticGrowth #DCPG`;
  const proMsg = `Just completed ${lessonTitle} — Ryan Rieder's chiropractic growth training. Highly recommend for any chiropractor looking to grow their practice. #Chiropractic #PracticeGrowth`;
  const shares = [
    {
      label: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(casualMsg)}`
    },
    {
      label: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodeURIComponent(`${casualMsg} ${shareUrl}`)}`
    },
    {
      label: "X / Twitter",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shortMsg)}&url=${encodeURIComponent(shareUrl)}`
    },
    {
      label: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(proMsg)}`
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md bg-card border-border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-2xl text-center text-foreground", children: "Lesson Complete! 🎉" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-center text-gold font-medium pt-1", children: lessonTitle })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-sm text-muted-foreground", children: "Share your win" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: shares.map(({ label, icon: Icon, href }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          asChild: true,
          variant: "outline",
          className: "border-gold/40 text-foreground hover:bg-gold/10 hover:text-foreground",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href, target: "_blank", rel: "noopener noreferrer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 mr-2 text-gold" }),
            " ",
            label
          ] })
        },
        label
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: onClose,
          className: "w-full bg-gold text-gold-foreground hover:bg-gold/90 mt-2",
          children: "Continue Learning"
        }
      )
    ] })
  ] }) });
}
function ContentDetail() {
  const {
    id
  } = Route$6.useParams();
  const {
    user
  } = Route$6.useRouteContext();
  const qc = useQueryClient();
  const [commentBody, setCommentBody] = reactExports.useState("");
  const [celebrateOpen, setCelebrateOpen] = reactExports.useState(false);
  const checkAndIssueCategoryF = useServerFn(checkAndIssueCategory);
  const contentQ = useQuery({
    queryKey: ["content", id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("content").select("*, category:categories(name,slug)").eq("id", id).single();
      if (error) throw error;
      if (!data) throw notFound();
      let author = null;
      if (data.author_id) {
        const {
          data: a
        } = await supabase.from("author_profiles_public").select("full_name,avatar_url,job_title").eq("id", data.author_id).maybeSingle();
        author = a ?? null;
      }
      return {
        ...data,
        author
      };
    }
  });
  const progressQ = useQuery({
    queryKey: ["progress", id, user.id],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("progress").select("*").eq("user_id", user.id).eq("content_id", id).maybeSingle();
      return data;
    }
  });
  const commentsQ = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("comments").select("*, author:profiles(full_name,avatar_url)").eq("content_id", id).order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data;
    }
  });
  const markComplete = useMutation({
    mutationFn: async () => {
      const {
        error
      } = await supabase.from("progress").upsert({
        user_id: user.id,
        content_id: id,
        completed: true,
        completed_at: (/* @__PURE__ */ new Date()).toISOString()
      }, {
        onConflict: "user_id,content_id"
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["progress", id, user.id]
      });
      setCelebrateOpen(true);
      checkAndIssueCategoryF({
        data: {
          contentId: id
        }
      }).then((result) => {
        if (result?.issued && result?.certificateId) {
          toast.success(`🎓 Category Certificate earned! View →`, {
            action: {
              label: "View",
              onClick: () => window.open(`/certificate/${result.certificateId}`, "_blank")
            },
            duration: 8e3
          });
        }
      }).catch(() => {
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const postComment = useMutation({
    mutationFn: async () => {
      const body = commentBody.trim();
      if (!body) throw new Error("Comment cannot be empty");
      const {
        error
      } = await supabase.from("comments").insert({
        content_id: id,
        user_id: user.id,
        body
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setCommentBody("");
      qc.invalidateQueries({
        queryKey: ["comments", id]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const item = contentQ.data;
  if (contentQ.isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MemberNav, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-28 rounded bg-muted animate-pulse mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-video w-full rounded-xl bg-muted animate-pulse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 w-24 rounded-full bg-muted animate-pulse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-3/4 rounded-lg bg-muted animate-pulse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-1/2 rounded-lg bg-muted animate-pulse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 rounded bg-muted animate-pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 rounded bg-muted animate-pulse w-5/6" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 rounded bg-muted animate-pulse w-4/6" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-40 rounded-lg bg-muted animate-pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-36 rounded-lg bg-muted animate-pulse" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-36 rounded-xl bg-muted animate-pulse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-28 rounded-xl bg-muted animate-pulse" })
          ] })
        ] })
      ] })
    ] });
  }
  if (!item) return null;
  const completed = !!progressQ.data?.completed;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(MemberNav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard", className: "inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4 mr-1.5" }),
        " Back to library"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(VideoPlayer, { videoUrl: item.video_url, title: item.title, posterUrl: item.thumbnail_url }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6", children: [
            item.category && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-gold/15 text-gold hover:bg-gold/15 border-0 mb-3", children: item.category.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl md:text-4xl font-extrabold text-foreground mb-3", children: item.title }),
            (item.display_author_name || item.author?.full_name) && (() => {
              const displayName = item.display_author_name ?? item.author.full_name;
              const avatarUrl = item.display_author_name ? null : item.author?.avatar_url;
              const jobTitle = item.display_author_name ? null : item.author?.job_title;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5 p-3 rounded-lg bg-card border border-border", children: [
                avatarUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: avatarUrl, alt: "", className: "w-12 h-12 rounded-full object-cover border border-border" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-primary/10 text-gold flex items-center justify-center font-display font-bold", children: displayName.slice(0, 1).toUpperCase() }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wider text-gold font-semibold", children: "Taught by" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-medium truncate", children: displayName }),
                  jobTitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: jobTitle })
                ] })
              ] });
            })(),
            item.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground/80 leading-relaxed whitespace-pre-line", children: item.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 mt-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => markComplete.mutate(), disabled: completed || markComplete.isPending, className: completed ? "bg-success text-success-foreground hover:bg-success" : "bg-gold text-gold-foreground hover:bg-gold/90", children: [
                markComplete.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 mr-2" }),
                markComplete.isPending ? "Saving…" : completed ? "Completed" : "Mark as complete"
              ] }),
              item.pdf_url && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: item.pdf_url, target: "_blank", rel: "noopener noreferrer", download: true, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 mr-2" }),
                " Download PDF"
              ] }) }),
              item.book_url && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: item.book_url, target: "_blank", rel: "noopener noreferrer", download: true, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Book, { className: "h-4 w-4 mr-2" }),
                " Download workbook"
              ] }) })
            ] }),
            item.text_content && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-xl bg-card border border-border p-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3", children: "Notes & Resources" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground/80 text-sm leading-relaxed whitespace-pre-wrap", children: item.text_content })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-12", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-xl font-bold mb-4", children: [
              "Comments ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-normal", children: [
                "(",
                commentsQ.data?.length ?? 0,
                ")"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-card border border-border p-4 mb-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: commentBody, onChange: (e) => setCommentBody(e.target.value), placeholder: "Share your thoughts…", className: "w-full min-h-[80px] resize-y bg-transparent text-sm focus:outline-none" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => postComment.mutate(), disabled: postComment.isPending || !commentBody.trim(), size: "sm", className: "bg-primary hover:bg-primary/90 inline-flex items-center gap-1.5", children: [
                postComment.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }),
                postComment.isPending ? "Posting…" : "Post comment"
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              (commentsQ.data ?? []).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-card border border-border p-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-sm text-foreground", children: c.author?.full_name ?? "Member" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: new Date(c.created_at).toLocaleDateString() })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/80 whitespace-pre-line", children: c.body })
              ] }, c.id)),
              (commentsQ.data ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-6", children: "Be the first to comment." })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-card border border-border p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold mb-3", children: "Resources" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm", children: [
              item.video_url && /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2 text-foreground/80", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-success" }),
                " Video lesson"
              ] }),
              item.pdf_url && /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2 text-foreground/80", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 text-gold" }),
                " ",
                item.pdf_name ?? "PDF"
              ] }),
              item.book_url && /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2 text-foreground/80", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 text-gold" }),
                " ",
                item.book_name ?? "Workbook"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-primary text-primary-foreground p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold mb-2", children: "Keep growing" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-primary-foreground/80 mb-3", children: "Mark lessons complete to earn category certificates." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", className: "text-gold text-sm font-medium hover:underline", children: "Browse more lessons →" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LessonCompleteModal, { open: celebrateOpen, onClose: () => setCelebrateOpen(false), lessonTitle: item.title })
  ] });
}
export {
  ContentDetail as component
};
