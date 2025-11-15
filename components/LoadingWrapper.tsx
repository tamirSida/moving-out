'use client';

import { useEffect, useState } from 'react';

export default function LoadingWrapper({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Mark as loaded after a short delay to allow styles to settle
    const timer = setTimeout(() => {
      setIsLoaded(true);
      document.body.classList.add('loaded');
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`transition-opacity duration-200 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {children}
    </div>
  );
}