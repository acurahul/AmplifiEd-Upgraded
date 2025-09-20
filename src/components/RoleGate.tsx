import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getSessionRole, type SessionRole } from '../../lib/role';

interface RoleGateProps {
  allowedRoles: SessionRole[];
  children: React.ReactNode;
}

const RoleGate: React.FC<RoleGateProps> = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();
  const sessionRole = getSessionRole();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!sessionRole) {
    return <Navigate to="/portal" replace />;
  }

  if (!allowedRoles.includes(sessionRole)) {
    return <Navigate to="/portal" replace />;
  }

  return <>{children}</>;
};

export default RoleGate;