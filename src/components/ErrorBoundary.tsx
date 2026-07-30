"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Shown in the visible fallback and the console log, to identify which boundary caught the error. */
  label: string;
}

interface State {
  error: Error | null;
}

/**
 * A plain React error boundary (must be a class component -- there's no
 * hooks-based equivalent). Renders the actual error message visibly
 * instead of silently showing nothing, and logs it with a distinctive,
 * greppable marker -- added specifically to diagnose a reported issue
 * where the Foods page's tab content renders empty with zero console
 * output and zero failed network requests, which strongly suggested a
 * render-time error being swallowed somewhere without ever being logged.
 */
export class DiagnosticErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    console.error(`[DiagnosticErrorBoundary:${this.props.label}]`, error, info.componentStack);
  }

  override render() {
    if (this.state.error) {
      return (
        <div className="border-accent-danger/30 bg-accent-danger/10 rounded-control border p-4 text-sm text-accent-danger">
          <p className="font-semibold">Something went wrong loading this section ({this.props.label}).</p>
          <p className="mt-1 font-mono text-xs opacity-80">{this.state.error.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
