export interface SearchItem {
  id: string;
  title: string;
  subtitle?: string;
  section: string;
  icon: string;
  action: { type: 'tab'; tab: 'main' | 'settings' } | { type: 'tel'; phone: string } | { type: 'scroll'; anchor: string };
}

export const getSearchIndex = (): SearchItem[] => {
  const items: SearchItem[] = [
    { id: 'schedule', title: 'Расписание транспорта', subtitle: 'Автобусы и электрички', section: 'Главное', icon: 'Bus', action: { type: 'scroll', anchor: 'section-schedule' } },
    { id: 'importantNumbers', title: 'Важные номера', subtitle: 'Контакты служб и организаций', section: 'Главное', icon: 'Phone', action: { type: 'scroll', anchor: 'section-importantNumbers' } },
    { id: 'chats', title: 'Чаты', subtitle: 'Мессенджеры и группы', section: 'Главное', icon: 'MessageCircle', action: { type: 'scroll', anchor: 'section-chats' } },
    { id: 'donation', title: 'Сбор средств', subtitle: 'Благотворительные сборы', section: 'Главное', icon: 'Heart', action: { type: 'scroll', anchor: 'section-donation' } },
    { id: 'workSchedule', title: 'Режим работы', subtitle: 'График работы организаций', section: 'Главное', icon: 'Clock', action: { type: 'scroll', anchor: 'section-workSchedule' } },
    { id: 'weather', title: 'Погода', subtitle: 'Прогноз погоды', section: 'Главное', icon: 'Cloud', action: { type: 'scroll', anchor: 'section-weather' } },
    { id: 'pvz', title: 'ПВЗ и фото', subtitle: 'Пункты выдачи заказов и фотогалерея', section: 'Главное', icon: 'Package', action: { type: 'scroll', anchor: 'section-pvz' } },
    { id: 'actionButtons', title: 'Запись к врачу', subtitle: 'Быстрые действия', section: 'Главное', icon: 'Stethoscope', action: { type: 'scroll', anchor: 'section-actionButtons' } },
    { id: 'support', title: 'Агент поддержки', subtitle: 'Ответы на вопросы и помощь 24/7', section: 'Настройки', icon: 'Headphones', action: { type: 'tab', tab: 'settings' } },
    { id: 'faq', title: 'Частые вопросы', subtitle: 'Ответы на популярные вопросы', section: 'Настройки', icon: 'HelpCircle', action: { type: 'tab', tab: 'settings' } },
    { id: 'privacy', title: 'Политика конфиденциальности', section: 'Настройки', icon: 'Shield', action: { type: 'tab', tab: 'settings' } },
    { id: 'terms', title: 'Правила пользования', section: 'Настройки', icon: 'FileText', action: { type: 'tab', tab: 'settings' } },
    { id: 'security', title: 'Защита информации', subtitle: 'Рекомендательные технологии', section: 'Настройки', icon: 'Lock', action: { type: 'tab', tab: 'settings' } },
    { id: 'vk', title: 'ВКонтакте', subtitle: 'Наша группа', section: 'Настройки', icon: 'ExternalLink', action: { type: 'tab', tab: 'settings' } },
    { id: 'telegram', title: 'Telegram', subtitle: 'Наш канал', section: 'Настройки', icon: 'ExternalLink', action: { type: 'tab', tab: 'settings' } },
    { id: 'max', title: 'MAX', subtitle: 'Наш чат', section: 'Настройки', icon: 'ExternalLink', action: { type: 'tab', tab: 'settings' } },
  ];

  try {
    const savedContent = localStorage.getItem('homePageContent');
    if (savedContent) {
      const content = JSON.parse(savedContent);
      (content.importantNumbers || []).forEach((c: { name: string; person: string; phone: string; icon: string }, idx: number) => {
        items.push({
          id: `contact-${idx}`,
          title: c.name,
          subtitle: c.person,
          section: 'Важные номера',
          icon: c.icon || 'Phone',
          action: { type: 'tel', phone: c.phone },
        });
      });
    }
  } catch {
    // игнорируем ошибки парсинга
  }

  return items;
};
