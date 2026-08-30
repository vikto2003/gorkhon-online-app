import Icon from "@/components/ui/icon";
import NotificationBell from "./NotificationBell";

interface HeaderProps {
  currentVersion: string;
  onUpdateClick: () => void;
  onSearchClick: () => void;
}

const Header = ({ currentVersion, onUpdateClick, onSearchClick }: HeaderProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="shadow-sm backdrop-blur-sm bg-white border-b border-gray-200 rounded-b-2xl" style={{paddingTop: 'max(env(safe-area-inset-top, 0px), 0px)'}}>
        <div className="px-4 py-3 md:py-3.5 flex items-center justify-between">
          <div className="md:hidden flex items-center justify-center w-full relative">
            <img
              src="https://cdn.poehali.dev/projects/80b27c13-e76f-4c17-9cd3-0ca13d96fc7a/bucket/522061e8-09da-4caa-acc9-652640649a56.png"
              alt="Горхон.Online"
              className="h-8 w-auto object-contain"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              style={{ WebkitUserSelect: 'none', userSelect: 'none', WebkitTouchCallout: 'none' }}
            />
            <div className="absolute left-0 flex items-center">
              <button
                onClick={onSearchClick}
                className="p-2.5 -m-1 text-wb-gray-600 hover:bg-gray-100 active:bg-gray-100 rounded-xl transition-colors"
                aria-label="Поиск по платформе"
              >
                <Icon name="Search" size={22} />
              </button>
            </div>
            <div className="absolute right-0 flex items-center gap-1">
              <NotificationBell currentVersion={currentVersion} onUpdateClick={onUpdateClick} />
            </div>
          </div>
        
          <div className="hidden md:flex items-center justify-between max-w-4xl mx-auto w-full">
            <img
              src="https://cdn.poehali.dev/projects/80b27c13-e76f-4c17-9cd3-0ca13d96fc7a/bucket/522061e8-09da-4caa-acc9-652640649a56.png"
              alt="Горхон.Online"
              className="h-9 w-auto object-contain"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              style={{ WebkitUserSelect: 'none', userSelect: 'none', WebkitTouchCallout: 'none' }}
            />
            <div className="flex items-center gap-2">
              <button
                onClick={onSearchClick}
                className="p-2 text-wb-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Поиск по платформе"
              >
                <Icon name="Search" size={20} />
              </button>
              <NotificationBell currentVersion={currentVersion} onUpdateClick={onUpdateClick} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
