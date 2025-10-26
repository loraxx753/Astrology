import React from 'react';
import { useLocation } from 'react-router-dom';

export const NotFoundBoundary: React.FC = () => {
  const location = useLocation();
  const match = location.pathname.match(/\/([\w-]+)$/);
  const urlChunk = match ? match[1] : 'Unknown';
  const fileLink = 'src/components/Pages/index.ts';

  return (
    <div style={{ padding: 32, color: 'red', fontFamily: 'monospace' }}>
      <h2>🚫 404: Page Not Found</h2>
      <p>
        <strong>Development Tip:</strong> Make sure the <code>{urlChunk.charAt(0).toUpperCase() + urlChunk.slice(1)}Page</code> is exported in <a href={`vscode://file/${fileLink}`}>{fileLink}</a>.<br />
        If you just added a new page, check your route and export.
      </p>
    </div>
  );
};
