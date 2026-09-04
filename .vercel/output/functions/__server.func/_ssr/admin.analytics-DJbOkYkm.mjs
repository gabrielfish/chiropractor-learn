import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-IF66mSk9.mjs";
import { A as AdminSidebar } from "./AdminSidebar-D42diM0w.mjs";
import { U as Users, F as FileText, b as Eye, a8 as Activity, N as ChartColumn } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, B as BarChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, a as Bar, L as LineChart, b as Line } from "../_libs/recharts.mjs";
import { f as formatDistanceToNow, a as format } from "../_libs/date-fns.mjs";
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
import "../_libs/tanstack__react-router.mjs";
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
import "../_libs/clsx.mjs";
import "../_libs/lodash.mjs";
import "../_libs/react-smooth.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/fast-equals.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/react-is.mjs";
import "../_libs/d3-shape.mjs";
import "../_libs/d3-path.mjs";
import "../_libs/victory-vendor.mjs";
import "../_libs/d3-scale.mjs";
import "../_libs/internmap.mjs";
import "../_libs/d3-array.mjs";
import "../_libs/d3-time-format.mjs";
import "../_libs/d3-time.mjs";
import "../_libs/d3-interpolate.mjs";
import "../_libs/d3-color.mjs";
import "../_libs/d3-format.mjs";
import "../_libs/recharts-scale.mjs";
import "../_libs/decimal.js-light.mjs";
import "../_libs/eventemitter3.mjs";
function AnalyticsPage() {
  const statsQ = useQuery({
    queryKey: ["analytics", "stats"],
    queryFn: async () => {
      const monthAgo = new Date(Date.now() - 30 * 864e5).toISOString();
      const weekAgo = new Date(Date.now() - 7 * 864e5).toISOString();
      const [members, content, viewsRow, active] = await Promise.all([supabase.from("profiles").select("id", {
        count: "exact",
        head: true
      }), supabase.from("content").select("id", {
        count: "exact",
        head: true
      }).eq("status", "published"), supabase.from("content").select("views").gte("published_at", monthAgo), supabase.from("profiles").select("id", {
        count: "exact",
        head: true
      }).gte("last_login", weekAgo)]);
      const totalViews = (viewsRow.data ?? []).reduce((s2, r) => s2 + (r.views ?? 0), 0);
      return {
        members: members.count ?? 0,
        content: content.count ?? 0,
        views: totalViews,
        active: active.count ?? 0
      };
    }
  });
  const topContentQ = useQuery({
    queryKey: ["analytics", "top-content"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("content").select("id,title,views").eq("status", "published").order("views", {
        ascending: false
      }).limit(10);
      if (error) throw error;
      return data;
    }
  });
  const signupsQ = useQuery({
    queryKey: ["analytics", "signups"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.rpc("analytics_signups_by_month");
      if (error) throw error;
      return (data ?? []).map((r) => ({
        month: format(new Date(r.month), "MMM yy"),
        count: Number(r.count)
      }));
    }
  });
  const topSearchesQ = useQuery({
    queryKey: ["analytics", "top-searches"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.rpc("analytics_top_searches", {
        days: 7,
        lim: 20
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  const zeroSearchesQ = useQuery({
    queryKey: ["analytics", "zero-searches"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.rpc("analytics_zero_result_searches", {
        days: 30,
        lim: 20
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  const recentMembersQ = useQuery({
    queryKey: ["analytics", "recent-members"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.rpc("analytics_recent_members", {
        lim: 10
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  const topCommentedQ = useQuery({
    queryKey: ["analytics", "top-commented"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("content").select("id, title, comments(count)").eq("status", "published");
      if (error) throw error;
      return (data ?? []).map((c) => ({
        id: c.id,
        title: c.title,
        count: c.comments?.[0]?.count ?? 0
      })).sort((a, b) => b.count - a.count).slice(0, 5);
    }
  });
  const s = statsQ.data;
  const stats = [{
    label: "Total Members",
    value: s?.members ?? 0,
    icon: Users
  }, {
    label: "Content Published",
    value: s?.content ?? 0,
    icon: FileText
  }, {
    label: "Views This Month",
    value: s?.views ?? 0,
    icon: Eye
  }, {
    label: "Active This Week",
    value: s?.active ?? 0,
    icon: Activity
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col md:flex-row bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AdminSidebar, { active: "analytics" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 pt-14 px-6 pb-6 md:p-10 overflow-x-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-extrabold mb-1", children: "Analytics" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-8", children: "How members are using the portal." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8", children: stats.map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-card border border-border p-5 shadow-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: stat.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(stat.icon, { className: "h-4 w-4 text-gold" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-3xl font-extrabold", children: stat.value })
      ] }, stat.label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Top 10 Most Viewed Content", children: (topContentQ.data ?? []).length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: topContentQ.data ?? [], layout: "vertical", margin: {
          left: 10,
          right: 16
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--border))" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { type: "number", stroke: "var(--muted-foreground))", fontSize: 12 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { type: "category", dataKey: "title", width: 140, stroke: "var(--muted-foreground))", fontSize: 11, tickFormatter: (v) => v.length > 22 ? v.slice(0, 22) + "…" : v }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { cursor: {
            fill: "var(--muted))"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "views", fill: "var(--gold))", radius: [0, 4, 4, 0] })
        ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyChartMessage, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "New Members — Last 12 Months", children: (signupsQ.data ?? []).length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(LineChart, { data: signupsQ.data ?? [], margin: {
          left: 10,
          right: 16
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--border))" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "month", stroke: "var(--muted-foreground))", fontSize: 12 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { stroke: "var(--muted-foreground))", fontSize: 12, allowDecimals: false }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Line, { type: "monotone", dataKey: "count", stroke: "var(--gold))", strokeWidth: 2, dot: {
            r: 4
          } })
        ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyChartMessage, {}) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Search Intelligence — This Week", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Table, { headers: ["Query", "Searches", "Matches"], rows: (topSearchesQ.data ?? []).map((r) => [r.query, r.search_count, r.match_count]), empty: "No searches logged yet." }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Zero-Result Searches — Content Gaps", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Table, { headers: ["Query", "Searches", "Last Searched"], rows: (zeroSearchesQ.data ?? []).map((r) => [r.query, r.search_count, formatDistanceToNow(new Date(r.last_searched), {
          addSuffix: true
        })]), empty: "No content gaps detected." }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Most Recently Active Members", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Table, { headers: ["Member", "Last Login", "Completed"], rows: (recentMembersQ.data ?? []).map((m) => [m.full_name ?? m.email ?? "—", formatDistanceToNow(new Date(m.last_login), {
          addSuffix: true
        }), m.completed_count]), empty: "No active members yet." }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Most Commented Content", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Table, { headers: ["Title", "Comments"], rows: (topCommentedQ.data ?? []).map((c) => [c.title, c.count]), empty: "No comments yet." }) })
      ] })
    ] }) })
  ] });
}
function EmptyChartMessage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-[300px] text-center px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-10 w-10 text-gold/40 mb-3" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs", children: "Analytics will populate as members watch content and search the library." })
  ] });
}
function Card({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-xl bg-card border border-border p-5 shadow-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-bold mb-4", children: title }),
    children
  ] });
}
function Table({
  headers,
  rows,
  empty
}) {
  if (!rows.length) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center justify-center py-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: empty }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border", children: headers.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 pr-4 font-medium", children: h }, h)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: rows.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border/50 last:border-0", children: r.map((cell, j) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 pr-4", children: cell }, j)) }, i)) })
  ] }) });
}
export {
  AnalyticsPage as component
};
