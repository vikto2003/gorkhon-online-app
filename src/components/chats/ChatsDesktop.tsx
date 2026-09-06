import { useState } from "react";
import Icon from "@/components/ui/icon";
import { externalChats } from "./externalChats";
import SupportChatPanel from "@/components/chat/SupportChatPanel";

type SelectedChat = 'support' | string;

// Десктопная версия вкладки «Чаты»: список слева (как в Telegram Desktop),
// переписка/контент справа.
const ChatsDesktop = () => {
  const [selected, setSelected] = useState<SelectedChat>('support');

  const selectedExternal = externalChats.find(c => c.url === selected);

  return (
    <div className="flex h-full">
      <div className="w-[360px] flex-shrink-0 border-r border-wb-gray-200 flex flex-col bg-white">
        <div className="p-4 border-b border-wb-gray-100 flex-shrink-0">
          <h1 className="text-xl font-bold text-wb-gray-900">Чаты</h1>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-3 pt-3 pb-1">
            <p className="text-[11px] font-semibold text-wb-gray-500 uppercase tracking-wide px-2">Поддержка</p>
          </div>
          <button
            onClick={() => setSelected('support')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
              selected === 'support' ? 'bg-wb-purple/5' : 'hover:bg-wb-gray-50'
            }`}
          >
            <div className="p-2.5 rounded-full bg-wb-purple flex-shrink-0">
              <Icon name="Headphones" size={19} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-wb-gray-900 truncate">Агент поддержки</p>
              <p className="text-xs text-wb-gray-500 truncate mt-0.5">Ответим на вопросы 24/7</p>
            </div>
          </button>

          <div className="px-3 pt-4 pb-1">
            <p className="text-[11px] font-semibold text-wb-gray-500 uppercase tracking-wide px-2">Чаты посёлка</p>
          </div>
          {externalChats.map((chat) => (
            <button
              key={chat.url}
              onClick={() => setSelected(chat.url)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                selected === chat.url ? 'bg-wb-purple/5' : 'hover:bg-wb-gray-50'
              }`}
            >
              <div className={`p-2.5 rounded-full ${chat.color} flex-shrink-0`}>
                <Icon name={chat.icon as any} size={19} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-wb-gray-900 truncate">{chat.name}</p>
                <p className="text-xs text-wb-gray-500 truncate mt-0.5">{chat.platform}</p>
              </div>
              <Icon name="ExternalLink" size={15} className="text-wb-gray-400 flex-shrink-0" />
            </button>
          ))}
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
        {selected === 'support' ? (
          <SupportChatPanel />
        ) : selectedExternal ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <div className={`p-4 rounded-full ${selectedExternal.color} mb-4`}>
              <Icon name={selectedExternal.icon as any} size={32} className="text-white" />
            </div>
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
        ) : null}
      </div>
    </div>
  );
};

export default ChatsDesktop;
