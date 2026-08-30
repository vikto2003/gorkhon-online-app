import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

interface SettingsPageProps {
  onChatOpen: () => void;
  onDocumentOpen: (doc: 'privacy' | 'terms' | 'security') => void;
  onFAQOpen: () => void;
}

const APP_VERSION = '3.9.0';

const SettingsPage = ({ onChatOpen, onDocumentOpen, onFAQOpen }: SettingsPageProps) => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const savedVersion = localStorage.getItem('appVersion');
    if (savedVersion !== APP_VERSION) {
      setUpdateAvailable(true);
    }
  }, []);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
        }
      }
      localStorage.setItem('appVersion', APP_VERSION);
      sessionStorage.clear();
      setUpdateAvailable(false);
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      console.error('Ошибка при обновлении:', error);
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-wb-gray-900 px-1">Настройки</h1>

      {/* Поддержка */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-wb-gray-600 uppercase tracking-wide px-1">Поддержка</h3>
        <button
          onClick={onChatOpen}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors bg-wb-purple hover:bg-wb-purple-dark text-white"
        >
          <Icon name="Headphones" size={22} />
          <div className="flex-1">
            <div className="font-semibold">Агент поддержки</div>
            <div className="text-xs opacity-90">Ответы на вопросы и помощь 24/7</div>
          </div>
          <Icon name="ChevronRight" size={18} className="opacity-70" />
        </button>
        <button
          onClick={onFAQOpen}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors text-wb-gray-700 bg-white hover:bg-wb-gray-50 border border-wb-gray-200"
        >
          <Icon name="HelpCircle" size={18} className="text-wb-gray-500" />
          <span className="text-sm font-medium flex-1">Частые вопросы</span>
          <Icon name="ChevronRight" size={18} className="text-wb-gray-400" />
        </button>
      </div>

      {/* Приложение */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-wb-gray-600 uppercase tracking-wide px-1">Приложение</h3>
        {updateAvailable && (
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50"
          >
            <Icon name={isUpdating ? "Loader2" : "Download"} size={18} className={isUpdating ? "animate-spin" : ""} />
            <div className="flex-1">
              <div className="text-sm font-semibold">{isUpdating ? "Обновление..." : "Установить обновление"}</div>
              <div className="text-xs opacity-90">Доступна версия {APP_VERSION}</div>
            </div>
          </button>
        )}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-wb-gray-200">
          <Icon name="Info" size={18} className="text-wb-gray-500" />
          <div className="flex-1">
            <div className="text-sm font-medium text-wb-gray-900">Версия приложения</div>
            <div className="text-xs text-wb-gray-600">{APP_VERSION}</div>
          </div>
        </div>
      </div>

      {/* Документы */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-wb-gray-600 uppercase tracking-wide px-1">Документы</h3>
        <div className="rounded-xl overflow-hidden border border-wb-gray-200 bg-white divide-y divide-wb-gray-100">
          <button
            onClick={() => onDocumentOpen('privacy')}
            className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors text-wb-gray-700 hover:bg-wb-gray-50"
          >
            <Icon name="Shield" size={18} className="text-wb-gray-500" />
            <span className="text-sm font-medium flex-1">Политика конфиденциальности</span>
            <Icon name="ChevronRight" size={18} className="text-wb-gray-400" />
          </button>
          <button
            onClick={() => onDocumentOpen('terms')}
            className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors text-wb-gray-700 hover:bg-wb-gray-50"
          >
            <Icon name="FileText" size={18} className="text-wb-gray-500" />
            <span className="text-sm font-medium flex-1">Правила пользования</span>
            <Icon name="ChevronRight" size={18} className="text-wb-gray-400" />
          </button>
          <button
            onClick={() => onDocumentOpen('security')}
            className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors text-wb-gray-700 hover:bg-wb-gray-50"
          >
            <Icon name="Lock" size={18} className="text-wb-gray-500" />
            <span className="text-sm font-medium flex-1">Защита информации и рекомендательные технологии</span>
            <Icon name="ChevronRight" size={18} className="text-wb-gray-400" />
          </button>
        </div>
      </div>

      {/* Социальные сети */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-wb-gray-600 uppercase tracking-wide px-1">Мы в соцсетях</h3>
        <div className="space-y-2">
          <a
            href="https://vk.com/gorhon_official"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors text-white bg-[#0077FF] hover:bg-[#0066DD]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.18 14.5h-1.34c-.53 0-.69-.42-1.65-1.39-.83-.82-1.2-.93-1.41-.93-.29 0-.37.08-.37.47v1.27c0 .34-.11.54-1 .54-1.47 0-3.1-.89-4.25-2.55-1.72-2.37-2.19-4.15-2.19-4.52 0-.21.08-.4.47-.4h1.34c.35 0 .48.16.62.53.68 1.97 1.82 3.69 2.29 3.69.18 0 .26-.08.26-.53v-2.06c-.06-.98-.58-1.06-.58-1.41 0-.17.14-.34.36-.34h2.1c.3 0 .4.16.4.5v2.77c0 .3.13.4.22.4.18 0 .32-.1.65-.43 1.01-1.13 1.73-2.88 1.73-2.88.09-.2.26-.4.61-.4h1.34c.4 0 .49.21.4.5-.15.72-.98 2.13-1.83 3.19-.18.24-.24.36 0 .64.17.21.74.73 1.12 1.17.69.79 1.22 1.45 1.36 1.91.14.47-.08.71-.53.71z"/>
            </svg>
            <span className="text-sm font-medium flex-1">ВКонтакте</span>
            <Icon name="ExternalLink" size={16} className="opacity-80" />
          </a>
          <a
            href="https://t.me/gorhon_official"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors text-white bg-[#0088CC] hover:bg-[#0077BB]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
            </svg>
            <span className="text-sm font-medium flex-1">Telegram</span>
            <Icon name="ExternalLink" size={16} className="opacity-80" />
          </a>
          <a
            href="https://max.ru/join/3eGYRla63lvcgxOAc8Mg9lsKYa1N8IiMEvG1Kw2W_NY"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors text-white bg-black hover:bg-gray-900"
          >
            <img
              src="https://cdn.poehali.dev/files/qr-logo.g__tzhK_.png"
              alt="MAX"
              className="w-5 h-5 object-contain"
            />
            <span className="text-sm font-medium flex-1">MAX</span>
            <Icon name="ExternalLink" size={16} className="opacity-80" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;