import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import ChannelProfile from "./ChannelProfile";
import { getSmartResponse } from "@/components/LinaAssistant";

interface ChatMessage {
  text: string;
  sender: 'user' | 'support';
  showAgentButton?: boolean;
  showAdminLink?: boolean;
  timestamp?: string;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSystemChat?: boolean;
}

const ChatModal = ({ isOpen, onClose, isSystemChat = false }: ChatModalProps) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    if (!isSystemChat) {
      return [
        {text: 'Привет! 👋\n\nЯ — Лина, твой ИИ-помощник Горхон.Online!\n\nМогу:\n• Ответить на вопросы о посёлке\n• Подсказать контакты и расписания\n• Помочь с техническими проблемами\n• Просто поболтать 😊\n\nЧем помочь?', sender: 'support', timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
      ];
    }
    return [];
  });
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Функция для воспроизведения мягкого звука "тап"
  const playSendSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Низкий тон для мягкого "тап" (C5 = 523.25 Hz)
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
      oscillator.type = 'sine';

      // Тихий звук с быстрым затуханием для эффекта "тап"
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.08);
    } catch (error) {
      console.log('Sound playback not supported');
    }
  };

  // Загрузка системных сообщений из localStorage (офлайн-режим)
  useEffect(() => {
    if (isSystemChat && isOpen && !showProfile) {
      const loadMessages = () => {
        setIsLoading(true);
        try {
          // Сначала пытаемся загрузить из localStorage
          const savedMessages = localStorage.getItem('systemMessages');
          
          if (savedMessages) {
            const messages = JSON.parse(savedMessages);
            if (messages && messages.length > 0) {
              setChatMessages(messages.map((msg: any) => ({
                text: msg.text,
                sender: 'support' as const
              })));
              setIsLoading(false);
              return;
            }
          }
          
          // Если нет локальных сообщений, показываем приветственное
          setChatMessages([{
            text: '👋 Добро пожаловать в системный чат Горхон.Online!\n\n📢 Следите за новостями и обновлениями здесь!',
            sender: 'support'
          }]);
          setIsLoading(false);
        } catch (error) {
          console.error('Failed to load system messages:', error);
          setChatMessages([{
            text: '👋 Добро пожаловать в системный чат Горхон.Online!\n\n📢 Следите за новостями и обновлениями здесь!',
            sender: 'support'
          }]);
          setIsLoading(false);
        }
      };
      
      loadMessages();
      
      // Слушаем изменения в localStorage для живого обновления
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'systemMessages') {
          loadMessages();
        }
      };
      
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [isOpen, isSystemChat, showProfile]);

  // Адаптация под клавиатуру для всех мобильных устройств
  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        const diff = windowHeight - viewportHeight;
        
        // Устанавливаем высоту клавиатуры если разница больше 50px
        setKeyboardHeight(diff > 50 ? diff : 0);
        
        // Скроллим к полю ввода когда клавиатура открывается
        if (diff > 50) {
          setTimeout(() => {
            const inputElement = document.querySelector('input[type="text"]') as HTMLElement;
            if (inputElement) {
              inputElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);
        }
      }
    };

    // Добавляем обработчики для разных событий
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      window.visualViewport.addEventListener('scroll', handleResize);
      handleResize(); // Вызываем сразу для начальной настройки
    }

    // Fallback для устройств без visualViewport API
    window.addEventListener('resize', handleResize);

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
        window.visualViewport.removeEventListener('scroll', handleResize);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const playMessageSound = () => {
    const audio = new Audio('data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADhAC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7v/////////////////////////////////////////////////////////////////AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAA4SC+vk2AAAAAAD/+xDEAAPAAAGkAAAAIAAANIAAAARMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const sendMessage = async () => {
    if (chatInput.trim()) {
      const userMsg = chatInput.trim();
      
      if (userMsg.length > 1000) {
        return;
      }
      
      playSendSound();
      setChatMessages(prev => [...prev, {text: userMsg, sender: 'user', timestamp: getCurrentTime()}]);
      setChatInput('');
      setIsLoading(true);
      
      try {
        const response = await fetch('https://functions.poehali.dev/e4be3d7a-182c-4c4c-a31f-fe79ef32def1', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: userMsg,
            history: chatMessages.slice(-10)
          })
        });
        
        const data = await response.json();
        
        if (data.success && data.message) {
          setChatMessages(prev => [...prev, {
            text: data.message,
            sender: 'support',
            timestamp: getCurrentTime()
          }]);
        } else {
          setChatMessages(prev => [...prev, {
            text: 'Извините, произошла ошибка. Попробуйте ещё раз! 😔',
            sender: 'support',
            timestamp: getCurrentTime()
          }]);
        }
      } catch (error) {
        console.error('Ошибка связи с Линой:', error);
        const fallbackResponse = getSmartResponse(userMsg);
        setChatMessages(prev => [...prev, {
          text: fallbackResponse,
          sender: 'support',
          timestamp: getCurrentTime()
        }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEnableNotifications = async () => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setShowProfile(false);
      }
    }
  };

  if (!isOpen) return null;

  if (showProfile) {
    return (
      <ChannelProfile 
        isOpen={showProfile} 
        onClose={() => setShowProfile(false)}
        onEnableNotifications={handleEnableNotifications}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50" onClick={onClose}>
      <div 
        className="bg-white rounded-t-2xl md:rounded-2xl w-full md:w-96 md:max-w-md flex flex-col shadow-2xl transition-all duration-200"
        style={{
          height: keyboardHeight > 0 ? `${window.visualViewport?.height || window.innerHeight}px` : '92vh',
          maxHeight: keyboardHeight > 0 ? `${window.visualViewport?.height || window.innerHeight}px` : '92vh'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <button onClick={onClose} className="text-gorkhon-pink hover:bg-gray-100 p-2 rounded-lg transition-colors">
            <Icon name="ChevronLeft" size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <Icon name="Headphones" size={18} className="text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 text-base">Поддержка</h3>
          </div>
          <div className="w-10"></div>
        </div>

        <div className="flex-1 overflow-y-auto bg-white">
          {chatMessages.map((msg, idx) => (
            <div key={idx}>
              {isSystemChat ? (
                // Telegram-канал стиль
                <div className="border-b border-[#2B3942] hover:bg-[#151E27] transition-colors">
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-[#0088CC] flex items-center justify-center flex-shrink-0">
                        <img 
                          src="https://cdn.poehali.dev/files/538a3c94-c9c4-4488-9214-dc9493fadb43.png" 
                          alt="Горхон.Online"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium text-sm">Горхон.Online</span>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                            <circle cx="8" cy="8" r="8" fill="#0088CC"/>
                            <path d="M6 8l2 2 3-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="text-gray-400 text-xs">•</span>
                          <span className="text-gray-400 text-xs">сейчас</span>
                        </div>
                        <p className="text-white text-sm leading-relaxed whitespace-pre-line break-words">{msg.text}</p>
                        <div className="flex items-center gap-4 mt-2 text-gray-400 text-xs">
                          <div className="flex items-center gap-1">
                            <Icon name="Eye" size={14} />
                            <span>1.2K</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-3">
                  {msg.sender === 'support' && (
                    <div className="font-bold text-sm text-gray-900 mb-2">Лина</div>
                  )}
                  <div className="flex items-end gap-2">
                    {msg.sender === 'support' && (
                      <span className="text-xs text-gray-500 mb-1">{msg.timestamp || formatTimeIrkutsk()}</span>
                    )}
                    <div 
                      className={`rounded-3xl px-4 py-3 max-w-[75%] ${
                        msg.sender === 'user' 
                          ? 'ml-auto bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 text-white' 
                          : 'bg-purple-50 text-gray-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line leading-relaxed">{msg.text}</p>
                    </div>
                    {msg.sender === 'user' && (
                      <span className="text-xs text-gray-500 mb-1">{msg.timestamp || formatTimeIrkutsk()}</span>
                    )}
                  </div>
                  {msg.showAgentButton && (
                    <a
                      href="https://vk.com/im?entrypoint=community_page&media=&sel=-214224996"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3 px-4 py-2.5 bg-gorkhon-pink text-white rounded-xl hover:bg-gorkhon-pink/90 transition-colors shadow-sm"
                    >
                      <Icon name="UserCircle" size={18} />
                      <span className="text-sm font-medium">Написать специалисту</span>
                    </a>
                  )}
                  {msg.showAdminLink && (
                    <a
                      href="/admin-panel"
                      className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors shadow-sm"
                    >
                      <Icon name="Settings" size={18} />
                      <span className="text-sm font-medium">Открыть админ-панель</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {!isSystemChat && (
          <div 
            className="p-4 border-t bg-white sticky bottom-0"
            style={{
              position: keyboardHeight > 0 ? 'sticky' : 'relative',
              bottom: 0
            }}
          >
            {isLoading ? (
              <div className="text-center py-2">
                <div className="inline-flex items-center gap-2 text-gray-500 text-sm">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gorkhon-pink"></div>
                  <span>Лина печатает...</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-gray-100 rounded-3xl p-2 shadow-sm">
                <button className="text-gray-400 p-2 active:bg-gray-200 rounded-full transition-colors">
                  <Icon name="Paperclip" size={20} />
                </button>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  onFocus={() => {
                    // Скроллим к полю при фокусе
                    setTimeout(() => {
                      const input = document.activeElement as HTMLElement;
                      if (input) {
                        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }, 300);
                  }}
                  placeholder="Ваше сообщение"
                  className="flex-1 px-2 py-2 bg-transparent border-none focus:outline-none text-sm"
                />
                <button 
                  onClick={sendMessage}
                  disabled={!chatInput.trim()}
                  className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-2.5 rounded-full active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  <Icon name="Send" size={18} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatModal;