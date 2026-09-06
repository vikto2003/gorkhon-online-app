import Icon from "@/components/ui/icon";

export type BottomNavTab = 'main' | 'chats' | 'settings';

interface BottomNavProps {
  activeTab: BottomNavTab;
  onTabChange: (tab: BottomNavTab) => void;
  chatsBadge?: number;
}

const tabs: { id: BottomNavTab; label: string; icon: string }[] = [
  { id: 'main', label: 'Главное', icon: 'Home' },
  { id: 'chats', label: 'Чаты', icon: 'MessageCircle' },
  { id: 'settings', label: 'Настройки', icon: 'Settings' },
];

const BottomNav = ({ activeTab, onTabChange, chatsBadge = 0 }: BottomNavProps) => {
  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 0px)' }}
    >
      <div className="flex items-stretch max-w-2xl mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const showBadge = tab.id === 'chats' && chatsBadge > 0;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] active:bg-gray-50 transition-colors"
              aria-label={tab.label}
            >
              <div className="relative">
                <Icon
                  name={tab.icon as any}
                  size={24}
                  className={isActive ? 'text-wb-purple' : 'text-gray-400'}
                />
                {showBadge && (
                  <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {chatsBadge > 9 ? '9+' : chatsBadge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] font-medium ${isActive ? 'text-wb-purple' : 'text-gray-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;