'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface PageLoaderProps {
  children: React.ReactNode;
}

export default function PageLoader({ children }: PageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    // Show loading screen for 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Small delay to show content after logo transition
      setTimeout(() => setShowContent(true), 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Loading Screen */}
      <div
        className={`fixed inset-0 bg-white z-50 flex items-center justify-center transition-all duration-500 ${
          isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="text-center">
          <div className="relative w-80 h-80 sm:w-96 sm:h-96 lg:w-[500px] lg:h-[500px] mb-8">
            <Image
              src="/pic.jpg"
              alt="Loading"
              fill
              className="object-contain animate-pulse rounded-2xl shadow-2xl"
              priority
            />
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-gray-800">רשימת קניות למעבר דירה</div>
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <div className="text-gray-600 text-sm">טוען נתונים...</div>
          </div>
        </div>
      </div>

      {/* Logo in top left corner */}
      <div
        className={`fixed top-2 left-2 z-40 transition-all duration-500 ${
          !isLoading ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
        }`}
      >
        <div 
          className="relative w-10 h-10 sm:w-12 sm:h-12 hover:scale-110 transition-all duration-300 cursor-pointer"
          onClick={() => setShowPreview(true)}
          title="לחץ לתצוגה מקדימה"
        >
          <Image
            src="/pic.jpg"
            alt="Logo"
            fill
            className="object-contain rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          />
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPreview(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-200 shadow-lg border-2 border-white border-opacity-30"
              title="סגור"
            >
              <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
            </button>
            <div className="relative w-full h-[80vh]">
              <Image
                src="/pic.jpg"
                alt="תצוגה מקדימה"
                fill
                className="object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div
        className={`transition-all duration-500 ${
          showContent ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {children}
      </div>
    </>
  );
}