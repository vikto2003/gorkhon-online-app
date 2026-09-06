import { useState, useCallback, useEffect, memo } from "react";
import PhotoCarousel from "@/components/PhotoCarousel";
import InstallPrompt from "@/components/InstallPrompt";
import SplashScreen from "@/components/SplashScreen";
import RecommendationNotice from "@/components/RecommendationNotice";
import Home from "@/components/sections/Home";
import Header from "@/components/layout/Header";
import DesktopRail from "@/components/layout/DesktopRail";
import NotificationBell from "@/components/layout/NotificationBell";
import BottomNav, { type BottomNavTab } from "@/components/layout/BottomNav";
import SettingsPage from "@/components/settings/SettingsPage";
import ChatsPage from "@/components/chats/ChatsPage";
import ChatModal from "@/components/chat/ChatModal";
import DocumentModal from "@/components/documents/DocumentModal";
import FAQ from "@/components/documents/FAQ";
import SearchModal from "@/components/search/SearchModal";
import type { SearchItem } from "@/components/search/searchIndex";
import { getUnreadForUser, getMyTickets, markReadByUser, TICKETS_EVENT } from "@/lib/ticketService";


interface Photo {
  url: string;
  caption: string;
}

const Index = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [selectedPvzPhotos, setSelectedPvzPhotos] = useState<Photo[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<BottomNavTab>('main');
  const [activeDocument, setActiveDocument] = useState<'privacy' | 'terms' | 'security' | null>(null);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [chatsUnread, setChatsUnread] = useState(0);

  useEffect(() => {
    const checkAndNotifyUpdate = async () => {
      const APP_VERSION = '3.9.1';
      const currentVersion = localStorage.getItem('appVersion');
      const notificationShown = sessionStorage.getItem('updateNotificationShown');
      const newIcon = 'https://cdn.poehali.dev/projects/80b27c13-e76f-4c17-9cd3-0ca13d96fc7a/bucket/49a4926a-8d83-465d-ba36-1bb75c363f14.png';
      
      if (currentVersion !== APP_VERSION && !notificationShown && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification('🎨 Обновили иконку приложения!', {
            body: `Мы сменили иконку НАШ chat. Она обновится автоматически — переустанавливать приложение не нужно.`,
            icon: newIcon,
            badge: newIcon,
            tag: 'app-update',
            requireInteraction: true,
            vibrate: [200, 100, 200]
          });
          sessionStorage.setItem('updateNotificationShown', 'true');
        } else if (Notification.permission === 'default') {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            new Notification('🎨 Обновили иконку приложения!', {
              body: `Мы сменили иконку НАШ chat. Она обновится автоматически — переустанавливать приложение не нужно.`,
              icon: newIcon,
              tag: 'app-update',
              requireInteraction: true,
              vibrate: [200, 100, 200]
            });
            sessionStorage.setItem('updateNotificationShown', 'true');
          }
        }
      }
    };
    
    checkAndNotifyUpdate();

    // Автоматическое обновление номеров у всех пользователей
    const updatePhoneNumbers = () => {
      const currentVersion = '3.2'; // Версия обновления
      const lastUpdate = localStorage.getItem('phoneNumbersVersion');
      
      if (lastUpdate !== currentVersion) {
        const updatedNumbers = {
          importantNumbers: [
            { name: "Участковый", person: "Алексей", phone: "+7-999-275-34-13", icon: "Shield" },
            { name: "Скорая Новый", person: "Экстренная помощь", phone: "7-301-364-51-03, 112", icon: "Ambulance" },
            { name: "Диспетчер РЭС", person: "Электроснабжение", phone: "+7-301-234-40-83", icon: "Zap" },
            { name: "Диспетчер ЭкоАльянс", person: "Вывоз мусора", phone: "+7-983-433-95-71", icon: "Trash2" },
            { name: "МФЦ Заиграево", person: "Многофункциональный центр", phone: "+7-301-364-11-01", icon: "Building" },
            { name: "Соц.защита Заиграево", person: "Социальная защита населения", phone: "+7-301-364-12-20", icon: "Heart" },
            { name: "Регистратура поликлиники", person: "Заиграево", phone: "+7-924-555-90-03", icon: "Stethoscope" },
            { name: "Нотариус Заиграево", person: "Нотариальные услуги", phone: "+7-301-364-16-14, +7-301-364-22-92", icon: "FileText" },
            { name: "Судебные приставы", person: "Заиграевский район", phone: "8-301-364-10-10", icon: "Scale" },
            { name: "Вакуумная машина", person: "Кондаков К.Ю., Горхон", phone: "+7-983-453-99-02", icon: "Truck" },
            { name: "Почта Горхон", person: "Волгина Наталья", phone: "+7-914-849-03-92", icon: "Mail" },
            { name: "Миграционная служба", person: "ГАИ Заиграево", phone: "8-301-364-15-70", icon: "Car" }
          ],
          transitNumbers: [
            { name: "Диспетчер Заиграево", person: "Микрики", phone: "8-983-420-04-90", icon: "Bus" },
            { name: "Диспетчер Улан-Удэ", person: "Микрики", phone: "8-983-420-04-03", icon: "Bus" },
            { name: "Диспетчер Новоильинск", person: "Касса", phone: "+7-902-167-02-26", icon: "Bus" }
          ]
        };
        
        const existingContent = localStorage.getItem('homePageContent');
        let content: Record<string, unknown> = {};
        try {
          content = existingContent ? JSON.parse(existingContent) : {};
        } catch {
          content = {};
        }
        
        content.importantNumbers = updatedNumbers.importantNumbers;
        content.transitNumbers = updatedNumbers.transitNumbers;
        
        // Сохраняем режим работы, если его нет
        if (!content.workSchedule || content.workSchedule.length === 0) {
          content.workSchedule = [
            { name: "Почта", schedule: "ПН, СР, ЧТ, ПТ: 9-17ч, СБ: 9-16ч. Обед: 13-14ч. ВТ, ВС - выходные", icon: "Mail" },
            { name: "Сбербанк", schedule: "ВТ, ПТ: 9-17ч. Обед: 12:30-13:30. ПН, СР, ЧТ, СБ, ВС - выходные", icon: "CreditCard" },
            { name: "МУП ЖКХ", schedule: "ПН-ПТ: 8-16ч. Обед: 12-13ч", icon: "Wrench" }
          ];
        }
        
        localStorage.setItem('homePageContent', JSON.stringify(content));
        localStorage.setItem('phoneNumbersVersion', currentVersion);
      }
    };
    
    updatePhoneNumbers();
  }, []);

  // Счётчик непрочитанных ответов поддержки на вкладке «Чаты»
  useEffect(() => {
    const sync = () => setChatsUnread(getUnreadForUser());
    sync();
    window.addEventListener(TICKETS_EVENT, sync);
    window.addEventListener('storage', sync);
    const timer = setInterval(sync, 3000);
    return () => {
      window.removeEventListener(TICKETS_EVENT, sync);
      window.removeEventListener('storage', sync);
      clearInterval(timer);
    };
  }, []);


  const openPhotoCarousel = useCallback((photos: Photo[], startIndex: number) => {
    setSelectedPvzPhotos(photos);
    setSelectedImageIndex(startIndex);
  }, []);

  const closePhotoCarousel = useCallback(() => {
    setSelectedImageIndex(null);
    setSelectedPvzPhotos([]);
  }, []);

  const nextPhoto = useCallback(() => {
    if (selectedImageIndex !== null && selectedPvzPhotos.length > 0) {
      setSelectedImageIndex((prev) => prev !== null ? (prev + 1) % selectedPvzPhotos.length : 0);
    }
  }, [selectedImageIndex, selectedPvzPhotos.length]);

  const prevPhoto = useCallback(() => {
    if (selectedImageIndex !== null && selectedPvzPhotos.length > 0) {
      setSelectedImageIndex((prev) => prev !== null ? (prev === 0 ? selectedPvzPhotos.length - 1 : prev - 1) : 0);
    }
  }, [selectedImageIndex, selectedPvzPhotos.length]);

  const handleUpdateClick = useCallback(() => {
    setActiveTab('settings');
  }, []);

  const openSupportChat = useCallback(() => {
    getMyTickets().forEach(t => markReadByUser(t.id));
    setChatsUnread(0);
    setIsChatOpen(true);
  }, []);

  const handleSearchNavigate = useCallback((action: SearchItem['action']) => {
    if (action.type === 'tab') {
      setActiveTab(action.tab);
    } else if (action.type === 'tel') {
      window.open(`tel:${action.phone}`, '_self');
    } else if (action.type === 'scroll') {
      setActiveTab('main');
      setTimeout(() => {
        document.getElementById(action.anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, []);

  const isChatsTab = activeTab === 'chats';

  return (
    <>
      <SplashScreen />
      <div className="min-h-screen md:h-screen bg-wb-gray-50 relative overflow-x-hidden w-full max-w-full md:flex md:overflow-hidden">

        <DesktopRail
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSearchClick={() => setIsSearchOpen(true)}
          chatsBadge={chatsUnread}
        />

        <Header 
          currentVersion="3.9.1"
          onUpdateClick={handleUpdateClick}
          onSearchClick={() => setIsSearchOpen(true)}
        />

        <div className="md:flex-1 md:flex md:flex-col md:min-w-0 md:h-full">
          {!isChatsTab && (
            <div className="hidden md:flex items-center justify-between px-6 py-3.5 border-b border-wb-gray-200 bg-white flex-shrink-0">
              <h2 className="font-semibold text-wb-gray-900">
                {activeTab === 'main' ? 'Главное' : 'Настройки'}
              </h2>
              <NotificationBell currentVersion="3.9.1" onUpdateClick={handleUpdateClick} />
            </div>
          )}

          {isChatsTab ? (
            <div className="md:flex-1 md:min-h-0">
              <ChatsPage />
            </div>
          ) : (
            <div className="md:flex-1 md:min-h-0 md:overflow-y-auto">
              <main className="flex-1 bg-wb-gray-50 min-h-screen md:min-h-0 relative z-10 overflow-x-hidden pt-16 md:pt-0 pb-20 md:pb-0">
                <div className="max-w-full md:max-w-3xl mx-auto px-4 pt-2 pb-4 md:p-6 space-y-4 md:space-y-6">
                  {activeTab === 'main' ? (
                    <>
                      <Home onOpenPhotoCarousel={openPhotoCarousel} />

                      <div className="text-center pt-4 pb-2">
                        <a
                          href="/recommendations-policy.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          Применяются рекомендательные технологии
                        </a>
                      </div>
                    </>
                  ) : (
                    <SettingsPage
                      onChatOpen={openSupportChat}
                      onDocumentOpen={(doc) => setActiveDocument(doc)}
                      onFAQOpen={() => setIsFAQOpen(true)}
                    />
                  )}
                </div>
              </main>
            </div>
          )}
        </div>

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} chatsBadge={chatsUnread} />

        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onNavigate={handleSearchNavigate}
        />

        <ChatModal 
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />

        <DocumentModal 
          activeDocument={activeDocument}
          onClose={() => setActiveDocument(null)}
        />

        {isFAQOpen && (
          <FAQ onClose={() => setIsFAQOpen(false)} />
        )}

        <PhotoCarousel 
          selectedImageIndex={selectedImageIndex}
          selectedPvzPhotos={selectedPvzPhotos}
          onClose={closePhotoCarousel}
          onNext={nextPhoto}
          onPrev={prevPhoto}
        />
        
        <InstallPrompt />
        <RecommendationNotice />
      </div>
    </>
  );
};

export default memo(Index);