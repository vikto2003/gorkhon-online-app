export interface HomeSectionNavItem {
  id: string;
  anchor: string;
  label: string;
  icon: string;
}

// Список разделов главной страницы для оглавления в десктопной версии.
// Порядок и id соответствуют секциям в Home.tsx (кроме 'chats' — переехал во вкладку «Чаты»).
export const homeSectionsNav: HomeSectionNavItem[] = [
  { id: 'importantNumbers', anchor: 'section-importantNumbers', label: 'Важные номера', icon: 'Phone' },
  { id: 'schedule', anchor: 'section-schedule', label: 'Расписание транспорта', icon: 'Bus' },
  { id: 'donation', anchor: 'section-donation', label: 'Сбор средств', icon: 'Heart' },
  { id: 'workSchedule', anchor: 'section-workSchedule', label: 'Режим работы', icon: 'Clock' },
  { id: 'weather', anchor: 'section-weather', label: 'Погода', icon: 'Cloud' },
  { id: 'pvz', anchor: 'section-pvz', label: 'ПВЗ и фото', icon: 'Package' },
  { id: 'actionButtons', anchor: 'section-actionButtons', label: 'Запись к врачу', icon: 'Stethoscope' },
];
