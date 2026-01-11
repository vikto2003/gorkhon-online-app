import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { formatTimeIrkutsk } from '@/utils/timezone';

interface LinaAssistantProps {
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function LinaAssistant({ onClose }: LinaAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Привет! Я Лина 👋\n\n🤖 Я помощник по САЙТУ Горхон.Online:\n• Объясню функции сайта\n• Покажу разделы\n• Помогу с навигацией\n• Отвечу на вопросы\n\n⚠️ ВАЖНО: Я НЕ ищу информацию в интернете!\nДля этого используйте Яндекс или Google.',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getSmartResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    // Яндекс сервисы
    if (lowerInput.includes('яндекс') || lowerInput.includes('yandex')) {
      if (lowerInput.includes('карт') || lowerInput.includes('map')) {
        return 'Яндекс.Карты интегрированы в Горхон.Online! 🗺️\n\nМожете:\n• Найти любой адрес в поселке\n• Построить маршрут\n• Посмотреть панорамы улиц\n• Найти ближайшие организации\n\nДостаточно ввести адрес в поиске!';
      }
      if (lowerInput.includes('метрик') || lowerInput.includes('analytic')) {
        return 'Для владельцев сайта доступна интеграция с Яндекс.Метрикой:\n• Статистика посещений\n• Карта кликов\n• Анализ поведения\n• Вебвизор\n\nНужна помощь с подключением?';
      }
      if (lowerInput.includes('поиск') || lowerInput.includes('search')) {
        return 'На сайте работает умный поиск на базе Яндекс технологий! 🔍\n\nМожно искать:\n• Объявления\n• Новости\n• Контакты организаций\n• Телефоны\n\nПопробуйте ввести запрос!';
      }
      return 'Горхон.Online интегрирован с Яндекс сервисами! 🚀\n\nДоступно:\n• Яндекс.Карты для навигации\n• Яндекс.Метрика для аналитики\n• Поиск на технологиях Яндекса\n\nЧто именно интересует?';
    }
    
    // Поиск информации - ПЕРВЫМ делом!
    if (lowerInput.includes('найди') || lowerInput.includes('найти') || lowerInput.includes('ищу') || lowerInput.includes('поищи') || lowerInput.includes('поиск') || lowerInput.includes('актуальн') || lowerInput.includes('информация о')) {
      return '⚠️ Я НЕ ищу в интернете!\n\n🤖 Моя роль — помощник по САЙТУ:\n• Объяснить функции сайта\n• Показать разделы\n• Помочь с навигацией\n• Ответить на вопросы о платформе\n\n🌐 Для поиска информации используйте:\n• Яндекс.Поиск\n• Google\n• Яндекс.Карты (для адресов)\n• Разделы сайта Горхон.Online';
    }
    
    // Вопросы о поселках и информации
    if (lowerInput.includes('поселок') || lowerInput.includes('посёлок')) {
      return '⚠️ Я не ищу информацию в интернете!\n\n📱 Я помогу только с сайтом Горхон.Online:\n• Показать разделы сайта\n• Объяснить, как пользоваться\n• Помочь найти нужную страницу\n• Подсказать контакты из базы сайта\n\nДля поиска информации о поселках используйте:\n• Раздел "Объявления" на сайте\n• Яндекс.Карты для адресов\n• Поисковик Яндекс или Google';
    }
    
    // Вопросы о Горхон.Online
    if (lowerInput.includes('горхон') || lowerInput.includes('gorhon') || lowerInput.includes('платформ') || lowerInput.includes('сайт')) {
      return 'Горхон.Online — это информационная платформа поселка.\n\nНа сайте есть:\n• Раздел объявлений\n• Новости\n• Контакты организаций\n• Карты и адреса\n\nЧто вас интересует о сайте?';
    }
    
    // Вопросы о функционале платформы
    if (lowerInput.includes('как использовать') || lowerInput.includes('что можно') || lowerInput.includes('функции')) {
      return 'На Горхон.Online можно:\n• Смотреть объявления\n• Читать новости\n• Искать контакты организаций\n• Использовать карты\n• Добавлять свои объявления\n\nЧто именно интересует?';
    }
    
    // Вопросы о картах и геолокации
    if (lowerInput.includes('карт') || lowerInput.includes('адрес') || lowerInput.includes('маршрут') || lowerInput.includes('геолокац')) {
      return 'Для работы с картами использую Яндекс.Карты! 🗺️\n\nВозможности:\n• Поиск по адресу\n• Построение маршрутов\n• Просмотр панорам\n• Метки организаций\n• Определение геолокации\n\nВведите адрес или название места!';
    }
    
    // Вопросы об аналитике
    if (lowerInput.includes('аналитик') || lowerInput.includes('статистик') || lowerInput.includes('метрик') || lowerInput.includes('посещ')) {
      return 'Для аналитики подключена Яндекс.Метрика! 📊\n\nВы можете отслеживать:\n• Количество посетителей\n• Источники трафика\n• Популярные страницы\n• Время на сайте\n• Конверсии\n\nХотите подключить для вашего сайта?';
    }
    
    // Вопросы о помощи
    if (lowerInput.includes('помощь') || lowerInput.includes('как') || lowerInput.includes('что делать')) {
      return 'С удовольствием помогу! Могу:\n• Работать с Яндекс сервисами\n• Объяснять функции платформы\n• Показывать разделы сайта\n• Помогать с навигацией\n\nРасскажите подробнее, что нужно?';
    }
    
    // Приветствие
    if (lowerInput.includes('привет') || lowerInput.includes('здравствуй') || lowerInput.includes('добр')) {
      return 'Привет! 👋 Я Лина — ваш помощник по сайту Горхон.Online.\n\n⚠️ Важно: я НЕ ищу информацию в интернете!\n\nПомогу разобраться с функциями сайта. Что вас интересует?';
    }
    
    // Благодарности
    if (lowerInput.includes('спасибо') || lowerInput.includes('благодар')) {
      return 'Пожалуйста! 😊 Всегда рада быть полезной. Если появятся ещё вопросы о сайте — обращайтесь!';
    }
    
    // Технические вопросы
    if (lowerInput.includes('ошибка') || lowerInput.includes('не работает') || lowerInput.includes('проблема') || lowerInput.includes('баг')) {
      return 'Понимаю, что возникли трудности! 🔧\n\nОпишите проблему подробнее:\n• Что именно не работает?\n• Какую ошибку видите?\n• На какой странице?\n\nПостараюсь помочь!';
    }
    
    // Функциональность
    if (lowerInput.includes('функция') || lowerInput.includes('возможност') || lowerInput.includes('можно ли')) {
      return 'В Горхон.Online много крутых функций:\n• Интеграция с Яндекс.Картами\n• Яндекс.Метрика для аналитики\n• Умный поиск\n• Создание объявлений\n• Новости поселка\n• Контакты организаций\n• Адаптивный дизайн\n\nЧто именно интересует?';
    }

    // Вопросы о дизайне
    if (lowerInput.includes('дизайн') || lowerInput.includes('красив') || lowerInput.includes('стиль')) {
      return 'С дизайном помогу! 🎨 Могу:\n• Подобрать современные цвета\n• Создать красивые компоненты\n• Сделать адаптивную верстку\n• Добавить анимации и эффекты\n\nОпишите, какой стиль нравится!';
    }

    // Вопросы о мобильной версии
    if (lowerInput.includes('мобил') || lowerInput.includes('телефон') || lowerInput.includes('адаптив')) {
      return 'Все сайты автоматически адаптивные! 📱 Они отлично выглядят на:\n• Телефонах\n• Планшетах\n• Компьютерах\n• Любых экранах\n\nНикаких дополнительных настроек не нужно!';
    }
    
    // Общий умный ответ
    const contextResponses = [
      '⚠️ Я не ищу в интернете! Могу помочь только с функциями сайта Горхон.Online. Что вас интересует о самом сайте?',
      'Я — помощник по сайту, не поисковик 😊 Могу объяснить, как пользоваться Горхон.Online. Что подсказать?',
      'Для поиска информации используйте Яндекс или Google. Я помогу разобраться с функциями сайта!',
      'Моя задача — помочь с навигацией по сайту. Для поиска в интернете используйте поисковики 🔍',
      'Я не поисковик, а помощник по сайту! Подскажу, как пользоваться разделами Горхон.Online 😊'
    ];
    
    return contextResponses[Math.floor(Math.random() * contextResponses.length)];
  };

export { getSmartResponse };

