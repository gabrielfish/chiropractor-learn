import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { listMembers, setMemberActive, setUserRole } from "@/lib/members.functions";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Search, UserCheck, UserX, Link2, Check, Users, Loader2, Copy, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/members")({
  head: () => ({ meta: [{ title: "Members — DCPG Admin" }] }),
  beforeLoad: ({ context }) => {
    const roles = (context as { roles?: string[] }).roles ?? [];
    if (!roles.includes("super_admin")) throw redirect({ to: "/dashboard" });
  },
  component: MembersPage,
});

type Member = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  practice_name: string | null;
  created_at: string | null;
  last_login: string | null;
  is_active: boolean;
  content_completed: number;
};

type AppRole = "member" | "author" | "super_admin";

const ROLE_LABELS: Record<AppRole, string> = {
  member: "Member",
  author: "Team Member",
  super_admin: "Super Admin",
};

const ROLE_COLOURS: Record<AppRole, string> = {
  member: "bg-blue-500/10 text-blue-600",
  author: "bg-gold/15 text-gold",
  super_admin: "bg-primary/10 text-primary",
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Avatar({ member }: { member: Member }) {
  const initials = (member.full_name ?? member.email ?? "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (member.avatar_url) {
    return (
      <img
        src={member.avatar_url}
        alt={member.full_name ?? ""}
        className="h-8 w-8 rounded-full object-cover shrink-0"
      />
    );
  }
  return (
    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
      {initials}
    </div>
  );
}

function MembersPage() {
  const listFn = useServerFn(listMembers);
  const toggleFn = useServerFn(setMemberActive);
  const roleFn = useServerFn(setUserRole);
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  // Track which user's role select is pending
  const [pendingRole, setPendingRole] = useState<string | null>(null);
  const [pendingToggle, setPendingToggle] = useState<string | null>(null);

  const membersQ = useQuery({
    queryKey: ["admin", "members"],
    queryFn: () => listFn(),
  });

  const toggleMut = useMutation({
    mutationFn: (vars: { userId: string; is_active: boolean }) => {
      setPendingToggle(vars.userId);
      return toggleFn({ data: vars });
    },
    onSuccess: (_data, vars) => {
      toast.success(vars.is_active ? "Member reactivated" : "Member deactivated — content reassigned to Dr Ryan Rieder");
      qc.invalidateQueries({ queryKey: ["admin", "members"] });
    },
    onError: (err: Error) => toast.error(err.message),
    onSettled: () => setPendingToggle(null),
  });

  const roleMut = useMutation({
    mutationFn: (vars: { userId: string; role: AppRole }) => {
      setPendingRole(vars.userId);
      return roleFn({ data: vars });
    },
    onSuccess: (_data, vars) => {
      const label = ROLE_LABELS[vars.role];
      toast.success(`Role updated to ${label} — user will move to the appropriate section`);
      qc.invalidateQueries({ queryKey: ["admin", "members"] });
      qc.invalidateQueries({ queryKey: ["admin", "authors"] });
    },
    onError: (err: Error) => toast.error(err.message),
    onSettled: () => setPendingRole(null),
  });

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const members: Member[] = membersQ.data?.members ?? [];

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    return (
      !q ||
      (m.full_name ?? "").toLowerCase().includes(q) ||
      (m.email ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <AdminSidebar active="members" />

      <main className="flex-1 pt-14 px-4 pb-4 sm:px-8 sm:pb-8 md:p-8 overflow-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-foreground">Members</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {membersQ.isLoading
                ? "Loading…"
                : `${members.length} member${members.length !== 1 ? "s" : ""} total`}
            </p>
          </div>
          <Button
            onClick={() => setInviteOpen(true)}
            className="bg-gold text-gold-foreground hover:bg-gold/90 font-semibold gap-2 self-start sm:self-auto"
          >
            <Link2 className="h-4 w-4" /> Invite Member
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Table */}
        {membersQ.isLoading ? (
          <div className="text-muted-foreground text-sm">Loading members…</div>
        ) : membersQ.isError ? (
          <div className="text-destructive text-sm">
            Failed to load members: {(membersQ.error as Error).message}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground gap-3">
            <Users className="h-10 w-10 opacity-30" />
            <p className="text-sm">
              {search ? "No members match your search." : "No members yet."}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[780px]">
                <thead>
                  <tr className="bg-muted/50 border-b border-border text-left">
                    <th className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">Member</th>
                    <th className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">Practice</th>
                    <th className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">Joined</th>
                    <th className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">Last Login</th>
                    <th className="px-4 py-3 font-semibold text-foreground whitespace-nowrap text-center">Completed</th>
                    <th className="px-4 py-3 font-semibold text-foreground whitespace-nowrap text-center">Status</th>
                    <th className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">Role</th>
                    <th className="px-4 py-3 font-semibold text-foreground whitespace-nowrap"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m, i) => (
                    <tr
                      key={m.id}
                      className={`border-b border-border last:border-0 transition-colors hover:bg-muted/30 ${
                        !m.is_active ? "opacity-60" : ""
                      } ${i % 2 === 0 ? "" : "bg-muted/10"}`}
                    >
                      {/* Member */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar member={m} />
                          <div className="min-w-0">
                            <div className="font-medium text-foreground truncate">
                              {m.full_name ?? "—"}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {m.email ?? "—"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Practice */}
                      <td className="px-4 py-3 text-muted-foreground">
                        {m.practice_name ?? "—"}
                      </td>

                      {/* Joined */}
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {formatDate(m.created_at)}
                      </td>

                      {/* Last Login */}
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {formatDate(m.last_login)}
                      </td>

                      {/* Completed */}
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center justify-center h-6 min-w-[1.5rem] px-2 rounded-full bg-gold/15 text-gold text-xs font-semibold">
                          {m.content_completed}
                        </span>
                      </td>

                      {/* Status badge */}
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                            m.is_active
                              ? "bg-green-500/15 text-green-600"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {m.is_active ? (
                            <><UserCheck className="h-3 w-3" /> Active</>
                          ) : (
                            <><UserX className="h-3 w-3" /> Inactive</>
                          )}
                        </span>
                      </td>

                      {/* Role dropdown */}
                      <td className="px-4 py-3">
                        {pendingRole === m.id ? (
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Loader2 className="h-3 w-3 animate-spin" /> Saving…
                          </span>
                        ) : (
                          <select
                            value="member"
                            onChange={(e) =>
                              roleMut.mutate({ userId: m.id, role: e.target.value as AppRole })
                            }
                            className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/50 ${ROLE_COLOURS["member"]}`}
                            title="Change role"
                          >
                            <option value="member">Member</option>
                            <option value="author">Team Member</option>
                            <option value="super_admin">Super Admin</option>
                          </select>
                        )}
                      </td>

                      {/* Deactivate / Reactivate */}
                      <td className="px-4 py-3 text-right">
                        {pendingToggle === m.id ? (
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground px-3 py-1.5">
                            <Loader2 className="h-3 w-3 animate-spin" />
                          </span>
                        ) : (
                          <button
                            onClick={() =>
                              toggleMut.mutate({ userId: m.id, is_active: !m.is_active })
                            }
                            disabled={toggleMut.isPending}
                            className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
                              m.is_active
                                ? "border-destructive/30 text-destructive hover:bg-destructive/10"
                                : "border-green-500/30 text-green-600 hover:bg-green-500/10"
                            }`}
                          >
                            {m.is_active ? "Deactivate" : "Reactivate"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ── Invite Modal ──────────────────────────────────────────────── */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden border-border bg-card">
          {/* Header */}
          <div className="bg-primary text-primary-foreground px-6 pt-6 pb-5">
            <DialogHeader>
              <DialogTitle className="font-display text-xl font-extrabold flex items-center gap-2">
                <Link2 className="h-5 w-5 text-gold" /> Invite to the Portal
              </DialogTitle>
              <p className="text-sm text-primary-foreground/70 mt-1">
                Share the right link for the right type of account.
              </p>
            </DialogHeader>
          </div>

          <div className="p-6 space-y-5">
            {/* ── Section 1: Inner Circle Member ───────────────────────── */}
            <div className="rounded-xl border-2 border-gold/30 bg-gold/5 p-5">
              <div className="flex items-center gap-2 mb-1">
                <div className="rounded-lg bg-gold/15 text-gold p-1.5">
                  <Users className="h-4 w-4" />
                </div>
                <h3 className="font-display font-bold text-foreground text-base">
                  Invite an Inner Circle Member
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Share this link with Ryan's Inner Circle members to give them access.
              </p>

              {/* Link row */}
              <div className="flex items-center gap-2 rounded-lg bg-background border border-border px-3 py-2 mb-3">
                <span className="flex-1 text-xs text-foreground/80 font-mono truncate select-all">
                  https://learn.dcpracticegrowth.com/signup?invite=INNERCIRCLE
                </span>
                <button
                  onClick={() => copyToClipboard(
                    "https://learn.dcpracticegrowth.com/signup?invite=INNERCIRCLE",
                    "member-link",
                  )}
                  className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-gold text-gold-foreground hover:bg-gold/90 transition-colors"
                >
                  {copiedKey === "member-link" ? (
                    <><Check className="h-3.5 w-3.5" /> Copied!</>
                  ) : (
                    <><Copy className="h-3.5 w-3.5" /> Copy Link</>
                  )}
                </button>
              </div>
            </div>

            {/* ── Section 2: Team Member ────────────────────────────────── */}
            <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-5">
              <div className="flex items-center gap-2 mb-1">
                <div className="rounded-lg bg-primary/10 text-primary p-1.5">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <h3 className="font-display font-bold text-foreground text-base">
                  Invite a Team Member
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Share this link and access code with DCPG team members who need to upload content.
              </p>

              {/* Team signup link */}
              <div className="flex items-center gap-2 rounded-lg bg-background border border-border px-3 py-2 mb-2">
                <span className="flex-1 text-xs text-foreground/80 font-mono truncate select-all">
                  https://learn.dcpracticegrowth.com/team-signup
                </span>
                <button
                  onClick={() => copyToClipboard(
                    "https://learn.dcpracticegrowth.com/team-signup",
                    "team-link",
                  )}
                  className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {copiedKey === "team-link" ? (
                    <><Check className="h-3.5 w-3.5" /> Copied!</>
                  ) : (
                    <><Copy className="h-3.5 w-3.5" /> Copy Link</>
                  )}
                </button>
              </div>

              {/* Access code row */}
              <div className="flex items-center gap-2 rounded-lg bg-background border border-border px-3 py-2">
                <span className="text-xs text-muted-foreground mr-1 shrink-0">Access Code:</span>
                <span className="flex-1 text-xs font-bold font-mono text-foreground tracking-widest select-all">
                  DCPGTEAM
                </span>
                <button
                  onClick={() => copyToClipboard("DCPGTEAM", "team-code")}
                  className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {copiedKey === "team-code" ? (
                    <><Check className="h-3.5 w-3.5" /> Copied!</>
                  ) : (
                    <><Copy className="h-3.5 w-3.5" /> Copy Code</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
