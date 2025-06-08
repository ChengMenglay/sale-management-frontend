"use client";
import React from "react";
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";

export default function ErrorPage({
  title = "Oops! Something went wrong",
  message = "We encountered an unexpected error. Don't worry, our team has been notified and we're working on it.",
  errorCode = "500",
  showRetry = true,
  showHome = true,
  showBack = true,
}) {
  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = "/dashboard";
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Animated error icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-4 animate-pulse">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>

          {/* Error code with gradient */}
          <div className="text-6xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-2">
            {errorCode}
          </div>
        </div>

        {/* Error content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-800 mb-3">{title}</h1>
            <p className="text-slate-600 leading-relaxed">{message}</p>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            {showRetry && (
              <button
                onClick={handleRetry}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            )}

            <div className="flex gap-3">
              {showBack && (
                <button
                  onClick={handleGoBack}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-4 rounded-lg transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Go Back
                </button>
              )}

              {showHome && (
                <button
                  onClick={handleGoHome}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-4 rounded-lg transition-all duration-200"
                >
                  <Home className="w-4 h-4" />
                  Home
                </button>
              )}
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div
          className="absolute top-10 left-10 w-20 h-20 bg-red-200 rounded-full opacity-20 animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        ></div>
        <div
          className="absolute top-20 right-10 w-16 h-16 bg-orange-200 rounded-full opacity-20 animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "3s" }}
        ></div>
        <div
          className="absolute bottom-20 left-20 w-12 h-12 bg-yellow-200 rounded-full opacity-20 animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "3s" }}
        ></div>
      </div>
    </div>
  );
}
