import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface LinaAssistantProps {
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const getSmartResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();

    // Приветствие
    if (lowerInput.includes('привет') || lowerInput.includes('здравствуй') || lowerInput.includes('добр')) {
      return 'Привет! 👋 Я Лина — помощница платформы «НАШ чат».\n\nПодскажу расписание транспорта, важные номера, где ПВЗ и как записаться к врачу. Чем помочь?';
    }

    // Вопросы о самой платформе
    if (lowerInput.includes('наш чат') || lowerInput.includes('платформ') || lowerInput.includes('что за сайт') || lowerInput.includes('горхон.online') || lowerInput.includes('горхон онлайн')) {
      return '«НАШ чат» — платформа для жителей посёлка Горхон 🏘️\n\nВ разделе «Главное»: важные номера, расписание транспорта, режим работы организаций, погода, ПВЗ и запись к врачу.\nВ «Чатах»: официальные группы посёлка и чат ПВЗ.\nВ «Настройках»: поддержка, частые вопросы, документы.\n\nРаньше платформа называлась Горхон.Online — теперь это «НАШ чат».';
    }

    // Транспорт
    if (lowerInput.includes('расписан') || lowerInput.includes('автобус') || lowerInput.includes('электричк') || lowerInput.includes('транспорт')) {
      return 'Расписание транспорта — в разделе «Главное» на главном экране 🚌\n\nТам актуальное расписание автобусов и электричек Горхон ↔ Улан-Удэ и Горхон ↔ Заиграево, включая временные изменения.';
    }

    // Важные номера
    if (lowerInput.includes('номер') || lowerInput.includes('телефон') || lowerInput.includes('контакт')) {
      return 'Все важные номера собраны в разделе «Главное» → «Важные номера» 📞\n\nУчастковый, скорая, диспетчеры, МФЦ, почта и другие службы посёлка.';
    }

    // ПВЗ
    if (lowerInput.includes('пвз') || lowerInput.includes('пункт выдачи') || lowerInput.includes('wildberries') || lowerInput.includes('вайлдберриз') || lowerInput.includes('озон') || lowerInput.includes('ozon')) {
      return 'Пункты выдачи заказов — в разделе «Главное» → «ПВЗ» 📦\n\nТам адреса, режим работы, фото и ссылка на чат ПВЗ в Telegram.';
    }

    // Запись к врачу
    if (lowerInput.includes('врач') || lowerInput.includes('црб') || lowerInput.includes('поликлиник') || lowerInput.includes('запис')) {
      return 'Записаться к врачу можно через чат Заиграевской ЦРБ — он есть в разделе «Чаты» 🩺';
    }

    // Помощь посёлку
    if (lowerInput.includes('помощь посел') || lowerInput.includes('сбор средств') || lowerInput.includes('пожертв')) {
      return 'Раздел «Помощь посёлку» на главном экране — там реквизиты для поддержки посёлка, храма и наших бойцов 💙';
    }

    // Приложение / установка
    if (lowerInput.includes('установ') || lowerInput.includes('приложен') || lowerInput.includes('на телефон')) {
      return 'Установить «НАШ чат» на телефон просто 📲\n\nAndroid (Chrome): меню → «Установить приложение».\niOS (Safari): «Поделиться» → «На экран Домой».';
    }

    // Технические вопросы / жалобы
    if (lowerInput.includes('ошибка') || lowerInput.includes('не работает') || lowerInput.includes('проблема') || lowerInput.includes('баг')) {
      return 'Понимаю, что возникли трудности! 🔧 Опишите, что именно не работает — и я передам это специалисту поддержки, если сама не смогу помочь.';
    }

    // Благодарности
    if (lowerInput.includes('спасибо') || lowerInput.includes('благодар')) {
      return 'Пожалуйста! 😊 Обращайтесь, если появятся ещё вопросы.';
    }

    // Общий ответ
    const contextResponses = [
      'Я помощница платформы «НАШ чат» 😊 Спрашивайте про расписание транспорта, номера служб, ПВЗ или запись к врачу.',
      'Подскажу по разделам «НАШ чат»: важные номера, транспорт, ПВЗ, запись к врачу. Что интересует?',
      'Если вопрос сложный или нужен живой специалист — просто напишите «позови специалиста», и я передам обращение в поддержку 👌',
    ];

    return contextResponses[Math.floor(Math.random() * contextResponses.length)];
  };

export default function LinaAssistant({ onClose }: LinaAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Привет! Я Лина 👋\n\n🤖 Я помощница платформы «НАШ чат»:\n• Расскажу про расписание транспорта\n• Подскажу важные номера\n• Покажу, где ПВЗ и как записаться к врачу\n• Объясню, как пользоваться платформой\n\nЕсли нужен живой специалист — просто попросите, и я передам обращение в поддержку 👌',
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
        <div className="bg-white border-b border-wb-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-wb-purple/10 rounded-lg flex items-center justify-center">
                <Icon name="Bot" size={20} className="text-wb-purple" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-wb-gray-900">Лина — помощница «НАШ чат»</h2>
                <p className="text-wb-gray-600 text-xs">Расписание, номера, ПВЗ и поддержка</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg hover:bg-wb-gray-100 flex items-center justify-center transition-colors"
            >
              <Icon name="X" size={18} className="text-wb-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-wb-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className="max-w-[80%] flex flex-col gap-2">
                <div
                  className={`rounded-xl px-4 py-3 ${
                    message.isUser
                      ? 'bg-wb-purple text-white'
                      : 'bg-white border border-wb-gray-200 text-wb-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-2 ${message.isUser ? 'text-white/80' : 'text-wb-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {!message.isUser && (
                  <a
                    href="https://forms.yandex.ru/u/687f5b9a84227c08790f3222"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-wb-purple text-white rounded-lg hover:bg-wb-purple-dark transition-colors text-sm font-medium"
                  >
                    <Icon name="Send" size={16} />
                    Написать специалисту
                  </a>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-wb-gray-200 rounded-xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-wb-purple rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-wb-purple rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-wb-purple rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 md:p-4 border-t border-wb-gray-200 bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Вопрос о сайте..."
              className="flex-1 px-4 py-3 rounded-lg border border-wb-gray-300 focus:outline-none focus:border-wb-purple focus:ring-1 focus:ring-wb-purple text-sm"
            />
            <button
              onClick={handleSend}
              className="px-4 md:px-6 py-3 bg-wb-purple hover:bg-wb-purple-dark text-white rounded-lg transition-colors font-medium text-sm min-w-[80px] md:min-w-0"
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