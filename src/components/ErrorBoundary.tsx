import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (import.meta.env.DEV) {
        return (
          <div style={{ padding: 32, color: 'red', fontFamily: 'monospace' }}>
            <h2>⚠️ Error: {this.state.error?.message}</h2>
            <p>
              <strong>Development Tip:</strong> Make sure the page is exported in <code>src/components/Pages/index.ts</code>.<br />
              If you just added a new page, check your route and export.
            </p>
          </div>
        );
      }
      return <h2>Something went wrong.</h2>;
    }
    return this.props.children;
  }
}
