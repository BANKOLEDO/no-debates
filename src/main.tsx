import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConvexProvider } from 'convex/react';
import { convexClient } from './lib/convexClient';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {convexClient ? (
      <ConvexProvider client={convexClient}>
        <App />
      </ConvexProvider>
    ) : (
      <App />
    )}
  </React.StrictMode>,
);
