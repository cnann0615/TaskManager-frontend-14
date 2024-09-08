import React from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

// エラーフォールバックコンポーネントの型定義
interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

// フォールバックUI
const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error }) => {
  const resetErrorBoundary = () => {
    window.location.reload();
  };
  return (
    <div
      role="alert"
      className="bg-red-100 w-[90%] h-96 flex flex-col items-center justify-center p-4"
    >
      <h1 className="text-red-700 font-bold text-2xl mb-4">
        An error has occurred
      </h1>
      <p className="text-red-600 mb-4">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="bg-red-500 hover:bg-red-700 text-white font-bold rounded py-2 px-4 "
      >
        Reload Page
      </button>
    </div>
  );
};

// ErrorBoundaryコンポーネントの型定義
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
