// src/app/test/[id]/page.tsx

'use client';

import { useParams } from 'next/navigation';

export default function TestPage() {
  const params = useParams();

  return (
    <div style={{ color: 'black', padding: '40px' }}>
      <h1>Test Page</h1>
      <p>If you can see this, dynamic routing is working.</p>
      <p>The ID from the URL is: <strong>{params?.id}</strong></p>
    </div>
  );
}