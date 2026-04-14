import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";
import { ErrorBoundaryPage } from "./ErrorBoundaryPage";

export interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: unknown;
  componentStack?: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary]", error, info);
    this.setState({ componentStack: info.componentStack });
  }

  private reset = () => {
    this.setState({ error: null, componentStack: undefined });
  };

  render() {
    if (this.state.error) {
      return (
        <ErrorBoundaryPage
          error={this.state.error}
          componentStack={this.state.componentStack}
          onReset={this.reset}
        />
      );
    }

    return this.props.children;
  }
}

