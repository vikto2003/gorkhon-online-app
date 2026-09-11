import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";
import { getSmartResponse } from "@/components/LinaAssistant";
import { needsAgent, createTicket, addMessage, getMyTickets, TICKETS_EVENT } from "@/lib/ticketService";

interface ChatMessage {
  text: string;
  sender: 'user' | 'support';
  timestamp?: string;
}

// Встраиваемая версия чата поддержки (Лина) без модального окна — используется
// в десктопном двухколоночном виде вкладки «Чаты».
const SupportChatPanel = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { text: '👋 Привет! Я Лина — ваша помощница на платформе «НАШ чат»!\n\nГотова ответить на вопросы о расписании, услугах и жизни в посёлке, а ещё помочь разобраться с самой платформой. Чем помочь?', sender: 'support', timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [quickActions, setQuickActions] = useState<string[]>([
    '📍 Расписание транспорта',
    '📞 Важные номера',
    '🏪 Пункты выдачи',
    '💝 Помощь поселку'
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const shownAgentMessageIds = useRef<Set<string>>(new Set());
  const endRef = useRef<HTMLDivElement>(null);

  const getCurrentTime = () => new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isLoading]);

  useEffect(() => {
    const syncAgentReplies = () => {
      const shown = new Set(shownAgentMessageIds.current);
      const replies = getMyTickets()
        .flatMap(t => t.messages.filter(m => m.sender === 'agent'))
        .filter(m => !shown.has(m.id))
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

      if (replies.length === 0) return;

      replies.forEach(m => shownAgentMessageIds.current.add(m.id));
      setChatMessages(prev => [
        ...prev,
        ...replies.map(m => ({
          text: `👨‍💼 ${m.authorName}: ${m.content}`,
          sender: 'support' as const,
          timestamp: new Date(m.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        })),
      ]);
    };

    syncAgentReplies();
    window.addEventListener(TICKETS_EVENT, syncAgentReplies);
    window.addEventListener('storage', syncAgentReplies);
    return () => {
      window.removeEventListener(TICKETS_EVENT, syncAgentReplies);
      window.removeEventListener('storage', syncAgentReplies);
    };
  }, []);

  // Создаёт тикет (или дописывает в открытый) и возвращает текст-подтверждение для пользователя
  const escalateToAgent = (userMsg: string, linaReply?: string): string => {
    const openTicket = getMyTickets().find(t => t.status === 'open' || t.status === 'in_progress');

    if (openTicket) {
      addMessage(openTicket.id, 'user', userMsg);
      return `У вас уже открыт тикет ${openTicket.id} — я передала туда ваше сообщение. Специалист ответит здесь же, как только освободится 👌`;
    }

    const history = chatMessages
      .slice(-6)
      .map(m => `${m.sender === 'user' ? 'Житель' : 'Лина'}: ${m.text}`)
      .join('\n');

    const description = [history, `Житель: ${userMsg}`, linaReply ? `Лина: ${linaReply}` : null]
      .filter(Boolean)
      .join('\n');

    const ticket = createTicket({
      subject: userMsg.slice(0, 80),
      description,
      source: 'chat-desktop',
    });

    return `Готово! Создала тикет ${ticket.id} — специалист скоро подключится к диалогу в разделе поддержки. Ответ придёт сюда, а также уведомлением 🔔`;
  };

  const sendMessage = async () => {
    const userMsg = chatInput.trim();
    if (!userMsg || userMsg.length > 1000) return;

    setChatMessages(prev => [...prev, { text: userMsg, sender: 'user', timestamp: getCurrentTime() }]);
    setChatInput('');

    if (needsAgent(userMsg)) {
      const confirmation = escalateToAgent(userMsg);
      setChatMessages(prev => [...prev, { text: confirmation, sender: 'support', timestamp: getCurrentTime() }]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/86afc7b0-d617-4d0d-a955-53265aaafa55', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history: chatMessages.slice(-10) })
      });
      const data = await response.json();

      if (data.success && data.message) {
        setChatMessages(prev => [...prev, { text: data.message, sender: 'support', timestamp: getCurrentTime() }]);

        if (data.needsAgent) {
          const confirmation = escalateToAgent(userMsg, data.message);
          setChatMessages(prev => [...prev, { text: confirmation, sender: 'support', timestamp: getCurrentTime() }]);
        }
      } else {
        setChatMessages(prev => [...prev, { text: 'Извините, произошла ошибка. Попробуйте ещё раз! 😔', sender: 'support', timestamp: getCurrentTime() }]);
      }
    } catch {
      const fallbackResponse = getSmartResponse(userMsg);
      setChatMessages(prev => [...prev, { text: fallbackResponse, sender: 'support', timestamp: getCurrentTime() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center gap-3 p-4 border-b border-wb-gray-200 flex-shrink-0">
        <div className="relative flex-shrink-0">
          <img
            src="https://cdn.poehali.dev/projects/80b27c13-e76f-4c17-9cd3-0ca13d96fc7a/files/e16ab677-9c6a-4c42-b702-71df32e35b5c.jpg"
            alt="Поддержка"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
        </div>
        <div>
          <div className="flex items-center gap-1">
            <h3 className="font-semibold text-wb-gray-900 text-sm">Поддержка</h3>
            <Icon name="BadgeCheck" size={14} className="text-wb-purple flex-shrink-0" />
          </div>
          <p className="text-xs text-green-600">в сети</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chatMessages.length === 1 && quickActions.length > 0 && (
          <div className="px-5 pt-4 pb-2">
            <p className="text-xs text-wb-gray-500 mb-2 font-medium">Частые вопросы:</p>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => { setChatInput(action); setQuickActions([]); }}
                  className="px-3 py-2 bg-wb-purple/5 hover:bg-wb-purple/10 text-wb-purple rounded-xl text-xs font-medium transition-colors border border-wb-purple/20"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}

        {chatMessages.map((msg, idx) => (
          <div key={idx} className="px-5 py-2.5">
            {msg.sender === 'support' && (
              <div className="font-bold text-xs text-wb-gray-900 mb-1.5">Лина</div>
            )}
            <div className="flex items-end gap-2">
              {msg.sender === 'support' && (
                <span className="text-[11px] text-wb-gray-400 mb-1 flex-shrink-0">{msg.timestamp}</span>
              )}
              <div
                className={`rounded-2xl px-4 py-2.5 max-w-[70%] ${
                  msg.sender === 'user' ? 'ml-auto bg-wb-purple text-white' : 'bg-wb-gray-100 text-wb-gray-900'
                }`}
              >
                <p className="text-sm whitespace-pre-line leading-relaxed">{msg.text}</p>
              </div>
              {msg.sender === 'user' && (
                <span className="text-[11px] text-wb-gray-400 mb-1 flex-shrink-0">{msg.timestamp}</span>
              )}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="p-4 border-t border-wb-gray-200 flex-shrink-0">
        {isLoading ? (
          <div className="text-center py-2">
            <div className="inline-flex items-center gap-2 text-wb-gray-500 text-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-wb-purple"></div>
              <span>Лина печатает...</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-wb-gray-100 rounded-2xl p-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Ваше сообщение"
              className="flex-1 px-2 py-1.5 bg-transparent border-none focus:outline-none text-sm"
            />
            <button
              onClick={sendMessage}
              disabled={!chatInput.trim()}
              className="bg-wb-purple text-white p-2 rounded-full transition-colors disabled:opacity-40"
            >
              <Icon name="Send" size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportChatPanel;