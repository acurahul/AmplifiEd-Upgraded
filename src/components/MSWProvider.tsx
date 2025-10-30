// src/components/MSWProvider.tsx

'use client';

import { useEffect, useState } from 'react';

// This component is only for development. In production, it does nothing.
const isDevelopment = process.env.NODE_ENV === 'development';

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    async function initMsw() {
      if (isDevelopment) {
        // We only import the worker in development.
        // This prevents the mock service worker code from being bundled in production.
        const { worker } = await import('@/../mocks/browser');
        await worker.start();
        setMswReady(true);
        // Mark MSW as ready only after it has actually started
        (window as any).mswReady = true;
      }
    }

    // If MSW is already running or we are in production, we're ready.
    if ((window as any).mswReady || !isDevelopment) {
      setMswReady(true);
    } else {
      initMsw();
    }
  }, []);

  // In production, or while MSW is starting, we can show nothing or a loader.
  // We'll just show the children once it's ready.
  if (!isDevelopment || !mswReady) {
    return <>{children}</>;
  }

  return <>{children}</>;
}

// Augment the global Window interface to include our custom flag
declare global {
  interface Window {
    mswReady?: boolean;
  }
}