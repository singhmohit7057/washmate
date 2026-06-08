import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import type { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  redirectTo?: string;
}

export default function ProtectedRoute({ children, requiredRole, redirectTo = '/login' }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner fullPage />;

  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  if (requiredRole) {
    const roleHierarchy: Record<UserRole, number> = { customer: 1, admin: 2, super_admin: 3 };
    const requiredLevel = roleHierarchy[requiredRole];
    const userLevel = roleHierarchy[user.role];
    if (userLevel < requiredLevel) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}
