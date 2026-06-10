import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      const dest = location.pathname + (location.searchStr ?? "") + (location.hash ?? "");
      throw redirect({ to: "/login", search: { redirect: dest } });
    }
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id);
    const roleList = (roles ?? []).map((r) => r.role);
    return { user: data.user, roles: roleList };
  },
  component: () => <Outlet />,
});
