import Icon from "@/components/ui/icon";

export type BottomNavTab = 'main' | 'settings';

interface BottomNavProps {
  activeTab: BottomNavTab;
  onTabChange: (tab: BottomNavTab) => void;
}

const tabs: { id: BottomNavTab; label: string; icon: string }[] = [
  { id: 'main', label: 'Главное', icon: 'Home' },
  { id: 'settings', label: 'Настройки', icon: 'Settings' },
];

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 0px)' }}
    >
      <div className="flex items-stretch max-w-2xl mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] active:bg-gray-50 transition-colors"
              aria-label={tab.label}
            >
              <Icon
                name={tab.icon}
                size={24}
                className={isActive ? 'text-wb-purple' : 'text-gray-400'}
              />
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
