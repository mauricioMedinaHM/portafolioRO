import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { SetupNotice } from "@/components/admin/setup-notice";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!hasSupabaseEnv()) {
    return (
      <main className="mx-auto flex min-h-svh w-full max-w-lg flex-col justify-center px-5 py-10">
        <SetupNotice />
      </main>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return <AdminShell email={user.email}>{children}</AdminShell>;
}
