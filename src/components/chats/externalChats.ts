export interface ExternalChat {
  name: string;
  platform: string;
  url: string;
  icon: string;
  color: string;
}

export const externalChats: ExternalChat[] = [
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
