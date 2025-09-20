'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { getSessionRole, type SessionRole } from '@/lib/role';

interface RoleGateProps {
  allowedRoles: SessionRole[];
  children: React.ReactNode;
}

export default function RoleGate({ allowedRoles, children }: RoleGateProps) {
  const [sessionRole, setSessionRole] = useState<SessionRole | null>(null);

  useEffect(() => {
    setSessionRole(getSessionRole());
  }, []);

  if (!sessionRole || !allowedRoles.includes(sessionRole)) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <AlertTriangle className="text-yellow-400 mr-2" size={20} />
          <p className="text-yellow-400">
            This section is intended for {allowedRoles.join(' or ')} users, but you can still access it in this MVP.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}