// Error reporting utilities for better debugging

export interface ErrorReport {
  type: 'network' | 'routing' | 'component' | 'import' | 'build' | 'unknown';
  message: string;
  details?: Record<string, any>;
  url?: string;
  timestamp: Date;
  userAgent?: string;
  stack?: string;
}

class ErrorReporter {
  private static errors: ErrorReport[] = [];
  private static maxErrors = 50;

  static report(error: Omit<ErrorReport, 'timestamp'>) {
    const fullError: ErrorReport = {
      ...error,
      timestamp: new Date(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server',
    };

    this.errors.push(fullError);
    
    // Keep only recent errors to prevent memory issues
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Log to console
    console.error('🚨 PhotoAI Error:', fullError);
    
    // Store in localStorage for debugging
    try {
      const existing = localStorage.getItem('photoai-errors');
      const errors = existing ? JSON.parse(existing) : [];
      errors.push(fullError);
      localStorage.setItem('photoai-errors', JSON.stringify(errors.slice(-20)));
    } catch (e) {
      console.warn('Failed to store error in localStorage:', e);
    }

    return fullError;
  }

  static getRecentErrors(): ErrorReport[] {
    try {
      const stored = localStorage.getItem('photoai-errors');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn('Failed to retrieve errors from localStorage:', e);
      return [];
    }
  }

  static clearErrors() {
    this.errors = [];
    try {
      localStorage.removeItem('photoai-errors');
    } catch (e) {
      console.warn('Failed to clear errors from localStorage:', e);
    }
  }

  static getErrorSummary(): string {
    const errors = this.getRecentErrors();
    if (errors.length === 0) {
      return 'No errors reported';
    }

    const typeCounts = errors.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const summary = Object.entries(typeCounts)
      .map(([type, count]) => `${count} ${type}`)
      .join(', ');

    return `${errors.length} errors: ${summary}`;
  }
}

// Network error handler
export const handleNetworkError = (error: Error, url?: string) => {
  ErrorReporter.report({
    type: 'network',
    message: error.message,
    details: {
      url,
      online: typeof window !== 'undefined' ? navigator.onLine : 'Unknown',
    },
    url,
    stack: error.stack,
  });
};

// Routing error handler
export const handleRoutingError = (path: string, error: any) => {
  ErrorReporter.report({
    type: 'routing',
    message: `Routing error for path: ${path}`,
    details: {
      path,
      error: error?.message || error,
      currentUrl: typeof window !== 'undefined' ? window.location.href : 'Unknown',
    },
    url: typeof window !== 'undefined' ? window.location.href : undefined,
    stack: error?.stack || String(error),
  });
};

// Import error handler
export const handleImportError = (moduleName: string, error: any) => {
  ErrorReporter.report({
    type: 'import',
    message: `Failed to import module: ${moduleName}`,
    details: {
      moduleName,
      error: error?.message || error,
    },
    stack: error?.stack || String(error),
  });
};

// Performance monitoring
export const reportPerformanceIssue = (metric: string, value: any, threshold?: number) => {
  const issue = {
    type: 'unknown' as const,
    message: `Performance issue: ${metric}`,
    details: {
      value,
      threshold,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server',
    },
    timestamp: new Date(),
  };

  if (threshold && typeof value === 'number' && value > threshold) {
    ErrorReporter.report(issue);
  }

  return issue;
};

export default ErrorReporter;
