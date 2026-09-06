import ChatsMobile from "./ChatsMobile";
import ChatsDesktop from "./ChatsDesktop";

interface ChatsPageProps {
  onSupportOpen: () => void;
}

// Переключение между мобильной (список карточек) и десктопной
// (список + переписка, как в Telegram Desktop) версией через CSS,
// без JS-детекта — избегаем мигания при гидратации.
const ChatsPage = ({ onSupportOpen }: ChatsPageProps) => {
  return (
    <>
      <div className="md:hidden">
        <ChatsMobile onSupportOpen={onSupportOpen} />
      </div>
      <div className="hidden md:block h-full">
        <ChatsDesktop />
      </div>
    </>
  );
};

export default ChatsPage;
