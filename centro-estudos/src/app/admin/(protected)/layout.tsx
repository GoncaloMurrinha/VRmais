import { AdminShell } from "@/components/admin-shell";
import { requireAdminSession } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireAdminSession();

  return <AdminShell adminName={session.name}>{children}</AdminShell>;
}
