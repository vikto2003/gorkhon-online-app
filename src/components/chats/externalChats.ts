export interface ExternalChat {
  name: string;
  platform: string;
  url: string;
  icon: string;
  color: string;
  avatar?: string;
  preview: string;
  time: string;
  unread?: number;
  muted?: boolean;
  pinned?: boolean;
}

export const externalChats: ExternalChat[] = [
  {
    name: "Горхон",
    platform: "MAX",
    url: "https://max.ru/join/3eGYRla63lvcgxOAc8Mg9lsKYa1N8IiMEvG1Kw2W_NY",
    icon: "Megaphone",
    color: "bg-emerald-600",
    avatar: "https://cdn.poehali.dev/projects/80b27c13-e76f-4c17-9cd3-0ca13d96fc7a/bucket/522061e8-09da-4caa-acc9-652640649a56.png",
    preview: "Ждали? Конечно! 💯 Гордимся, что можем сказать официально...",
    time: "29.08",
    pinned: true,
  },
  {
    name: "Заиграевская ЦРБ",
    platform: "Запись к врачу",
    url: "https://t.me/ZaigrCRB/8",
    icon: "Stethoscope",
    color: "bg-blue-600",
    preview: "Запись к врачу быстро и удобно",
    time: "",
  },
  {
    name: "Чат ПВЗ Wildberries/OZON",
    platform: "Telegram",
    url: "https://t.me/+dB_KdSKhVc43NmEy",
    icon: "Package",
    color: "bg-wb-purple",
    preview: "Вопросы по пунктам выдачи заказов",
    time: "",
  },
  {
    name: "Купи-продай Горхон",
    platform: "Telegram",
    url: "https://t.me/+gW1J_CEno-ZjZDhi",
    icon: "ShoppingBag",
    color: "bg-[#0088cc]",
    preview: "Продам сливу спелая, крыжовник крупный...",
    time: "12:11",
    muted: true,
  },
  {
    name: "Горхон ВКонтакте",
    platform: "ВКонтакте",
    url: "https://vk.com/gorhon_official",
    icon: "Users",
    color: "bg-[#0077FF]",
    preview: "Новые фото посёлка в группе",
    time: "вчера",
    muted: true,
  },
  {
    name: "Горхон Telegram",
    platform: "Telegram",
    url: "https://t.me/gorhon_official",
    icon: "Send",
    color: "bg-[#0088CC]",
    preview: "Подписывайтесь на новости посёлка",
    time: "вчера",
    muted: true,
  },
];