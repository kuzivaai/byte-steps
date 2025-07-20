// Debug component to test if React is rendering
import React from 'react';

export const DebugComponent = () => {
  console.log('✅ React is rendering successfully');
  console.log('✅ Tailwind classes should be applied');
  
  return (
    <div className="min-h-screen bg-primary text-primary-foreground flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">🎉 Debug: React Works!</h1>
        <p className="text-xl">If you can see this with blue background, everything is working</p>
        <div className="bg-white text-black p-4 rounded">
          <p>White box with black text = Tailwind working</p>
        </div>
      </div>
    </div>
  );
};

export default DebugComponent;