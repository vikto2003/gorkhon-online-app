import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

interface NotificationBellProps {
  currentVersion: string;
  onUpdateClick: () => void;
  onNotificationsClick: () => void;
}

// Колокольчик открывает отдельную вкладку «Уведомления» (см. NotificationsPanel),
// а не всплывающее окно — как в мессенджерах.
const NotificationBell = ({ currentVersion, onNotificationsClick }: NotificationBellProps) => {
  const [hasUpdate, setHasUpdate] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    const checkForUpdates = () => {
      const savedVersion = localStorage.getItem('appVersion');
      if (savedVersion !== currentVersion) {
        setHasUpdate(true);
        setIsShaking(true);

        setTimeout(() => setIsShaking(false), 1000);
      }
    };

    checkForUpdates();

    const interval = setInterval(checkForUpdates, 30000);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'VERSION_UPDATE') {
          const newVersion = event.data.version;
          const savedVersion = localStorage.getItem('appVersion');

          if (savedVersion !== newVersion) {
            setHasUpdate(true);
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 1000);
          }
        }
      });
    }

    return () => clearInterval(interval);
  }, [currentVersion]);

  useEffect(() => {
    if (hasUpdate) {
      requestNotificationPermission();
      playNotificationSound();
    }
  }, [hasUpdate]);

  const playNotificationSound = () => {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWW57+eeTBELUKXh8LdjHQU2jdXxy34uBSh+zPLajzsIFGK56+mnVRQKRp/g8r5sIQYth9DyvY0+CBtqwPHnomwWDFWr5O+yZh0GMYvQ8sx+LwUng8vx25BBCRVfu+vuqVYVDEin4/O8biYHMIzS8sp8MAYqg8zx3I9AChlswe/pp14XDliy5/CyaB8FNpHU8sp8LwYshM/y2o08CBdqvu7rpVMABjiR1vLLfC8FKoHO8t+POAcYaLvt58BzJAU5kdXxy38uBSl9y/LbjDoIGGm97+mjYBgNVK3k7rBiHgY3kdfyx34wBiyEzvLcizsKGm2+7+mjYBgOVK3k7rBhHgY3kdfyx34wBiyFzvLcizsKGm2+7+mjYBgOVK3k7rBhHgY3kdfyx34wBiyFzvLcizsKGm2+7+mjYBgOVK3k7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVK3k7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVK3k7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVK3k7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVK3k7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVK3k7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVK3k7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVK3k7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVK3k7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVKzj7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVKzj7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVKzj7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVKzj7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVKzj7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVKzj7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVKzj7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVKzj7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVKzj7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVKzj7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVKzj7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVKzj7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVKzj7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVKzj7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVKzj7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgO');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch (error) {
      console.log('Не удалось воспроизвести звук');
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onNotificationsClick}
      className={`relative ${isShaking ? 'animate-bounce' : ''} ${hasUpdate ? 'text-gorkhon-orange' : 'text-wb-gray-600'}`}
      aria-label="Уведомления"
    >
      <Icon name="Bell" size={20} />
      {hasUpdate && (
        <>
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
        </>
      )}
    </Button>
  );
};

export default NotificationBell;
