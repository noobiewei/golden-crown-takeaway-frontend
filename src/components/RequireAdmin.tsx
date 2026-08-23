import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import type { ReactNode } from 'react';

export default function RequireAdmin({ children }: { children: ReactNode }) {
  const { username, loading } = useAdminAuth();

  if (loading) return null;
  if (!username) return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
}
