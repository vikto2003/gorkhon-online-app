import Icon from "@/components/ui/icon";
import type { BottomNavTab } from "./BottomNav";

interface DesktopRailProps {
  activeTab: BottomNavTab;
  onTabChange: (tab: BottomNavTab) => void;
  onSearchClick: () => void;
  chatsBadge?: number;
}

const railItems: { id: BottomNavTab; label: string; icon: string }[] = [
  { id: 'main', label: 'Главное', icon: 'Home' },
  { id: 'chats', label: 'Чаты', icon: 'MessageCircle' },
];

// Узкая иконочная колонка слева, как в Telegram Desktop.
// Логотип сверху, разделы по центру, поиск и настройки снизу.
const DesktopRail = ({ activeTab, onTabChange, onSearchClick, chatsBadge = 0 }: DesktopRailProps) => {
  return (
    <div
      className="hidden md:flex flex-col items-center w-[76px] flex-shrink-0 bg-white border-r border-wb-gray-200 py-3"
      style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 12px)' }}
    >
      <button
        onClick={() => onTabChange('main')}
        className="w-11 h-11 rounded-2xl bg-wb-purple flex items-center justify-center mb-4 flex-shrink-0 hover:bg-wb-purple-dark transition-colors"
        aria-label="НАШ chat"
      >
        <Icon name="MessageSquare" size={22} className="text-white" />
      </button>

      <div className="flex flex-col items-center gap-1 flex-1">
        {railItems.map((item) => {
          const isActive = activeTab === item.id;
          const showBadge = item.id === 'chats' && chatsBadge > 0;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`relative w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive ? 'bg-wb-purple/10 text-wb-purple' : 'text-wb-gray-500 hover:bg-wb-gray-100'
              }`}
              aria-label={item.label}
            >
              <div className="relative">
                <Icon name={item.icon as any} size={22} />
                {showBadge && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {chatsBadge > 9 ? '9+' : chatsBadge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-1">
        <button
          onClick={onSearchClick}
          className="w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-0.5 text-wb-gray-500 hover:bg-wb-gray-100 transition-colors"
          aria-label="Поиск"
        >
          <Icon name="Search" size={22} />
          <span className="text-[10px] font-medium leading-none">Поиск</span>
        </button>
        <button
          onClick={() => onTabChange('settings')}
          className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-colors ${
            activeTab === 'settings' ? 'bg-wb-purple/10 text-wb-purple' : 'text-wb-gray-500 hover:bg-wb-gray-100'
          }`}
          aria-label="Настройки"
        >
          <Icon name="Settings" size={22} />
          <span className="text-[10px] font-medium leading-none">Настройки</span>
        </button>
      </div>
    </div>
  );
};

export default DesktopRail;
