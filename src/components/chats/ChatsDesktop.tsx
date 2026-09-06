import { useState } from "react";
import Icon from "@/components/ui/icon";
import { externalChats } from "./externalChats";

type SelectedChat = string;

// Десктопная версия вкладки «Чаты»: список слева (стиль MAX/Telegram Desktop),
// переписка/контент справа.
const ChatsDesktop = () => {
  const [selected, setSelected] = useState<SelectedChat>(externalChats[0]?.url ?? '');
  const [query, setQuery] = useState('');

  const selectedExternal = externalChats.find(c => c.url === selected);
  const q = query.trim().toLowerCase();
  const filteredExternal = externalChats.filter(c => !q || c.name.toLowerCase().includes(q) || c.preview.toLowerCase().includes(q));

  return (
    <div className="flex h-full">
      <div className="w-[360px] flex-shrink-0 border-r border-wb-gray-200 flex flex-col bg-white">
        <div className="p-4 pb-3 flex-shrink-0">
          <h1 className="text-xl font-bold text-wb-gray-900 mb-3">Чаты</h1>
          <div className="flex items-center gap-2 bg-wb-gray-100 rounded-xl px-3 py-2">
            <Icon name="Search" size={17} className="text-wb-gray-400 flex-shrink-0" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск чатов"
              className="flex-1 bg-transparent border-none focus:outline-none text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredExternal.map((chat) => (
            <button
              key={chat.url}
              onClick={() => setSelected(chat.url)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                selected === chat.url ? 'bg-wb-purple/5' : 'hover:bg-wb-gray-50'
              }`}
            >
              {chat.avatar ? (
                <img src={chat.avatar} alt={chat.name} className="w-11 h-11 rounded-full object-cover flex-shrink-0 bg-wb-gray-100" />
              ) : (
                <div className={`w-11 h-11 rounded-full ${chat.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon name={chat.icon as any} size={19} className="text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-sm text-wb-gray-900 truncate">{chat.name}</p>
                  {chat.muted && <Icon name="BellOff" size={12} className="text-wb-gray-300 flex-shrink-0" />}
                  <span className="text-[11px] text-wb-gray-400 ml-auto flex-shrink-0">{chat.time}</span>
                </div>
                <p className="text-xs text-wb-gray-500 truncate mt-0.5">{chat.preview}</p>
              </div>
            </button>
          ))}

          {filteredExternal.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-wb-gray-400">Ничего не найдено</div>
          )}
        </div>

        <div className="p-3 border-t border-wb-gray-100 flex-shrink-0">
          <p className="text-xs text-wb-gray-500 leading-relaxed px-1">
            Добавить чат:{" "}
            <a href="mailto:admin@gorhon.ru" className="text-wb-purple hover:text-wb-purple-dark font-medium underline">
              admin@gorhon.ru
            </a>
          </p>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        {selectedExternal ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            {selectedExternal.avatar ? (
              <img src={selectedExternal.avatar} alt={selectedExternal.name} className="w-20 h-20 rounded-full object-cover mb-4" />
            ) : (
              <div className={`p-4 rounded-full ${selectedExternal.color} mb-4`}>
                <Icon name={selectedExternal.icon as any} size={32} className="text-white" />
              </div>
            )}
            <h3 className="font-semibold text-wb-gray-900 text-lg mb-1">{selectedExternal.name}</h3>
            <p className="text-sm text-wb-gray-500 mb-5">{selectedExternal.platform}</p>
            <a
              href={selectedExternal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-wb-purple hover:bg-wb-purple-dark text-white rounded-xl font-medium transition-colors"
            >
              <Icon name="ExternalLink" size={18} />
              Открыть чат
            </a>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-8 text-wb-gray-400">
            <Icon name="MessageCircle" size={40} className="mb-3" />
            <p className="text-sm">Выберите чат слева</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatsDesktop;
