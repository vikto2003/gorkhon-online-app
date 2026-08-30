import NotificationBell from "./NotificationBell";

interface HeaderProps {
  currentVersion: string;
  onUpdateClick: () => void;
}

const Header = ({ currentVersion, onUpdateClick }: HeaderProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="shadow-sm backdrop-blur-sm bg-white border-b border-gray-200 rounded-b-2xl" style={{paddingTop: 'max(env(safe-area-inset-top, 0px), 0px)'}}>
        <div className="px-4 py-3 md:py-3.5 flex items-center justify-between">
          <div className="md:hidden flex items-center justify-center w-full relative">
            <span className="text-xl font-bold text-wb-gray-900">Горхон<span className="text-wb-purple">.Online</span></span>
            <div className="absolute right-0 flex items-center gap-1">
              <NotificationBell currentVersion={currentVersion} onUpdateClick={onUpdateClick} />
            </div>
          </div>
        
          <div className="hidden md:flex items-center justify-between max-w-4xl mx-auto w-full">
            <span className="text-2xl font-bold text-wb-gray-900">Горхон<span className="text-wb-purple">.Online</span></span>
            <div className="flex items-center gap-2">
              <NotificationBell currentVersion={currentVersion} onUpdateClick={onUpdateClick} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
