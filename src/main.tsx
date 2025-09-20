import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { worker } from '../mocks/browser.ts';

// Start MSW in development
if (import.meta.env.DEV) {
  worker.start({
    serviceWorker: {
      url: '/mockServiceWorker.js',
      options: {
        scope: '/'
      }
    },
    onUnhandledRequest: 'bypass',
  }).then(() => {
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  });
} else {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
