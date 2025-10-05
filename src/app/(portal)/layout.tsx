// src/app/(portal)/layout.tsx

import ProtectedRoute from '@/components/ProtectedRoute';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}