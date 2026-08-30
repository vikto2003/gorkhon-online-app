import Icon from "@/components/ui/icon";

interface ChatsPageProps {
  onSupportOpen: () => void;
}

const externalChats = [
  {
    name: "Новости Горхон",
    platform: "MAX",
    url: "https://max.ru/join/3eGYRla63lvcgxOAc8Mg9lsKYa1N8IiMEvG1Kw2W_NY",
    icon: "Megaphone",
    color: "bg-blue-500",
  },
  {
    name: "Купи-продай Горхон",
    platform: "Telegram",
    url: "https://t.me/+gW1J_CEno-ZjZDhi",
    icon: "ShoppingBag",
    color: "bg-[#0088cc]",
  },
  {
    name: "Горхон ВКонтакте",
    platform: "ВКонтакте",
    url: "https://vk.com/gorhon_official",
    icon: "Users",
    color: "bg-[#0077FF]",
  },
  {
    name: "Горхон Telegram",
    platform: "Telegram",
    url: "https://t.me/gorhon_official",
    icon: "Send",
    color: "bg-[#0088CC]",
  },
];

const ChatsPage = ({ onSupportOpen }: ChatsPageProps) => {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-wb-gray-900 px-1">Чаты</h1>

      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-wb-gray-600 uppercase tracking-wide px-1">Поддержка</h3>
        <button
          onClick={onSupportOpen}
          className="w-full flex items-center gap-3 p-3 md:p-4 rounded-xl text-left transition-colors bg-white border border-wb-gray-200 hover:bg-wb-gray-50"
        >
          <div className="p-2.5 rounded-full bg-wb-purple flex-shrink-0">
            <Icon name="Headphones" size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm md:text-base text-wb-gray-900 truncate">Агент поддержки</p>
            <p className="text-xs md:text-sm text-wb-gray-600 truncate mt-0.5">Ответим на вопросы и поможем 24/7</p>
          </div>
          <Icon name="ChevronRight" size={18} className="text-wb-gray-400 flex-shrink-0" />
        </button>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-wb-gray-600 uppercase tracking-wide px-1">Чаты посёлка</h3>
        <div className="space-y-2">
          {externalChats.map((chat) => (
            <a
              key={chat.url}
              href={chat.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 md:p-4 rounded-xl bg-white border border-wb-gray-200 hover:bg-wb-gray-50 transition-colors"
            >
              <div className={`p-2.5 rounded-full ${chat.color} flex-shrink-0`}>
                <Icon name={chat.icon as any} size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm md:text-base text-wb-gray-900 truncate">{chat.name}</p>
                <p className="text-xs md:text-sm text-wb-gray-600 truncate mt-0.5">{chat.platform}</p>
              </div>
              <Icon name="ExternalLink" size={18} className="text-wb-gray-400 flex-shrink-0" />
            </a>
          ))}
        </div>
      </div>

      <div className="p-3 md:p-4 rounded-xl bg-wb-purple/5 border border-wb-purple/20">
        <div className="flex items-start gap-2">
          <Icon name="Info" size={16} className="text-wb-purple flex-shrink-0 mt-0.5" />
          <p className="text-xs md:text-sm text-wb-gray-700 leading-relaxed">
            Для добавления чата на витрину платформы обратитесь по электронной почте:{" "}
            <a href="mailto:admin@gorhon.ru" className="text-wb-purple hover:text-wb-purple-dark font-medium underline">
              admin@gorhon.ru
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatsPage;
