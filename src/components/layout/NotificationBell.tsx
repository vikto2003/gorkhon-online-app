import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

interface NotificationBellProps {
  currentVersion: string;
  onUpdateClick: () => void;
}

const NotificationBell = ({ currentVersion, onUpdateClick }: NotificationBellProps) => {
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
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWW57+eeTBELUKXh8LdjHQU2jdXxy34uBSh+zPLajzsIFGK56+mnVRQKRp/g8r5sIQYth9DyvY0+CBtqwPHnomwWDFWr5O+yZh0GMYvQ8sx+LwUng8vx25BBCRVfu+vuqVYVDEin4/O8biYHMIzS8sp8MAYqg8zx3I9AChlswe/pp14XDliy5/CyaB8FNpHU8sp8LwYshM/y2o08CBdqvu7rpVMABjiR1vLLfC8FKoHO8t+POAcYaLvt58BzJAU5kdXxy38uBSl9y/LbjDoIGGm97+mjYBgNVK3k7rBiHgY3kdfyx34wBiyEzvLcizsKGm2+7+mjYBgOVK3k7rBhHgY3kdfyx34wBiyFzvLcizsKGm2+7+mjYBgOVK3k7rBhHgY3kdfyx34wBiyFzvLcizsKGm2+7+mjYBgOVK3k7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVK3k7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVK3k7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVK3k7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVK3k7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVK3k7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVK3k7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVK3k7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVK3k7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVK3k7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVKzj7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVKzj7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVKzj7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVKzj7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVKzj7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVKzj7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVKzj7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVKzj7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVKzj7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVKzj7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVKzj7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVKzj7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVKzj7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVKzj7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVKzj7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgOVKzj7rBhHgY3kdfyx34wBiyFzvLcizsKGm6+7+mjYBgO');
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

  const handleClick = () => {
    setHasUpdate(false);
    onUpdateClick();
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClick}
        className={`relative ${isShaking ? 'animate-bounce' : ''} ${hasUpdate ? 'text-gorkhon-orange' : 'text-wb-gray-600'}`}
      >
        <Icon name="Bell" size={20} />
        {hasUpdate && (
          <>
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
          </>
        )}
      </Button>
      
      {hasUpdate && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-wb-gray-200 p-4 z-50 animate-in slide-in-from-top-2">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gorkhon-orange/10 rounded-lg flex-shrink-0">
                <Icon name="Sparkles" size={20} className="text-gorkhon-orange" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-wb-gray-900 mb-1">🚀 Доступно обновление!</h4>
                <p className="text-sm text-wb-gray-600">
                  Новая версия {currentVersion} готова к установке
                </p>
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200">
              <div className="flex items-start gap-2">
                <Icon name="AlertTriangle" size={16} className="text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-orange-900 mb-1">⚠️ Важная информация</p>
                  <p className="text-xs text-orange-800 leading-relaxed">
                    Маршрут <strong>Заиграево → Горхон</strong> временно сокращен. 
                    Автобус ходит <strong>3 раза в неделю</strong> (ПН, СР, ПТ) вместо 5 раз. 
                    Не забудьте, кто планирует поездку!
                  </p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleClick}
              className="w-full bg-gradient-to-r from-gorkhon-orange to-gorkhon-pink text-white"
              size="sm"
            >
              Обновить и посмотреть расписание
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;