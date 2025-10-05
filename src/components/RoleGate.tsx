// src/components/RoleGate.tsx

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use Next.js navigation
import { useAuth } from '../contexts/AuthContext';
import { getSessionRole, type SessionRole } from '../lib/role'; // Corrected path

interface RoleGateProps {
  allowedRoles: SessionRole[];
  children: React.ReactNode;
}

const RoleGate: React.FC<RoleGateProps> = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();
  const router = useRouter(); // Use Next.js router
  const sessionRole = getSessionRole();

  useEffect(() => {
    // Wait until loading is done before making any decisions
    if (loading) {
      return;
    }

    // Redirect logic
    if (!user) {
      router.push('/login');
    } else if (!sessionRole || !allowedRoles.includes(sessionRole)) {
      router.push('/portal');
    }
  }, [user, loading, sessionRole, allowedRoles, router]);

  // Show a loading spinner while checking auth state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Only render children if the user is authenticated and has the correct role.
  // Otherwise, render null while the redirect happens.
  if (user && sessionRole && allowedRoles.includes(sessionRole)) {
    return <>{children}</>;
  }

  return null;
};

export default RoleGate;