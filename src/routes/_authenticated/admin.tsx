import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: ({ context }) => {
    const roles = (context as { roles?: string[] }).roles ?? [];
    if (!roles.includes("super_admin") && !roles.includes("author")) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: () => <Outlet />,
});
