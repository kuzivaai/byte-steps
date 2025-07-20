import React, { useState } from 'react';
import { HelpCircle, MessageCircle, Phone, MapPin, X } from 'lucide-react';
import { simplifiedCopy } from '@/content/simplifiedCopy';

export const ElderlyHelpMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating help button - always visible */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors z-40"
        aria-label="Get help"
      >
        <HelpCircle className="h-8 w-8" />
        <span className="sr-only">Get Help</span>
      </button>

      {/* Help menu modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4" role="dialog" aria-labelledby="help-title">
            <div className="flex justify-between items-center mb-6">
              <h2 id="help-title" className="text-2xl font-bold">{simplifiedCopy.help.title}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded"
                aria-label="Close help menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <button className="w-full text-left p-6 hover:bg-gray-50 rounded-lg border-2 border-gray-200 transition-colors flex items-center">
                <MessageCircle className="h-8 w-8 mr-4 text-blue-600" />
                <div>
                  <div className="text-xl font-semibold">{simplifiedCopy.help.options.ai}</div>
                  <div className="text-gray-600">Get instant answers</div>
                </div>
              </button>

              <button className="w-full text-left p-6 hover:bg-gray-50 rounded-lg border-2 border-gray-200 transition-colors flex items-center">
                <Phone className="h-8 w-8 mr-4 text-green-600" />
                <div>
                  <div className="text-xl font-semibold">{simplifiedCopy.help.options.human}</div>
                  <div className="text-gray-600">Request a callback</div>
                </div>
              </button>

              <button className="w-full text-left p-6 hover:bg-gray-50 rounded-lg border-2 border-gray-200 transition-colors flex items-center">
                <MapPin className="h-8 w-8 mr-4 text-purple-600" />
                <div>
                  <div className="text-xl font-semibold">{simplifiedCopy.help.options.local}</div>
                  <div className="text-gray-600">Libraries and classes</div>
                </div>
              </button>
            </div>

            <p className="mt-6 text-center text-gray-600 text-lg">
              {simplifiedCopy.help.encouragement}
            </p>
          </div>
        </div>
      )}
    </>
  );
};