import { useState, useCallback, useEffect, memo } from "react";
import PhotoCarousel from "@/components/PhotoCarousel";
import InstallPrompt from "@/components/InstallPrompt";
import SplashScreen from "@/components/SplashScreen";
import RecommendationNotice from "@/components/RecommendationNotice";
import Home from "@/components/sections/Home";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import ChatModal from "@/components/chat/ChatModal";
import DocumentModal from "@/components/documents/DocumentModal";
import FAQ from "@/components/documents/FAQ";


interface Photo {
  url: string;
  caption: string;
}

const Index = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [selectedPvzPhotos, setSelectedPvzPhotos] = useState<Photo[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeDocument, setActiveDocument] = useState<'privacy' | 'terms' | 'security' | null>(null);
  const [isFAQOpen, setIsFAQOpen] = useState(false);

  useEffect(() => {
    const checkAndNotifyUpdate = async () => {
      const APP_VERSION = '3.8.0';
      const currentVersion = localStorage.getItem('appVersion');
      const notificationShown = sessionStorage.getItem('updateNotificationShown');
      
      if (currentVersion !== APP_VERSION && !notificationShown && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification('🚀 Важное обновление!', {
            body: `⚠️ Изменения в расписании! Заиграево → Горхон теперь 3 раза в неделю (ПН, СР, ПТ). Нажмите для подробностей.`,
            icon: 'https://cdn.poehali.dev/projects/80b27c13-e76f-4c17-9cd3-0ca13d96fc7a/bucket/6642dbf5-9434-4dca-abb3-693152bd21d7.png',
            badge: 'https://cdn.poehali.dev/projects/80b27c13-e76f-4c17-9cd3-0ca13d96fc7a/bucket/6642dbf5-9434-4dca-abb3-693152bd21d7.png',
            tag: 'app-update',
            requireInteraction: true,
            vibrate: [200, 100, 200]
          });
          sessionStorage.setItem('updateNotificationShown', 'true');
        } else if (Notification.permission === 'default') {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            new Notification('🚀 Важное обновление!', {
              body: `⚠️ Изменения в расписании! Заиграево → Горхон теперь 3 раза в неделю (ПН, СР, ПТ). Нажмите для подробностей.`,
              icon: 'https://cdn.poehali.dev/projects/80b27c13-e76f-4c17-9cd3-0ca13d96fc7a/bucket/6642dbf5-9434-4dca-abb3-693152bd21d7.png',
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
    setIsSidebarOpen(true);
  }, []);

  return (
    <>
      <SplashScreen />
      <div className="min-h-screen bg-wb-gray-50 relative overflow-x-hidden w-full max-w-full">
        
        <Header 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
          currentVersion="3.8.0"
          onUpdateClick={handleUpdateClick}
        />

        <div className="flex pt-16 md:pt-16">
          <main className="flex-1 bg-wb-gray-50 min-h-screen relative z-10 overflow-x-hidden">
            <div className="max-w-full md:max-w-2xl mx-auto px-4 pt-2 pb-4 md:p-4 space-y-4 md:space-y-6 md:pb-4">
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
            </div>
          </main>
        </div>

        <Sidebar 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onChatOpen={() => setIsChatOpen(true)}
          onDocumentOpen={(doc) => setActiveDocument(doc)}
          onFAQOpen={() => setIsFAQOpen(true)}
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