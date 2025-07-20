import React from 'react';

const Index = () => {
  return (
    <div className="min-h-screen bg-primary text-primary-foreground flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold">✅ PREVIEW WORKS!</h1>
        <p className="text-2xl">ByteSteps is loading correctly</p>
        <div className="bg-white text-black p-6 rounded-lg max-w-md">
          <p className="text-lg font-semibold">If you can see this:</p>
          <ul className="text-left mt-2 space-y-1">
            <li>✅ React is rendering</li>
            <li>✅ Tailwind CSS is working</li>
            <li>✅ Build process succeeded</li>
            <li>✅ Preview infrastructure is functional</li>
          </ul>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-white text-primary px-6 py-2 rounded-lg font-semibold hover:bg-gray-100"
        >
          Reload Test
        </button>
      </div>
    </div>
  );
};

export default Index;
