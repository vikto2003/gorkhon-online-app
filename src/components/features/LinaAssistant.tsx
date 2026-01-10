import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  typing?: boolean;
  quickReplies?: string[];
}

interface LinaAssistantProps {
  onClose: () => void;
}

const LinaAssistant = ({ onClose }: LinaAssistantProps) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [userName, setUserName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadMessages = () => {
      const systemMessages: Message[] = [];
      
      try {
        const saved = localStorage.getItem('systemMessages');
        if (saved) {
          const parsedMessages = JSON.parse(saved);
          parsedMessages.forEach((msg: any) => {
            systemMessages.push({
              id: msg.id,
              text: `📢 Системное сообщение:\n\n${msg.text}`,
              isUser: false,
              timestamp: new Date(msg.timestamp)
            });
          });
        }
      } catch (error) {
        console.error('Ошибка загрузки системных сообщений:', error);
      }
      
      const savedName = localStorage.getItem('userName') || '';
      setUserName(savedName);
      
      const greeting = savedName 
        ? `Привет, ${savedName}! 👋 Рада снова тебя видеть!\n\nЧем займёмся сегодня?`
        : 'Привет! Я Лина — твой персональный ИИ-помощник! ✨\n\n💫 Ищу информацию в интернете\n🏘️ Отвечаю на вопросы о Горхоне\n🛠️ Помогаю решить любые проблемы\n📱 Подскажу, как пользоваться платформой\n\nКак тебя зовут?';
      
      const welcomeMessage: Message = {
        id: '1',
        text: greeting,
        isUser: false,
        timestamp: new Date(),
        quickReplies: savedName ? ['Важные контакты', 'Поиск в интернете', 'О платформе'] : undefined
      };
      
      setMessages([welcomeMessage, ...systemMessages]);
    };

    loadMessages();

    const handleStorageChange = () => {
      loadMessages();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const performWebSearch = async (_query: string): Promise<string[]> => {
    setIsSearching(false);
    return [];
  };

  const findResponse = async (question: string): Promise<{ text: string; quickReplies?: string[] }> => {
    if (!userName && question.trim().length < 30 && !question.toLowerCase().includes('как') && 
        !question.toLowerCase().includes('что') && !question.toLowerCase().includes('где')) {
      const name = question.trim();
      if (name && !question.toLowerCase().includes('привет')) {
        setUserName(name);
        localStorage.setItem('userName', name);
        return {
          text: `Приятно познакомиться, ${name}! 😊\n\nТеперь я буду обращаться к тебе по имени. Чем могу помочь?`,
          quickReplies: ['Важные контакты', 'Поиск в интернете', 'О платформе']
        };
      }
    }

    const lowerInput = question.toLowerCase();
    
    // Важные контакты
    if (lowerInput.includes('важн') && (lowerInput.includes('контакт') || lowerInput.includes('номер') || lowerInput.includes('телефон'))) {
      return {
        text: '📞 Важные контакты поселка:\n\n🚑 Скорая помощь: 103\n🚓 Полиция: 102\n🚒 Пожарная служба: 101\n📞 Единый номер: 112\n\n🏛️ Администрация:\n📱 +7 (XXX) XXX-XX-XX',
        quickReplies: ['О платформе', 'Ещё вопрос']
      };
    }
    
    // О платформе
    if (lowerInput.includes('горхон') || lowerInput.includes('платформ') || lowerInput.includes('о сайте')) {
      return {
        text: 'Горхон.Online — это информационная платформа поселка! 🏘️\n\n✨ Возможности:\n• Новости и объявления\n• Контакты организаций\n• Карты и адреса\n• Системный чат\n• Поиск информации\n\nЧто вас интересует?',
        quickReplies: ['Важные контакты', 'Как пользоваться', 'Главная']
      };
    }
    
    // Помощь и инструкции
    if (lowerInput.includes('как') || lowerInput.includes('помощь') || lowerInput.includes('что делать')) {
      return {
        text: 'С удовольствием помогу! 😊\n\nМогу:\n• Подсказать важные контакты\n• Объяснить функции платформы\n• Показать разделы сайта\n• Помочь с навигацией\n\nЧто вас интересует?',
        quickReplies: ['Важные контакты', 'О платформе', 'Главная']
      };
    }
    
    // Приветствие
    if (lowerInput.includes('привет') || lowerInput.includes('здравствуй') || lowerInput.includes('добр')) {
      return {
        text: `Привет${userName ? ', ' + userName : ''}! 👋\n\nЯ Лина — ваш помощник по Горхон.Online. Чем могу помочь?`,
        quickReplies: ['Важные контакты', 'О платформе', 'Главная']
      };
    }
    
    // Благодарности
    if (lowerInput.includes('спасибо') || lowerInput.includes('благодар')) {
      return {
        text: 'Пожалуйста! 😊 Всегда рада помочь. Обращайтесь!',
        quickReplies: ['Ещё вопрос', 'Главная']
      };
    }

    return { 
      text: 'Не совсем поняла вопрос 🤔\n\nПопробуйте переформулировать или выберите готовый вариант:',
      quickReplies: ['Важные контакты', 'О платформе', 'Помощь']
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    const response = await findResponse(currentInput);
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: response.text,
      isUser: false,
      timestamp: new Date(),
      quickReplies: response.quickReplies
    };
    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  const handleQuickReply = async (reply: string) => {
    if (reply === 'Открыть админ-панель') {
      navigate('/admin-panel');
      return;
    }
    if (reply === 'Написать агенту') {
      window.open('https://forms.yandex.ru/u/687f5b9a84227c08790f3222/', '_blank');
      return;
    }
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: reply,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    const response = await findResponse(reply);
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: response.text,
      isUser: false,
      timestamp: new Date(),
      quickReplies: response.quickReplies
    };
    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (!isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMinimized, messages]);

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 z-50 animate-pulse"
      >
        <div className="relative">
          <Icon name="MessageCircle" size={28} />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-gradient-to-br from-white to-purple-50/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border-2 border-purple-200/50">
      <div className="bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 text-white p-5 flex items-center justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent animate-pulse"></div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-12 h-12 bg-gradient-to-br from-white to-purple-100 rounded-2xl flex items-center justify-center shadow-lg relative">
            <span className="text-2xl">✨</span>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <div>
            <h3 className="font-bold text-xl">Лина</h3>
            <p className="text-xs text-purple-100 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg"></span>
              {isSearching ? 'Ищу в интернете...' : 'Онлайн • ИИ-помощник'}
            </p>
          </div>
        </div>
        <div className="flex gap-2 relative z-10">
          <button
            onClick={() => setIsMinimized(true)}
            className="text-white/90 hover:text-white hover:bg-white/20 p-2 rounded-xl transition-all hover:scale-110 backdrop-blur-sm"
            title="Свернуть"
          >
            <Icon name="Minimize2" size={18} />
          </button>
          <button
            onClick={onClose}
            className="text-white/90 hover:text-white hover:bg-white/20 p-2 rounded-xl transition-all hover:scale-110 backdrop-blur-sm"
            title="Закрыть"
          >
            <Icon name="X" size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-transparent to-purple-50/20">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom duration-300`}>
            <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
              message.isUser
                ? 'bg-gradient-to-br from-purple-500 via-violet-500 to-purple-600 text-white shadow-purple-200/50'
                : 'bg-white text-gray-800 border border-gray-100 shadow-gray-100'
            }`}>
              <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{message.text}</p>
              <span className={`text-xs mt-1 block ${message.isUser ? 'text-purple-100' : 'text-gray-400'}`}>
                {message.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
              </span>
              {message.quickReplies && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {message.quickReplies.map((reply, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickReply(reply)}
                      className={`px-4 py-2 rounded-xl text-xs font-medium transition-all hover:scale-105 shadow-sm ${
                        message.isUser 
                          ? 'bg-white/20 hover:bg-white/30 border border-white/30 text-white backdrop-blur-sm'
                          : 'bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white shadow-purple-200/50'
                      }`}
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-in slide-in-from-bottom duration-300">
            <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2.5 h-2.5 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2.5 h-2.5 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-xs text-gray-600 font-medium">Лина думает...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-gradient-to-r from-purple-50/50 to-violet-50/50 border-t border-purple-100">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Напишите сообщение Лине..."
            className="flex-1 px-4 py-3.5 bg-white border-2 border-purple-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition-all shadow-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="px-6 py-3.5 bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 text-white rounded-2xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all flex items-center gap-2 font-medium shadow-purple-200/50"
          >
            <Icon name="Send" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinaAssistant;