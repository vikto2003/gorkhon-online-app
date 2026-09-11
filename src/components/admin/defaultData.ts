import { ImportantNumber, WorkScheduleItem, PvzItem, HelpItem, TransportScheduleData, ChatItem, DoctorButton } from './types';

export const getDefaultNumbers = (): ImportantNumber[] => [
  { name: "Участковый", person: "Бадмаев Баир Баторович", phone: "+7 (924) 754-32-18", icon: "Shield" },
  { name: "Экстренные службы", person: "Полиция, скорая, пожарная", phone: "112", icon: "Ambulance" },
  { name: "Диспетчер РЭС", person: "Электроснабжение 24/7", phone: "8-800-100-75-40", icon: "Zap" },
  { name: "МФЦ Заиграево", person: "Многофункциональный центр", phone: "+7 (301-36) 4-15-15", icon: "Building" },
  { name: "Почта Горхон", person: "Почтовое отделение", phone: "+7 (301-36) 9-42-31", icon: "Mail" },
  { name: "Регистратура поликлиники", person: "Заиграево", phone: "+7 (924) 555-90-03", icon: "Stethoscope" },
  { name: "Соц.защита Заиграево", person: "Социальная защита населения", phone: "+7 (301-36) 4-12-20", icon: "Heart" },
  { name: "Нотариус Заиграево", person: "Нотариальные услуги", phone: "+7 (301-36) 4-16-14", icon: "FileText" },
  { name: "Судебные приставы", person: "Заиграевский район", phone: "8 (301-36) 4-10-10", icon: "Scale" },
  { name: "Вакуумная машина", person: "Кондаков К.Ю., Горхон", phone: "+7 (983) 453-99-02", icon: "Truck" },
  { name: "Миграционная служба", person: "ГАИ Заиграево", phone: "8 (301-36) 4-15-70", icon: "Car" },
  { name: "ЕДДС района", person: "Диспетчерская служба 24/7", phone: "+7 (301-36) 4-51-03", icon: "AlertCircle" }
];

export const getDefaultTransit = (): ImportantNumber[] => [
  { name: "Диспетчер Город", person: "Заиграевский транзит", phone: "8-983-420-04-03", icon: "Bus" },
  { name: "Диспетчер Заиграево", person: "Заиграевский транзит", phone: "8-983-420-04-90", icon: "Bus" }
];

export const getDefaultHelp = (): HelpItem[] => [
  {
    title: "ФОНД поселка",
    description: "Ирина Н.П - Обязательно пишем 'ФОНД поселка'",
    contact: "408 178 109 091 606 626 11",
    icon: "Home"
  },
  {
    title: "Помощь церкви ⛪️",
    description: "Голофаева В. - Поддержка храма",
    contact: "89024562839",
    icon: "Heart"
  },
  {
    title: "Помощь бойцам 🪖",
    description: "Олеся Николаевна Н. - В теме: 'Помощь Бойцам'",
    contact: "89246210100",
    icon: "Shield"
  }
];

export const getDefaultSchedule = (): WorkScheduleItem[] => [
  { name: "Почта", schedule: "ПН, СР, ЧТ, ПТ: 9-17ч, СБ: 9-16ч. Обед: 13-14ч. ВТ, ВС - выходные", icon: "Mail" },
  { name: "Сбербанк", schedule: "ВТ, ПТ: 9-17ч. Обед: 12:30-13:30. ПН, СР, ЧТ, СБ, ВС - выходные", icon: "CreditCard" },
  { name: "МУП ЖКХ", schedule: "ПН-ПТ: 8-16ч. Обед: 12-13ч", icon: "Wrench" }
];

