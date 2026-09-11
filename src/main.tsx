import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConvexProvider } from 'convex/react';
import { convexClient } from './lib/convexClient';
import { ToastProvider } from './components/Toaster';
import { ErrorBoundary } from './components/ErrorBoundary';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <ErrorBoundary>
        {convexClient ? (
          <ConvexProvider client={convexClient}>
            <App />
          </ConvexProvider>
        ) : (
          <App />
        )}
      </ErrorBoundary>
    </ToastProvider>
  </React.StrictMode>,
);