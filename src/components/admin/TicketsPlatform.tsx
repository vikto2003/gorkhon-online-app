import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import {
  getTickets,
  addMessage,
  setStatus,
  markReadByAdmin,
  TICKETS_EVENT,
  type Ticket,
  type TicketStatus,
} from '@/lib/ticketService';

const statusLabels: Record<TicketStatus, string> = {
  open: 'Открыт',
  in_progress: 'В работе',
  resolved: 'Решён',
  closed: 'Закрыт',
};

const statusStyles: Record<TicketStatus, string> = {
  open: 'bg-blue-50 text-blue-700 border-blue-200',
  in_progress: 'bg-amber-50 text-amber-700 border-amber-200',
  resolved: 'bg-green-50 text-green-700 border-green-200',
  closed: 'bg-gray-100 text-gray-600 border-gray-200',
};

const formatTime = (iso: string) =>
  new Date(iso).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

const TicketsPlatform = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const [filter, setFilter] = useState<'all' | TicketStatus>('all');
  const endRef = useRef<HTMLDivElement>(null);

  const load = () => setTickets(getTickets());

  useEffect(() => {
    load();
    window.addEventListener(TICKETS_EVENT, load);
    window.addEventListener('storage', load);
    const timer = setInterval(load, 3000);
    return () => {
      window.removeEventListener(TICKETS_EVENT, load);
      window.removeEventListener('storage', load);
      clearInterval(timer);
    };
  }, []);

  const selected = tickets.find(t => t.id === selectedId) || null;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selected?.messages.length]);

  const openTicket = (id: string) => {
    setSelectedId(id);
    markReadByAdmin(id);
  };

  const send = () => {
    if (!selected || !reply.trim()) return;
    addMessage(selected.id, 'agent', reply.trim(), 'Агент поддержки');
    setReply('');
  };

  const visible = filter === 'all' ? tickets : tickets.filter(t => t.status === filter);
  const totalUnread = tickets.reduce((s, t) => s + (t.unreadForAdmin || 0), 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-wb-purple/10">
            <Icon name="LifeBuoy" size={20} className="text-wb-purple" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Тикет-платформа</h2>
            <p className="text-xs text-gray-500">
              Всего: {tickets.length}
              {totalUnread > 0 && <span className="ml-2 text-red-600 font-medium">Новых сообщений: {totalUnread}</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-wrap">
          {(['all', 'open', 'in_progress', 'resolved', 'closed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f ? 'bg-wb-purple text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f === 'all' ? 'Все' : statusLabels[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-[320px_1fr] min-h-[520px]">
        {/* Список тикетов */}
        <div className="border-b md:border-b-0 md:border-r border-gray-200 max-h-[520px] overflow-y-auto">
          {visible.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-400">Тикетов нет</div>
          ) : (
            visible.map(t => (
              <button
                key={t.id}
                onClick={() => openTicket(t.id)}
                className={`w-full text-left p-3 border-b border-gray-100 transition-colors ${
                  selectedId === t.id ? 'bg-wb-purple/5' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-xs font-mono text-gray-400">{t.id}</span>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {t.unreadForAdmin > 0 && (
                      <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {t.unreadForAdmin}
                      </span>
                    )}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${statusStyles[t.status]}`}>
                      {statusLabels[t.status]}
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900 truncate">{t.subject}</p>
                <p className="text-xs text-gray-500 truncate mt-0.5">{t.userName}</p>
                <p className="text-[11px] text-gray-400 mt-1">{formatTime(t.updatedAt)}</p>
              </button>
            ))
          )}
        </div>

        {/* Диалог */}
        <div className="flex flex-col max-h-[520px]">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-400 p-8 text-center">
              Выберите тикет слева, чтобы ответить жителю
            </div>
          ) : (
            <>
              <div className="p-3 border-b border-gray-200 flex items-center justify-between gap-2 flex-wrap">
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">{selected.subject}</p>
                  <p className="text-xs text-gray-500">
                    {selected.userName} · {selected.id} · создан {formatTime(selected.createdAt)}
                  </p>
                </div>
                <select
                  value={selected.status}
                  onChange={e => setStatus(selected.id, e.target.value as TicketStatus)}
                  className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white"
                >
                  {(Object.keys(statusLabels) as TicketStatus[]).map(s => (
                    <option key={s} value={s}>{statusLabels[s]}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {selected.messages.map(m => (
                  <div key={m.id} className={`flex ${m.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 ${
                        m.sender === 'agent' ? 'bg-wb-purple text-white' : 'bg-white border border-gray-200 text-gray-900'
                      }`}
                    >
                      <p className={`text-[11px] mb-1 ${m.sender === 'agent' ? 'text-white/70' : 'text-gray-400'}`}>
                        {m.authorName}
                      </p>
                      <p className="text-sm whitespace-pre-wrap break-words">{m.content}</p>
                      <p className={`text-[10px] mt-1 ${m.sender === 'agent' ? 'text-white/60' : 'text-gray-400'}`}>
                        {formatTime(m.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={endRef} />
              </div>

              <div className="p-3 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                    placeholder="Ответ жителю..."
                    className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-wb-purple"
                  />
                  <button
                    onClick={send}
                    disabled={!reply.trim()}
                    className="px-4 py-2.5 bg-wb-purple text-white rounded-xl hover:bg-wb-purple-dark transition-colors disabled:opacity-40"
                  >
                    <Icon name="Send" size={18} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketsPlatform;
