import Icon from "@/components/ui/icon";

interface HeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

const Header = ({ onMenuClick, isSidebarOpen }: HeaderProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="shadow-sm backdrop-blur-sm bg-white border-b border-gray-200 rounded-b-2xl" style={{paddingTop: 'max(env(safe-area-inset-top, 0px), 0px)'}}>
        <div className="px-4 py-3 md:py-3.5 flex items-center justify-between">
          <div className="md:hidden flex items-center justify-center w-full relative">
            <span className="text-xl font-bold text-wb-gray-900">Горхон<span className="text-wb-purple">.Online</span></span>
            <button 
              onClick={onMenuClick}
              className="absolute right-0 text-wb-purple p-3 -m-2 active:bg-gray-100 rounded-xl transition-all duration-200 active:scale-95 min-w-[48px] min-h-[48px] flex items-center justify-center"
              aria-label="Открыть меню"
            >
              <Icon name="Menu" size={26} />
            </button>
          </div>
        
          <div className="hidden md:flex items-center justify-between max-w-4xl mx-auto w-full">
            <span className="text-2xl font-bold text-wb-gray-900">Горхон<span className="text-wb-purple">.Online</span></span>
            <button 
              onClick={onMenuClick}
              className="text-wb-purple p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Icon name="Menu" size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;