import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { AUTH_LOGIN_PATH } from '@/lib/auth-paths';
import { AdminShell } from './AdminShell';

/**
 * Server-side admin gate + client shell.
 * API route'ları ayrıca requireAdminAuth ile korunur.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  if (!session?.user) {
    redirect(`${AUTH_LOGIN_PATH}?callbackUrl=${encodeURIComponent('/admin/dashboard')}`);
  }

  if (role !== 'ADMIN' && role !== 'EDITOR') {
    redirect(`${AUTH_LOGIN_PATH}?error=unauthorized`);
  }

  return <AdminShell>{children}</AdminShell>;
}
