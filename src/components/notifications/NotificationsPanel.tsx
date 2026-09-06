import Icon from "@/components/ui/icon";

interface NotificationItem {
  id: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  title: string;
  body: string;
  time: string;
}

const notifications: NotificationItem[] = [
  {
    id: 'update',
    icon: 'Sparkles',
    iconColor: 'text-gorkhon-orange',
    iconBg: 'bg-gorkhon-orange/10',
    title: 'Доступно обновление!',
    body: 'Новая версия приложения готова к установке. Обновите, чтобы получить последние улучшения.',
    time: 'сейчас',
  },
  {
    id: 'route',
    icon: 'AlertTriangle',
    iconColor: 'text-orange-600',
    iconBg: 'bg-orange-100',
    title: 'Маршрут Заиграево → Горхон изменён',
    body: 'Автобус временно ходит 3 раза в неделю (ПН, СР, ПТ) вместо 5 раз. Планируйте поездку заранее.',
    time: 'вчера',
  },
];

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSupport: () => void;
  onUpdateClick: () => void;
}

// Отдельная вкладка «Уведомления», открывается по клику на колокольчик.
// Показывает системные уведомления и быстрый доступ к чату поддержки.
const NotificationsPanel = ({ isOpen, onClose, onOpenSupport, onUpdateClick }: NotificationsPanelProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-t-2xl md:rounded-2xl w-full md:w-[440px] h-[92vh] md:h-auto md:max-h-[80vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 0px)' }}
      >
        <div className="flex items-center justify-between p-4 border-b border-wb-gray-200 flex-shrink-0">
          <h3 className="font-semibold text-wb-gray-900 text-base flex items-center gap-2">
            <Icon name="Bell" size={20} className="text-wb-purple" />
            Уведомления
          </h3>
          <button onClick={onClose} className="text-wb-gray-500 hover:bg-wb-gray-100 p-2 rounded-lg transition-colors">
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={n.id === 'update' ? onUpdateClick : undefined}
              className="w-full flex items-start gap-3 p-4 text-left hover:bg-wb-gray-50 transition-colors border-b border-wb-gray-100"
            >
              <div className={`p-2.5 rounded-full ${n.iconBg} flex-shrink-0`}>
                <Icon name={n.icon as any} size={18} className={n.iconColor} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-sm text-wb-gray-900">{n.title}</p>
                  <span className="text-[11px] text-wb-gray-400 flex-shrink-0">{n.time}</span>
                </div>
                <p className="text-sm text-wb-gray-600 leading-relaxed mt-0.5">{n.body}</p>
              </div>
            </button>
          ))}

          {notifications.length === 0 && (
            <div className="p-10 text-center text-sm text-wb-gray-400">Нет новых уведомлений</div>
          )}
        </div>

        <div className="p-4 border-t border-wb-gray-200 flex-shrink-0">
          <button
            onClick={onOpenSupport}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-wb-purple hover:bg-wb-purple-dark text-white transition-colors"
          >
            <Icon name="Headphones" size={20} />
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold">Написать в поддержку</p>
              <p className="text-xs opacity-90">Ответим на вопросы и поможем 24/7</p>
            </div>
            <Icon name="ChevronRight" size={18} className="opacity-70" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;
