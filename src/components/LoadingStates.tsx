import React from 'react';

export const LoadingScreen: React.FC<{ message?: string }> = ({ message = "Loading ByteSteps..." }) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-8">
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">{message}</h1>
      <div className="mt-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
      </div>
      <p className="mt-8 text-xl text-gray-600">This won't take long...</p>
    </div>
  </div>
);

export const LoadingButton: React.FC<{ loading?: boolean; children: React.ReactNode; onClick?: () => void; disabled?: boolean; className?: string }> = ({ loading, children, onClick, disabled, className = "" }) => (
  <button 
    disabled={loading || disabled} 
    onClick={onClick}
    className={`relative ${className}`}
  >
    {loading && (
      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    )}
    {children}
  </button>
);