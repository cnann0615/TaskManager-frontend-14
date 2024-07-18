import React, { Component, ReactNode, ErrorInfo } from "react";

// ErrorBoundaryのクラスコンポーネント

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // エラーステートを更新してフォールバックUIを表示
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // エラー情報を取得できる
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <h1 className="text-red-700 font-bold">
          An error has occurred. Please refresh the page.
        </h1>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
