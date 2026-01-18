import Icon from "@/components/ui/icon";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onChatOpen: () => void;
  onDocumentOpen: (doc: 'privacy' | 'terms' | 'security') => void;
}

const Sidebar = ({ isOpen, onClose, onChatOpen, onDocumentOpen }: SidebarProps) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div 
        className="fixed top-0 right-0 bottom-0 z-50 w-[85vw] max-w-sm bg-white shadow-2xl overflow-y-auto rounded-l-3xl transform transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
        style={{paddingTop: 'max(env(safe-area-inset-top, 0px), 0px)', paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)'}}
      >
        <div className="p-5 pb-4 border-b border-wb-gray-200 flex items-center justify-between rounded-tl-3xl bg-white">
          <h3 className="font-semibold text-wb-gray-900 text-lg">Меню</h3>
          <button onClick={onClose} className="text-wb-gray-600 hover:bg-wb-gray-100 p-2 rounded-lg transition-colors">
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-wb-gray-600 uppercase tracking-wide">Поддержка</h3>
            <button
              onClick={() => {
                onClose();
                onChatOpen();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors bg-wb-purple hover:bg-wb-purple-dark text-white"
            >
              <div className="relative">
                <Icon name="Bot" size={22} />
              </div>
              <div className="flex-1">
                <div className="font-semibold">Лина - ИИ помощник</div>
                <div className="text-xs opacity-90">Ответы на вопросы и помощь 24/7</div>
              </div>
            </button>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-wb-gray-600 uppercase tracking-wide">Социальные сети</h3>
            <div className="space-y-2">
              <a
                href="https://vk.com/gorhon_official"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-white bg-[#0077FF] hover:bg-[#0066DD]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.18 14.5h-1.34c-.53 0-.69-.42-1.65-1.39-.83-.82-1.2-.93-1.41-.93-.29 0-.37.08-.37.47v1.27c0 .34-.11.54-1 .54-1.47 0-3.1-.89-4.25-2.55-1.72-2.37-2.19-4.15-2.19-4.52 0-.21.08-.4.47-.4h1.34c.35 0 .48.16.62.53.68 1.97 1.82 3.69 2.29 3.69.18 0 .26-.08.26-.53v-2.06c-.06-.98-.58-1.06-.58-1.41 0-.17.14-.34.36-.34h2.1c.3 0 .4.16.4.5v2.77c0 .3.13.4.22.4.18 0 .32-.1.65-.43 1.01-1.13 1.73-2.88 1.73-2.88.09-.2.26-.4.61-.4h1.34c.4 0 .49.21.4.5-.15.72-.98 2.13-1.83 3.19-.18.24-.24.36 0 .64.17.21.74.73 1.12 1.17.69.79 1.22 1.45 1.36 1.91.14.47-.08.71-.53.71z"/>
                </svg>
                <span className="text-sm font-medium">ВКонтакте</span>
              </a>
              <a
                href="https://t.me/gorhon_official"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-white bg-[#0088CC] hover:bg-[#0077BB]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
                <span className="text-sm font-medium">Telegram</span>
              </a>
              <a
                href="https://max.ru/join/3eGYRla63lvcgxOAc8Mg9lsKYa1N8IiMEvG1Kw2W_NY"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-white bg-black hover:bg-gray-900"
              >
                <img 
                  src="https://cdn.poehali.dev/files/qr-logo.g__tzhK_.png" 
                  alt="MAX" 
                  className="w-5 h-5 object-contain"
                />
                <span className="text-sm font-medium">MAX</span>
              </a>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-wb-gray-600 uppercase tracking-wide">Документы</h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  onDocumentOpen('privacy');
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-wb-gray-700 hover:bg-wb-gray-50 border border-wb-gray-200"
              >
                <Icon name="Shield" size={18} />
                <span className="text-sm font-medium">Политика конфиденциальности</span>
              </button>
              <button
                onClick={() => {
                  onDocumentOpen('terms');
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-wb-gray-700 hover:bg-wb-gray-50 border border-wb-gray-200"
              >
                <Icon name="FileText" size={18} />
                <span className="text-sm font-medium">Правила пользования</span>
              </button>
              <button
                onClick={() => {
                  onDocumentOpen('security');
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-wb-gray-700 hover:bg-wb-gray-50 border border-wb-gray-200"
              >
                <Icon name="Lock" size={18} />
                <span className="text-sm font-medium">Защита информации</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;