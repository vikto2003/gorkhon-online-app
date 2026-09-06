import { useState, useMemo } from "react";
import Icon from "@/components/ui/icon";
import { externalChats } from "./externalChats";

type FilterTab = 'all' | 'community';

const ChatsMobile = () => {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<FilterTab>('all');

  const filteredExternal = useMemo(() => {
    const q = query.trim().toLowerCase();
    return externalChats.filter((c) => {
      if (!q) return true;
      return c.name.toLowerCase().includes(q) || c.preview.toLowerCase().includes(q);
    });
  }, [query]);

  return (
    <div className="flex flex-col h-full -mx-4 -mt-2 md:mx-0 md:mt-0">
      {/* Заголовок */}
      <div className="px-4 pt-1 pb-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-wb-gray-900">Чаты</h1>
      </div>

      {/* Поиск */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 bg-wb-gray-100 rounded-xl px-3 py-2.5">
          <Icon name="Search" size={18} className="text-wb-gray-400 flex-shrink-0" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск чатов и сообщений"
            className="flex-1 bg-transparent border-none focus:outline-none text-sm text-wb-gray-900 placeholder:text-wb-gray-400"
          />
        </div>
      </div>

      {/* Вкладки-фильтры */}
      <div className="px-4 pb-2 flex items-center gap-2 overflow-x-auto scrollbar-hide">
        {([
          { id: 'all' as const, label: 'Все' },
          { id: 'community' as const, label: 'Посёлок' },
        ]).map((f) => (
          <button
            key={f.id}
            onClick={() => setTab(f.id)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
              tab === f.id ? 'bg-wb-purple text-white' : 'bg-wb-gray-100 text-wb-gray-600'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="h-px bg-wb-gray-100 mx-4" />

      {/* Список чатов */}
      <div className="flex-1 overflow-y-auto">
        {filteredExternal.map((chat) => (
          <a
            key={chat.url}
            href={chat.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full flex items-center gap-3 px-4 py-3 text-left active:bg-wb-gray-50 transition-colors border-b border-wb-gray-50 ${
              chat.pinned ? 'bg-wb-purple/[0.03]' : ''
            }`}
          >
            {chat.avatar ? (
              <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0 bg-wb-gray-100" />
            ) : (
              <div className={`w-12 h-12 rounded-full ${chat.color} flex items-center justify-center flex-shrink-0`}>
                <Icon name={chat.icon as any} size={22} className="text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <p className="font-semibold text-[15px] text-wb-gray-900 truncate">{chat.name}</p>
                {chat.muted && <Icon name="BellOff" size={13} className="text-wb-gray-300 flex-shrink-0" />}
                <span className="text-xs text-wb-gray-400 ml-auto flex-shrink-0 flex items-center gap-1">
                  {chat.time}
                  {chat.pinned && <Icon name="Pin" size={12} className="text-wb-gray-300" />}
                </span>
              </div>
              <p className="text-sm text-wb-gray-500 truncate mt-0.5">{chat.preview}</p>
            </div>
          </a>
        ))}

        {filteredExternal.length === 0 && (
          <div className="px-4 py-10 text-center text-sm text-wb-gray-400">Ничего не найдено</div>
        )}

        <div className="p-4">
          <div className="p-3 rounded-xl bg-wb-purple/5 border border-wb-purple/20">
            <div className="flex items-start gap-2">
              <Icon name="Info" size={16} className="text-wb-purple flex-shrink-0 mt-0.5" />
              <p className="text-xs text-wb-gray-700 leading-relaxed">
                Добавить чат на витрину:{" "}
                <a href="mailto:admin@gorhon.ru" className="text-wb-purple font-medium underline">
                  admin@gorhon.ru
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatsMobile;
