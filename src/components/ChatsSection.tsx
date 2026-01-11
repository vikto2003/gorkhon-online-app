import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

const ChatsSection = () => {
  const chats = [
    {
      name: "Новости Горхон",
      platform: "MAX",
      logo: "https://max.ru/favicon.ico",
      url: "https://max.ru/join/3eGYRla63lvcgxOAc8Mg9lsKYa1N8IiMEvG1Kw2W_NY",
      icon: "Megaphone",
      color: "bg-blue-500"
    },
    {
      name: "Купи-продай Горхон",
      platform: "Telegram",
      logo: "https://telegram.org/favicon.ico",
      url: "https://t.me/+gW1J_CEno-ZjZDhi",
      icon: "ShoppingBag",
      color: "bg-[#0088cc]"
    }
  ];

  return (
    <Card className="rounded-xl bg-white border border-wb-gray-200 shadow-sm transition-all duration-200">
      <CardHeader className="p-4 md:p-5 border-b border-wb-gray-100">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-wb-purple/10 flex-shrink-0">
            <Icon name="MessageCircle" size={20} className="text-wb-purple" />
          </div>
          <div className="min-w-0">
            <span className="text-lg md:text-xl font-semibold text-wb-gray-900">Чаты</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 md:p-5 space-y-2">
        {chats.map((chat, index) => (
          <a
            key={index}
            href={chat.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-3 md:p-4 rounded-lg bg-wb-gray-50 hover:bg-wb-gray-100 active:bg-wb-gray-100 transition-all duration-150 border border-transparent hover:border-wb-gray-200"
          >
            <div className="flex items-center gap-3 md:gap-4 w-full">
              <div className="flex items-center gap-2.5 md:gap-3 flex-1 min-w-0 overflow-hidden">
                <div className={`p-2 rounded-lg ${chat.color} flex-shrink-0`}>
                  <Icon name={chat.icon} size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="font-semibold text-sm md:text-base text-wb-gray-900 truncate">{chat.name}</p>
                  <p className="text-xs md:text-sm text-wb-gray-600 truncate mt-0.5">{chat.platform}</p>
                </div>
              </div>
              <div className="flex-shrink-0 p-2 rounded-lg bg-white">
                <Icon name="ExternalLink" size={18} className="text-wb-gray-600" />
              </div>
            </div>
          </a>
        ))}
      </CardContent>
    </Card>
  );
};

export default ChatsSection;
