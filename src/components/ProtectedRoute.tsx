import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { session, adminSession } = useAuth();
  const location = useLocation();

  // For admin routes, only allow access with admin session
  if (requireAdmin) {
    if (!adminSession) {
      return <Navigate to="/auth" state={{ from: location, requireAdmin: true }} replace />;
    }
    return <>{children}</>;
  }

  // For regular user routes, only allow access with regular session
  if (!session) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If user has admin session but trying to access regular route, redirect to admin dashboard
  if (adminSession && !requireAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}; 