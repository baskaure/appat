import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  console.error('Error mounting React app:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; color: red; font-family: monospace;">
      <h1>Erreur de chargement</h1>
      <pre>${error instanceof Error ? error.message : String(error)}</pre>
      <p>Vérifiez la console pour plus de détails.</p>
    </div>
  `;
}
