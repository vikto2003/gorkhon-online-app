import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { useState, useCallback, useEffect } from "react";
import { getDefaultPvz } from "@/components/admin/defaultData";

interface PvzPhoto {
  url: string;
  caption: string;
}

interface PvzItem {
  name: string;
  address: string;
  schedule: string;
  phone: string;
  hasFitting?: boolean;
  fittingCount?: string;
  icon?: string;
  logoUrl?: string;
  photos?: PvzPhoto[];
  chatLink?: string;
  note?: string;
}

interface PvzSectionProps {
  onOpenPhotoCarousel: (photos: PvzPhoto[], startIndex: number) => void;
}

interface PhotoCarouselProps {
  photos: PvzPhoto[];
  onPhotoClick: (photos: PvzPhoto[], startIndex: number) => void;
}

const PhotoCarousel = ({ photos, onPhotoClick }: PhotoCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Минимальная дистанция свайпа для срабатывания
  const minSwipeDistance = 50;
  
  const nextPhoto = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);
  
  const prevPhoto = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);
  
  const goToPhoto = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);
  
  // Обработчики для свайпов
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);
  
  const onTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);
  
  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      nextPhoto();
    } else if (isRightSwipe) {
      prevPhoto();
    }
  }, [touchStart, touchEnd, minSwipeDistance, nextPhoto, prevPhoto]);
  
  return (
    <div className="space-y-3">
      {/* Main photo */}
      <div 
        className="relative overflow-hidden rounded-2xl group"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <img 
          src={photos[currentIndex].url}
          alt={photos[currentIndex].caption}
          className="w-full h-48 md:h-64 object-cover border-2 border-slate-200 shadow-lg cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-xl hover:border-gorkhon-pink/40 select-none"
          onClick={() => onPhotoClick(photos, currentIndex)}
          loading="lazy"
          draggable={false}
          style={{ 
            imageRendering: 'crisp-edges',
            filter: 'contrast(1.05) saturate(1.1)',
            userSelect: 'none'
          }}
        />
        
        {/* Navigation arrows - как в ВК */}
        {photos.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevPhoto();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/95 hover:bg-white backdrop-blur-sm shadow-md opacity-80 group-hover:opacity-100 transition-all duration-300 hover:scale-105 z-10 flex items-center justify-center border border-white/20"
            >
              <Icon name="ChevronLeft" size={16} className="text-gray-700" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextPhoto();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/95 hover:bg-white backdrop-blur-sm shadow-md opacity-80 group-hover:opacity-100 transition-all duration-300 hover:scale-105 z-10 flex items-center justify-center border border-white/20"
            >
              <Icon name="ChevronRight" size={16} className="text-gray-700" />
            </button>
          </>
        )}
        
        {/* Zoom icon overlay - стиль ВК */}
        <div 
          className="absolute inset-0 bg-black/20 hover:bg-black/40 transition-all duration-300 rounded-2xl flex items-center justify-center cursor-pointer"
          onClick={() => {
            onPhotoClick(photos, currentIndex);
          }}
        >
          <div className="p-3 rounded-full bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 pointer-events-none shadow-lg">
            <Icon name="Expand" size={18} className="text-gray-700" />
          </div>
        </div>
        
        {/* Счетчик фото как в ВК */}
        {photos.length > 1 && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
            {currentIndex + 1} / {photos.length}
          </div>
        )}
      </div>
      
      {/* Индикаторы как в ВК */}
      {photos.length > 1 && (
        <div className="flex justify-center gap-1.5">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => goToPhoto(index)}
              className={`rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-6 h-1.5 bg-gorkhon-pink' 
                  : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      )}
      
      {/* Caption */}
      <p className="text-xs text-slate-600 font-medium leading-relaxed text-center">
        {photos[currentIndex].caption}
      </p>
      

    </div>
  );
};

const PvzSection = ({ onOpenPhotoCarousel }: PvzSectionProps) => {
  const [pvzData, setPvzData] = useState<PvzItem[]>(getDefaultPvz());

  const loadData = useCallback(() => {
    try {
      const savedContent = localStorage.getItem('homePageContent');
      if (savedContent) {
        const content = JSON.parse(savedContent);
        if (content.pvzItems && content.pvzItems.length > 0) {
          setPvzData(content.pvzItems);
          return;
        }
      }
      setPvzData(getDefaultPvz());
    } catch {
      setPvzData(getDefaultPvz());
    }
  }, []);

  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, [loadData]);

  return (
    <Card className="animate-fade-in rounded-2xl bg-white border-2 border-gorkhon-pink/10 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-gorkhon-pink">
          <div className="p-2 rounded-full bg-gorkhon-pink/10 animate-pulse">
            <Icon name="Package" size={20} />
          </div>
          <div>
            <span className="text-lg font-bold">Пункты выдачи заказов</span>
            <p className="text-sm text-slate-600 font-normal">Доставка 360° прямо к вам</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {pvzData.map((pvz, index) => (
          <div key={index} className="group relative overflow-hidden p-6 rounded-2xl bg-white border border-wb-gray-200 hover:border-gorkhon-pink/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gorkhon-pink/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            <div className="flex items-center gap-4 mb-5 relative z-10">
              <div className="p-3.5 rounded-2xl bg-gorkhon-pink/10 group-hover:bg-gorkhon-pink/20 transition-all duration-300 shadow-sm">
                {pvz.logoUrl ? (
                  <img 
                    src={pvz.logoUrl} 
                    alt={`${pvz.name} Logo`} 
                    className="w-8 h-8 object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <Icon name={(pvz.icon as any) || 'Package'} size={22} className="text-wb-purple group-hover:text-gorkhon-pink group-hover:scale-110 transition-all duration-300" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg text-slate-900 group-hover:text-gorkhon-pink transition-colors mb-2">{pvz.name}</h4>
                <div className="flex items-start gap-2">
                  <Icon name="MapPin" size={15} className="text-wb-gray-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-wb-gray-700 break-words leading-relaxed">{pvz.address}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-green-50 border border-green-200/60 shadow-sm">
                <Icon name="Clock" size={17} className="text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm font-semibold text-green-800 break-words">{pvz.schedule}</span>
              </div>
              
              <div className="space-y-4">
                {(pvz.hasFitting || pvz.note) && (
                  <div className="space-y-3">
                    {pvz.hasFitting && (
                      <div className="p-3.5 rounded-xl bg-wb-purple/5 border border-wb-purple/20 shadow-sm">
                        <div className="flex items-center gap-2.5">
                          <Icon name="ShoppingBag" size={16} className="text-wb-purple" />
                          <p className="text-sm font-bold text-wb-purple-dark">Примерочные:</p>
                          <p className="text-sm font-semibold text-wb-purple">{pvz.fittingCount || 'есть'}</p>
                        </div>
                      </div>
                    )}

                    {pvz.note && (
                      <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200/60 shadow-sm">
                        <div className="flex items-center gap-2.5 mb-2">
                          <Icon name="MapPin" size={16} className="text-blue-600" />
                          <p className="text-sm font-bold text-blue-900">Как добраться</p>
                        </div>
                        <p className="text-sm text-blue-700 leading-relaxed">{pvz.note}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {pvz.photos && (
                  <div className="pt-2">
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="p-1.5 rounded-lg bg-gorkhon-pink/10">
                        <Icon name="Camera" size={16} className="text-gorkhon-pink" />
                      </div>
                      <p className="text-sm font-bold text-gorkhon-pink">Фотографии ПВЗ</p>
                    </div>
                    <PhotoCarousel 
                      photos={pvz.photos} 
                      onPhotoClick={(photos, startIndex) => onOpenPhotoCarousel(photos, startIndex)}
                    />
                  </div>
                )}

                {pvz.chatLink && (
                  <div className="pt-2">
                    <a
                      href={pvz.chatLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3.5 rounded-xl bg-wb-purple hover:bg-wb-purple-dark text-white transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                      <div className="p-2 rounded-lg bg-white/20">
                        <Icon name="MessageCircle" size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold">Чат ПВЗ в Telegram</p>
                        <p className="text-xs opacity-90">Задайте вопрос или уточните информацию</p>
                      </div>
                      <Icon name="ExternalLink" size={16} className="opacity-70" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        <div className="mt-6 p-5 rounded-2xl bg-wb-purple/5 border border-gorkhon-pink/20 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gorkhon-pink/10">
              <Icon name="Truck" size={18} className="text-gorkhon-pink" />
            </div>
            <p className="text-sm font-bold text-slate-900">Удобство 360°</p>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">Получайте заказы в удобных для вас точках!</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PvzSection;