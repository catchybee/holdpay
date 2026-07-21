import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConvexReactClient } from 'convex/react';
import { ConvexAuthProvider } from '@convex-dev/auth/react';
import App from './App';
import './index.css';

const convexUrl = import.meta.env.VITE_CONVEX_URL || 'https://aromatic-chinchilla-574.convex.cloud';
const convex = new ConvexReactClient(convexUrl);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConvexAuthProvider client={convex}>
      <App />
    </ConvexAuthProvider>
  </React.StrictMode>
);
