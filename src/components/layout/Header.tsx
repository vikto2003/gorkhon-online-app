import NotificationBell from "./NotificationBell";

interface HeaderProps {
  currentVersion: string;
  onUpdateClick: () => void;
  onNotificationsClick: () => void;
}

// Мобильная шапка. На десктопе логотип и настройки переехали
// в узкую боковую панель (DesktopRail) — как в Telegram Desktop.
const Header = ({ currentVersion, onUpdateClick, onNotificationsClick }: HeaderProps) => {
  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-50">
      <div className="shadow-sm backdrop-blur-sm bg-white border-b border-gray-200 rounded-b-2xl" style={{paddingTop: 'max(env(safe-area-inset-top, 0px), 0px)'}}>
        <div className="px-4 py-3 flex items-center justify-center w-full relative">
          <img
            src="https://cdn.poehali.dev/projects/80b27c13-e76f-4c17-9cd3-0ca13d96fc7a/bucket/522061e8-09da-4caa-acc9-652640649a56.png"
            alt="Горхон.Online"
            className="h-8 w-auto object-contain"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            style={{ WebkitUserSelect: 'none', userSelect: 'none', WebkitTouchCallout: 'none' }}
          />
          <div className="absolute right-4 flex items-center gap-1">
            <NotificationBell currentVersion={currentVersion} onUpdateClick={onUpdateClick} onNotificationsClick={onNotificationsClick} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;