export const getDefaultPvz = (): PvzItem[] => [
  {
    name: "Wildberries",
    address: "пос. Лесозаводской, ул. Трудовая, 12",
    schedule: "Ежедневно: 10:00-20:00",
    phone: "",
    hasFitting: true,
    fittingCount: "2 шт.",
    note: "Пункт выдачи заказов находится в центре посёлка Лесозаводской, напротив школы. Удобная парковка. Будем рады видеть Вас в нашем ПВЗ!",
    chatLink: "https://t.me/+dB_KdSKhVc43NmEy",
    icon: "Package",
    logoUrl: "https://cdn.poehali.dev/files/38960a87-147c-4cc0-b90c-f662509e11d0.jpg",
    photos: [
      { url: "https://cdn.poehali.dev/files/effd940b-46bf-46ab-b102-56fc7574bce1.png", caption: "Вход в ПВЗ Wildberries" },
      { url: "https://cdn.poehali.dev/files/db11a90a-322e-4e28-acdb-1230afb19cf1.png", caption: "Интерьер ПВЗ Wildberries" },
      { url: "https://cdn.poehali.dev/files/dd085655-24de-4ab0-8877-256127c92015.png", caption: "Зона обслуживания ПВЗ Wildberries" },
      { url: "https://cdn.poehali.dev/files/93fc597d-3650-43d1-ad6c-7ce489b8e9c8.png", caption: "Примерочные кабины ПВЗ Wildberries" }
    ]
  },
  {
    name: "OZON",
    address: "пос. Лесозаводской, ул. Трудовая, 12",
    schedule: "Ежедневно: 10:00-20:00",
    phone: "",
    hasFitting: true,
    fittingCount: "2 шт.",
    note: "Пункт выдачи заказов находится напротив школы, рядом со зданием бывшей амбулатории, ориентир — вывеска Ozon. До встречи на Ozon!",
    chatLink: "https://t.me/+dB_KdSKhVc43NmEy",
    icon: "Package",
    logoUrl: "https://cdn.poehali.dev/files/32eb6963-076a-4663-ae00-1f8c03ea5d9b.jpg",
    photos: [
      { url: "https://cdn.poehali.dev/files/4cb01698-d8de-4264-b9bc-e863b3667eb4.jpg", caption: "Фасад здания с ПВЗ OZON" },
      { url: "https://cdn.poehali.dev/files/528564ea-ccc2-46de-be3b-2faec284f4ea.jpg", caption: "Рабочее место ПВЗ OZON" },
      { url: "https://cdn.poehali.dev/files/25a0c47e-7995-4c0b-a44e-440b27806401.jpg", caption: "Примерочные кабины ПВЗ OZON" }
    ]
  },
  {
    name: "OZON",
    address: "посёлок Горхон, ул. Железнодорожная, 31/2",
    schedule: "Ежедневно: 10:00 – 19:00",
    phone: "",
    hasFitting: false,
    note: "Пос. Горхон, ул. Железнодорожная, 31/2, продуктовый магазин «Татьяна», ориентир — вывеска Ozon. До встречи на Ozon!",
    icon: "Package",
    logoUrl: "https://cdn.poehali.dev/files/32eb6963-076a-4663-ae00-1f8c03ea5d9b.jpg",
    photos: [
      { url: "https://cdn.poehali.dev/files/69129961-1abb-4f9d-add3-302072129183.png", caption: "ПВЗ OZON, посёлок Горхон, ул. Железнодорожная, 31/2. Автор: Команда Горхон" }
    ]
  },
  {
    name: "Wildberries",
    address: "п. Горхон, ул. Железнодорожная, д. 15",
    schedule: "Пн, Ср-Пт: 09:00-17:00 (перерыв 13:00-14:00), Сб: 09:00-16:00 (перерыв 13:00-14:00), Вт, Вс: выходной",
    phone: "",
    hasFitting: false,
    note: "ПВЗ находится в отделении почты 671333",
    icon: "Package",
    logoUrl: "https://cdn.poehali.dev/files/38960a87-147c-4cc0-b90c-f662509e11d0.jpg",
    photos: [
      { url: "https://cdn.poehali.dev/files/aec305dc-bf96-4997-83aa-fdb9be3bfd4c.jpg", caption: "ПВЗ Wildberries, ул. Железнодорожная, 15" }
    ]
  }
];

export const getDefaultChats = (): ChatItem[] => [
  {
    name: "Новости Горхон",
    platform: "MAX",
    url: "https://max.ru/join/3eGYRla63lvcgxOAc8Mg9lsKYa1N8IiMEvG1Kw2W_NY",
    icon: "Megaphone",
    color: "bg-blue-500"
  },
  {
    name: "Купи-продай Горхон",
    platform: "Telegram",
    url: "https://t.me/+gW1J_CEno-ZjZDhi",
    icon: "ShoppingBag",
    color: "bg-[#0088cc]"
  }
];

export const getDefaultDoctorButton = (): DoctorButton => ({
  title: "Запись к врачу",
  subtitle: "Чат с Заиграевской ЦРБ",
  note: "Быстро и удобно",
  buttonText: "Записаться",
  url: "https://t.me/ZaigrCRB/8"
});

export const getDefaultTransportSchedule = (): TransportScheduleData => ({
  regular: [
    {
      type: "🚌 Автобус",
      routes: [
        { route: "Горхон → УУ", time: "7:00 (ПН-ПТ)", price: "500₽" },
        { route: "Горхон → УУ", time: "8:00 (СБ-ВС, 16:30 ВС студ.)", price: "500₽" },
        { route: "Горхон → Заиграево", time: "7:00, 14:15 (ПН-ПТ)", price: "290₽" },
        { route: "Заиграево → Горхон", time: "13:00, вечером городской", price: "290₽" }
      ]
    },
    {
      type: "🚞 Электричка",
      routes: [
        { route: "Горхон → УУ", time: "05:32 (ПН)", price: "296₽" },
        { route: "Горхон → УУ", time: "09:27 (СБ)", price: "296₽" },
        { route: "УУ → Горхон", time: "17:40 (ПТ)", price: "296₽" },
        { route: "УУ → Горхон", time: "08:35 (ВС)", price: "296₽" }
      ]
    }
  ],
  temporary: [
    {
      type: "🚌 Автобус (временное расписание)",
      routes: [
        { route: "Горхон → УУ", time: "7:00 (ПН-ПТ)", price: "500₽" },
        { route: "Горхон → УУ", time: "8:00 (СБ-ВС, 16:30 ВС студ.)", price: "500₽" },
        { route: "Горхон → Заиграево", time: "Городской по расписанию", price: "290₽" },
        { route: "Заиграево → Горхон", time: "13:00 (только ПН, СР, ПТ)", price: "290₽" }
      ]
    },
    {
      type: "🚞 Электричка",
      routes: [
        { route: "Горхон → УУ", time: "05:32 (ПН)", price: "296₽" },
        { route: "Горхон → УУ", time: "09:27 (СБ)", price: "296₽" },
        { route: "УУ → Горхон", time: "17:40 (ПТ)", price: "296₽" },
        { route: "УУ → Горхон", time: "08:35 (ВС)", price: "296₽" }
      ]
    }
  ],
  temporaryNoticeTitle: "⚠️ Временные изменения",
  temporaryNoticeText: "Маршрут Заиграево → Горхон временно сократили количество рейсов. Вместо 5 раз в неделю, будет ходить 3 раза в неделю (понедельник, среда, пятница). Не забудьте, кто планирует поездку!"
});