  const playMessageSound = () => {
    const audio = new Audio('data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADhAC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7v/////////////////////////////////////////////////////////////////AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAA4SC+vk2AAAAAAD/+xDEAAPAAAGkAAAAIAAANIAAAARMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    playMessageSound();
    setMessages(prev => [...prev, userMessage]);
    const userInput = inputText;
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getSmartResponse(userInput);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-2xl bg-white rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden h-[92vh] md:h-auto flex flex-col"
        style={{paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 0px)'}}>
        <div className="bg-gradient-to-r from-purple-500 via-violet-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <Icon name="Bot" size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Лина - помощник по сайту</h2>
                <p className="text-purple-100 text-sm">Не ищу в интернете • Только функции сайта</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <Icon name="X" size={20} className="text-white" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:h-96">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.isUser
                    ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                <p className={`text-xs mt-2 ${message.isUser ? 'text-purple-200' : 'text-gray-500'}`}>
                  {formatTimeIrkutsk(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 md:p-4 border-t bg-gray-50">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Вопрос о сайте..."
              className="flex-1 px-3 md:px-4 py-2.5 md:py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm md:text-base"
            />
            <button
              onClick={handleSend}
              className="px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-xl hover:shadow-lg transition-all font-medium text-sm md:text-base min-w-[80px] md:min-w-0"
            >
              <span className="hidden md:inline">Отправить</span>
              <Icon name="Send" size={18} className="md:hidden" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}