import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { A as AdminSidebar } from "./AdminSidebar-B6Sw1hS_.mjs";
import { b as syncAllToAlgolia } from "./algolia-sync.functions-Ba0tDuby.mjs";
import { c as createSsrRpc } from "./createSsrRpc-D1HIuwD_.mjs";
import { a as createServerFn } from "./server-DAhjTOZR.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CINWQ1Vb.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { I as Input } from "./input-DwaGuH4D.mjs";
import { L as Label } from "./label-Brw405F4.mjs";
import "../_libs/seroval.mjs";
import { a3 as Database, R as RefreshCw, t as CircleCheck, a4 as CircleAlert, a5 as Youtube, a6 as ListVideo, W as Settings } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "../_libs/isbot.mjs";
import "./client-IF66mSk9.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
const syncYouTubeChannel = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((d) => d).handler(createSsrRpc("f39fea9a3640ebcc37121656a0c70737a227069f1bed2e22290b5ebf7fa3edf4"));
const syncAllYouTubeChannelPlaylists = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((d) => d).handler(createSsrRpc("050f3859c4feb51275ebcb1d6ae4d56a2da3cbb43beac63d7d1bf7ebfbd710b4"));
const syncYouTubePlaylist = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((d) => d).handler(createSsrRpc("8d132d3f419e70820af80d91bd0061ebf09e297bc39957bc78a345c233e22f6f"));
function SettingsPage() {
  const syncAllFn = useServerFn(syncAllToAlgolia);
  const syncChannelFn = useServerFn(syncYouTubeChannel);
  const syncPlaylistFn = useServerFn(syncYouTubePlaylist);
  const syncAllPlaylistsFn = useServerFn(syncAllYouTubeChannelPlaylists);
  const [syncResult, setSyncResult] = reactExports.useState(null);
  const [ytChannelId, setYtChannelId] = reactExports.useState("");
  const [ytPlaylistId, setYtPlaylistId] = reactExports.useState("");
  const [ytCourseTitle, setYtCourseTitle] = reactExports.useState("");
  const [ytMaxResults, setYtMaxResults] = reactExports.useState(50);
  const [ytMaxPerPlaylist, setYtMaxPerPlaylist] = reactExports.useState(200);
  const [ytPublishedAfter, setYtPublishedAfter] = reactExports.useState("");
  const [ytForceUpdate, setYtForceUpdate] = reactExports.useState(false);
  const [ytProgress, setYtProgress] = reactExports.useState(null);
  const [ytResult, setYtResult] = reactExports.useState(null);
  const [ytCourseResult, setYtCourseResult] = reactExports.useState(null);
  const [ytAllResult, setYtAllResult] = reactExports.useState(null);
  const syncMut = useMutation({
    mutationFn: () => syncAllFn({
      data: void 0
    }),
    onSuccess: (result) => {
      setSyncResult(result);
    }
  });
  const ytChannelMut = useMutation({
    mutationFn: () => {
      setYtProgress(ytForceUpdate ? "Fetching videos and updating existing records…" : "Fetching videos from YouTube channel…");
      setYtResult(null);
      return syncChannelFn({
        data: {
          channelId: ytChannelId.trim(),
          maxResults: ytMaxResults,
          publishedAfter: ytPublishedAfter || void 0,
          forceUpdate: ytForceUpdate
        }
      });
    },
    onSuccess: (result) => {
      const r = result;
      setYtResult(r);
      setYtProgress(null);
    },
    onError: () => {
      setYtProgress(null);
    }
  });
  const ytPlaylistMut = useMutation({
    mutationFn: () => {
      setYtProgress("Fetching playlist and creating course…");
      setYtCourseResult(null);
      return syncPlaylistFn({
        data: {
          playlistId: ytPlaylistId.trim(),
          maxResults: ytMaxResults,
          publishedAfter: ytPublishedAfter || void 0,
          courseTitle: ytCourseTitle.trim() || void 0
        }
      });
    },
    onSuccess: (result) => {
      const r = result;
      setYtCourseResult(r);
      setYtProgress(null);
    },
    onError: () => {
      setYtProgress(null);
    }
  });
  const ytAllPlaylistsMut = useMutation({
    mutationFn: () => {
      setYtProgress("Fetching all playlists from channel…");
      setYtAllResult(null);
      return syncAllPlaylistsFn({
        data: {
          channelId: ytChannelId.trim(),
          maxVideosPerPlaylist: ytMaxPerPlaylist
        }
      });
    },
    onSuccess: (result) => {
      const r = result;
      setYtAllResult(r);
      setYtProgress(null);
    },
    onError: () => {
      setYtProgress(null);
    }
  });
  const ytBusy = ytChannelMut.isPending || ytPlaylistMut.isPending || ytAllPlaylistsMut.isPending;
  const progressLabel = ytAllPlaylistsMut.isPending ? ytProgress ?? "Syncing all playlists — this may take several minutes for large channels…" : ytProgress ?? "Importing… this may take a minute.";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col md:flex-row bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AdminSidebar, { active: "settings" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 pt-14 px-4 pb-4 sm:px-6 sm:pb-6 md:p-10 overflow-x-hidden min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-extrabold mb-1", children: "Settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-8", children: "Portal configuration and maintenance tools." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl bg-card border border-border p-6 shadow-card mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "h-5 w-5 text-blue-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-bold mb-1", children: "Algolia Search Index" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mb-5", children: [
            "Sync all published content and courses to the Algolia search index (",
            /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-xs bg-muted px-1.5 py-0.5 rounded font-mono", children: "dcpg_content" }),
            "). Run this after bulk-importing content, or if search results seem out of date. New content is indexed automatically when published."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => {
              setSyncResult(null);
              syncMut.mutate();
            }, disabled: syncMut.isPending, className: "bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `h-4 w-4 ${syncMut.isPending ? "animate-spin" : ""}` }),
              syncMut.isPending ? "Syncing…" : "Sync All Content to Algolia"
            ] }),
            syncResult && !syncMut.isPending && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-green-600 dark:text-green-400", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Synced ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: syncResult.total }),
                " records —",
                " ",
                syncResult.contentCount,
                " lessons, ",
                syncResult.courseCount,
                " courses"
              ] })
            ] }),
            syncMut.isError && !syncMut.isPending && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-destructive", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: syncMut.error.message })
            ] })
          ] }),
          syncMut.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xs text-muted-foreground animate-pulse", children: "Fetching all published content from Supabase and pushing to Algolia…" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl bg-card border border-border p-6 shadow-card mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Youtube, { className: "h-5 w-5 text-red-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-bold mb-1", children: "YouTube Sync" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Channel sync" }),
            " imports each video as an individual draft content entry. ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Playlist sync" }),
            " creates a full",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "draft Course" }),
            " with one Module and a Lesson per video — ideal for structured learning programs. Categories are auto-assigned by AI."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 mb-5 p-4 rounded-lg bg-muted/40 border border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "yt-channel", children: "Channel ID" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "yt-channel", placeholder: "e.g. UCxxxxxxxxxxxxxxxxxxxxxx", value: ytChannelId, onChange: (e) => setYtChannelId(e.target.value), disabled: ytBusy })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "yt-max", children: "Max videos (channel/playlist sync)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "yt-max", type: "number", min: 1, max: 200, value: ytMaxResults, onChange: (e) => setYtMaxResults(Math.max(1, Math.min(200, Number(e.target.value) || 50))), disabled: ytBusy })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "yt-after", children: "Published after (optional)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "yt-after", type: "date", value: ytPublishedAfter, onChange: (e) => setYtPublishedAfter(e.target.value), disabled: ytBusy })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => {
                  setYtResult(null);
                  ytChannelMut.mutate();
                }, disabled: !ytChannelId.trim() || ytBusy, className: "bg-red-600 hover:bg-red-700 text-white inline-flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `h-4 w-4 ${ytChannelMut.isPending ? "animate-spin" : ""}` }),
                  ytChannelMut.isPending ? "Syncing…" : "Sync Channel → Lessons"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm cursor-pointer select-none", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: ytForceUpdate, onChange: (e) => setYtForceUpdate(e.target.checked), disabled: ytBusy, className: "h-4 w-4 accent-red-600" }),
                  "Force update existing records"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                "Imports up to ",
                ytMaxResults,
                " recent videos from the channel's upload feed as individual draft lessons.",
                ytForceUpdate && " Force update will patch video_url and youtube_video_id on existing records matched by title."
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "or sync a single playlist" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Playlist ID" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded", children: "Creates 1 Course" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "e.g. PLxxxxxxxxxxxxxxxxxxxxxx", value: ytPlaylistId, onChange: (e) => setYtPlaylistId(e.target.value), disabled: ytBusy, className: "flex-1 min-w-[200px]" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => {
                  setYtCourseResult(null);
                  ytPlaylistMut.mutate();
                }, disabled: !ytPlaylistId.trim() || ytBusy, className: "bg-red-600 hover:bg-red-700 text-white inline-flex items-center gap-2 shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `h-4 w-4 ${ytPlaylistMut.isPending ? "animate-spin" : ""}` }),
                  ytPlaylistMut.isPending ? "Creating Course…" : "Sync Playlist → Course"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "yt-course-title", className: "text-xs text-muted-foreground", children: "Course name override (optional — defaults to playlist title)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "yt-course-title", placeholder: "e.g. Advanced Chiropractic Techniques", value: ytCourseTitle, onChange: (e) => setYtCourseTitle(e.target.value), disabled: ytBusy })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "or sync all playlists at once" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-muted/20 p-4 space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ListVideo, { className: "h-4 w-4 text-red-500 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Sync All Playlists → All Courses" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded", children: "Uses Channel ID above" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Fetches every playlist on the channel and creates one draft Course per playlist. Playlists whose title matches an existing course are skipped automatically. Each course gets up to the limit below in lessons." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "yt-max-per-playlist", className: "text-xs", children: "Max lessons per course (default 200)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "yt-max-per-playlist", type: "number", min: 1, max: 500, value: ytMaxPerPlaylist, onChange: (e) => setYtMaxPerPlaylist(Math.max(1, Math.min(500, Number(e.target.value) || 200))), disabled: ytBusy, className: "max-w-[140px]" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => {
                setYtAllResult(null);
                ytAllPlaylistsMut.mutate();
              }, disabled: !ytChannelId.trim() || ytBusy, className: "bg-red-700 hover:bg-red-800 text-white inline-flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `h-4 w-4 ${ytAllPlaylistsMut.isPending ? "animate-spin" : ""}` }),
                ytAllPlaylistsMut.isPending ? "Syncing all playlists…" : "Sync All Playlists → All Courses"
              ] })
            ] }),
            ytBusy && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-muted/60 border border-border p-3 text-sm text-muted-foreground animate-pulse", children: progressLabel }),
            ytResult && !ytBusy && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 text-sm text-green-600 dark:text-green-400 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Done!",
                " ",
                ytResult.imported > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: ytResult.imported }),
                  " imported as drafts"
                ] }),
                ytResult.imported > 0 && (ytResult.updated > 0 || ytResult.skipped > 0) && ", ",
                ytResult.updated > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: ytResult.updated }),
                  " updated (video_url + youtube_video_id)"
                ] }),
                ytResult.updated > 0 && ytResult.skipped > 0 && ", ",
                ytResult.skipped > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: ytResult.skipped }),
                  " skipped"
                ] }),
                ytResult.imported === 0 && ytResult.updated === 0 && ytResult.skipped === 0 && "Nothing to process",
                "."
              ] })
            ] }),
            ytCourseResult && !ytBusy && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 text-sm text-green-600 dark:text-green-400 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Course created as draft: ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                  '"',
                  ytCourseResult.courseTitle,
                  '"'
                ] }),
                " ",
                "with ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: ytCourseResult.lessonsCreated }),
                " lesson",
                ytCourseResult.lessonsCreated !== 1 ? "s" : "",
                "."
              ] })
            ] }),
            ytAllResult && !ytBusy && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-4 space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 text-sm text-green-600 dark:text-green-400", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Done! ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: ytAllResult.coursesCreated }),
                  " course",
                  ytAllResult.coursesCreated !== 1 ? "s" : "",
                  " created with ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: ytAllResult.lessonsImported }),
                  " total lessons.",
                  ytAllResult.skipped > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: ytAllResult.skipped }),
                    " playlist",
                    ytAllResult.skipped !== 1 ? "s" : "",
                    " skipped."
                  ] }),
                  " ",
                  "(",
                  ytAllResult.total,
                  " playlists found on channel.)"
                ] })
              ] }),
              ytAllResult.results.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-48 overflow-y-auto space-y-1", children: ytAllResult.results.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs flex items-start gap-2", children: [
                r.action === "created" ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-600 dark:text-green-400 shrink-0", children: "✓" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground shrink-0", children: "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: r.action === "skipped" ? "text-muted-foreground" : "text-foreground", children: [
                  r.playlistTitle,
                  r.action === "created" && r.lessonsCreated !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                    " (",
                    r.lessonsCreated,
                    " lessons)"
                  ] }),
                  r.action === "skipped" && r.reason && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                    " — ",
                    r.reason
                  ] })
                ] })
              ] }, i)) })
            ] }),
            (ytChannelMut.isError || ytPlaylistMut.isError || ytAllPlaylistsMut.isError) && !ytBusy && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 text-sm text-destructive rounded-lg bg-destructive/10 border border-destructive/20 p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: (ytChannelMut.error || ytPlaylistMut.error || ytAllPlaylistsMut.error)?.message ?? "Sync failed" })
            ] })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-card border border-border p-8 shadow-card flex flex-col items-center justify-center text-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-8 w-8 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold mb-2", children: "More settings coming soon" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-md", children: "Invite codes, member access controls, and branding options will be available here." })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  SettingsPage as component
};
