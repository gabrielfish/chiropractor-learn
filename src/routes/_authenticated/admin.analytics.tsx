import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminSidebar } from "@/components/AdminSidebar";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from "recharts";
import { Users, FileText, Eye, Activity, BarChart3 } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_authenticated/admin/analytics")({
  head: () => ({ meta: [{ title: "Analytics — DCPG Admin" }] }),
  beforeLoad: ({ context }) => {
    const roles = (context as { roles?: string[] }).roles ?? [];
    if (!roles.includes("super_admin")) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const statsQ = useQuery({
    queryKey: ["analytics", "stats"],
    queryFn: async () => {
      const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString();
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
      const [members, content, viewsRow, active] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("content").select("id", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("content").select("views").gte("published_at", monthAgo),
        supabase.from("profiles").select("id", { count: "exact", head: true }).gte("last_login", weekAgo),
      ]);
      const totalViews = (viewsRow.data ?? []).reduce((s, r) => s + (r.views ?? 0), 0);
      return {
        members: members.count ?? 0,
        content: content.count ?? 0,
        views: totalViews,
        active: active.count ?? 0,
      };
    },
  });

  const topContentQ = useQuery({
    queryKey: ["analytics", "top-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content")
        .select("id,title,views")
        .eq("status", "published")
        .order("views", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
  });

  const signupsQ = useQuery({
    queryKey: ["analytics", "signups"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("analytics_signups_by_month");
      if (error) throw error;
      return (data ?? []).map((r) => ({
        month: format(new Date(r.month), "MMM yy"),
        count: Number(r.count),
      }));
    },
  });

  const topSearchesQ = useQuery({
    queryKey: ["analytics", "top-searches"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("analytics_top_searches", { days: 7, lim: 20 });
      if (error) throw error;
      return data ?? [];
    },
  });

  const zeroSearchesQ = useQuery({
    queryKey: ["analytics", "zero-searches"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("analytics_zero_result_searches", { days: 30, lim: 20 });
      if (error) throw error;
      return data ?? [];
    },
  });

  const recentMembersQ = useQuery({
    queryKey: ["analytics", "recent-members"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("analytics_recent_members", { lim: 10 });
      if (error) throw error;
      return data ?? [];
    },
  });

  const topCommentedQ = useQuery({
    queryKey: ["analytics", "top-commented"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content")
        .select("id, title, comments(count)")
        .eq("status", "published");
      if (error) throw error;
      return (data ?? [])
        .map((c) => ({
          id: c.id,
          title: c.title,
          count: (c.comments as unknown as { count: number }[])?.[0]?.count ?? 0,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    },
  });

  const s = statsQ.data;
  const stats = [
    { label: "Total Members", value: s?.members ?? 0, icon: Users },
    { label: "Content Published", value: s?.content ?? 0, icon: FileText },
    { label: "Views This Month", value: s?.views ?? 0, icon: Eye },
    { label: "Active This Week", value: s?.active ?? 0, icon: Activity },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar active="analytics" />
      <main className="flex-1 p-6 md:p-10 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-display text-3xl font-extrabold mb-1">Analytics</h1>
          <p className="text-muted-foreground mb-8">How members are using the portal.</p>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl bg-card border border-border p-5 shadow-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                  <stat.icon className="h-4 w-4 text-gold" />
                </div>
                <div className="font-display text-3xl font-extrabold">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card title="Top 10 Most Viewed Content">
              {(topContentQ.data ?? []).length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topContentQ.data ?? []} layout="vertical" margin={{ left: 10, right: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border))" />
                    <XAxis type="number" stroke="var(--muted-foreground))" fontSize={12} />
                    <YAxis
                      type="category"
                      dataKey="title"
                      width={140}
                      stroke="var(--muted-foreground))"
                      fontSize={11}
                      tickFormatter={(v: string) => (v.length > 22 ? v.slice(0, 22) + "…" : v)}
                    />
                    <Tooltip cursor={{ fill: "var(--muted))" }} />
                    <Bar dataKey="views" fill="var(--gold))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChartMessage />
              )}
            </Card>

            <Card title="New Members — Last 12 Months">
              {(signupsQ.data ?? []).length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={signupsQ.data ?? []} margin={{ left: 10, right: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border))" />
                    <XAxis dataKey="month" stroke="var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="var(--gold))" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChartMessage />
              )}
            </Card>
          </div>

          {/* Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card title="Search Intelligence — This Week">
              <Table
                headers={["Query", "Searches", "Matches"]}
                rows={(topSearchesQ.data ?? []).map((r: { query: string; search_count: number; match_count: number }) => [
                  r.query,
                  r.search_count,
                  r.match_count,
                ])}
                empty="No searches logged yet."
              />
            </Card>

            <Card title="Zero-Result Searches — Content Gaps">
              <Table
                headers={["Query", "Searches", "Last Searched"]}
                rows={(zeroSearchesQ.data ?? []).map((r: { query: string; search_count: number; last_searched: string }) => [
                  r.query,
                  r.search_count,
                  formatDistanceToNow(new Date(r.last_searched), { addSuffix: true }),
                ])}
                empty="No content gaps detected."
              />
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Most Recently Active Members">
              <Table
                headers={["Member", "Last Login", "Completed"]}
                rows={(recentMembersQ.data ?? []).map((m: { full_name: string | null; email: string | null; last_login: string; completed_count: number }) => [
                  m.full_name ?? m.email ?? "—",
                  formatDistanceToNow(new Date(m.last_login), { addSuffix: true }),
                  m.completed_count,
                ])}
                empty="No active members yet."
              />
            </Card>

            <Card title="Most Commented Content">
              <Table
                headers={["Title", "Comments"]}
                rows={(topCommentedQ.data ?? []).map((c) => [c.title, c.count])}
                empty="No comments yet."
              />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function EmptyChartMessage() {
  return (
    <div className="flex flex-col items-center justify-center h-[300px] text-center px-4">
      <BarChart3 className="h-10 w-10 text-gold/40 mb-3" />
      <p className="text-sm text-muted-foreground max-w-xs">
        Analytics will populate as members watch content and search the library.
      </p>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl bg-card border border-border p-5 shadow-card">
      <h2 className="font-display text-lg font-bold mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Table({
  headers,
  rows,
  empty,
}: {
  headers: string[];
  rows: (string | number)[][];
  empty: string;
}) {
  if (!rows.length) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-sm text-muted-foreground">{empty}</p>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
            {headers.map((h) => (
              <th key={h} className="py-2 pr-4 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-border/50 last:border-0">
              {r.map((cell, j) => (
                <td key={j} className="py-2.5 pr-4">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
