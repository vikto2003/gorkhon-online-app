import { useState, useEffect } from 'react';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('splashShown');
    
    if (hasSeenSplash) {
      setIsVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2500);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('splashShown', 'true');
    }, 4500);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-700 ${
        isLoaded ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <img 
        src="https://cdn.poehali.dev/projects/80b27c13-e76f-4c17-9cd3-0ca13d96fc7a/bucket/6642dbf5-9434-4dca-abb3-693152bd21d7.png" 
        alt="Горхон.Online"
        className="w-full h-full object-contain p-8"
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        style={{ WebkitUserSelect: 'none', userSelect: 'none', WebkitTouchCallout: 'none' }}
      />
    </div>
  );
}