import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { ImportantNumber, WorkScheduleItem, PvzItem, SystemMessage, HelpItem } from '@/components/admin/types';
import { getDefaultNumbers, getDefaultTransit, getDefaultHelp, getDefaultSchedule, getDefaultPvz } from '@/components/admin/defaultData';
import SystemMessagesTab from '@/components/admin/SystemMessagesTab';
import ImportantNumbersTab from '@/components/admin/ImportantNumbersTab';
import TransitTab from '@/components/admin/TransitTab';
import HelpTab from '@/components/admin/HelpTab';
import ScheduleTab from '@/components/admin/ScheduleTab';
import PvzTab from '@/components/admin/PvzTab';
import TicketsPlatform from '@/components/admin/TicketsPlatform';
import { getUnreadForAdmin, TICKETS_EVENT } from '@/lib/ticketService';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'numbers' | 'transit' | 'help' | 'schedule' | 'pvz' | 'messages' | 'tickets'>('tickets');
  const [ticketsUnread, setTicketsUnread] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const [importantNumbers, setImportantNumbers] = useState<ImportantNumber[]>([]);
  const [transitNumbers, setTransitNumbers] = useState<ImportantNumber[]>([]);
  const [helpItems, setHelpItems] = useState<HelpItem[]>([]);
  const [workSchedule, setWorkSchedule] = useState<WorkScheduleItem[]>([]);
  const [pvzItems, setPvzItems] = useState<PvzItem[]>([]);
  const [systemMessages, setSystemMessages] = useState<SystemMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState('');

  useEffect(() => {
    loadAllData();
    
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Подключение восстановлено!');
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('Работаем офлайн. Данные сохраняются локально.');
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    const syncUnread = () => setTicketsUnread(getUnreadForAdmin());
    syncUnread();
    window.addEventListener(TICKETS_EVENT, syncUnread);
    window.addEventListener('storage', syncUnread);
    const unreadTimer = setInterval(syncUnread, 3000);

    // Запрашиваем разрешение на уведомления, чтобы приходили новые тикеты
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener(TICKETS_EVENT, syncUnread);
      window.removeEventListener('storage', syncUnread);
      clearInterval(unreadTimer);
    };
  }, []);

  const loadAllData = () => {
    try {
      const savedContent = localStorage.getItem('homePageContent');
      if (savedContent) {
        const content = JSON.parse(savedContent);
        setImportantNumbers(content.importantNumbers || getDefaultNumbers());
        setTransitNumbers(content.transitNumbers || getDefaultTransit());
        setHelpItems(content.helpItems || getDefaultHelp());
        setWorkSchedule(content.workSchedule || getDefaultSchedule());
        setPvzItems(content.pvzItems || getDefaultPvz());
      } else {
        setImportantNumbers(getDefaultNumbers());
        setTransitNumbers(getDefaultTransit());
        setHelpItems(getDefaultHelp());
        setWorkSchedule(getDefaultSchedule());
        setPvzItems(getDefaultPvz());
      }
      
      const savedMessages = localStorage.getItem('systemMessages');
      if (savedMessages) {
        setSystemMessages(JSON.parse(savedMessages));
      }
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      toast.error('Ошибка при загрузке данных');
    }
  };

  const saveAllData = () => {
    try {
      const content = {
        importantNumbers,
        transitNumbers,
        helpItems,
        workSchedule,
        pvzItems
      };
      
      localStorage.setItem('homePageContent', JSON.stringify(content));
      window.dispatchEvent(new Event('storage'));
      
      toast.success('✅ Все данные успешно сохранены!', {
        description: 'Изменения отображаются на главной странице'
      });
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      toast.error('❌ Ошибка при сохранении');
    }
  };

  const addSystemMessage = () => {
    if (!newMessageText.trim()) {
      toast.error('Введите текст сообщения');
      return;
    }

    const newMessage: SystemMessage = {
      id: Date.now().toString(),
      text: newMessageText.trim(),
      timestamp: new Date().toISOString(),
      isFromAdmin: true
    };

    const updatedMessages = [newMessage, ...systemMessages];
    setSystemMessages(updatedMessages);
    localStorage.setItem('systemMessages', JSON.stringify(updatedMessages));
    window.dispatchEvent(new Event('storage'));
    
    setNewMessageText('');
    toast.success('✅ Сообщение опубликовано!', {
      description: 'Пользователи увидят его в чате с Линой'
    });
  };

  const deleteSystemMessage = (id: string) => {
    const updated = systemMessages.filter(m => m.id !== id);
    setSystemMessages(updated);
    localStorage.setItem('systemMessages', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    toast.success('Сообщение удалено');
  };

  const addItem = (type: string) => {
    if (type === 'numbers') {
      setImportantNumbers([...importantNumbers, { name: '', person: '', phone: '', icon: 'Phone' }]);
    } else if (type === 'transit') {
      setTransitNumbers([...transitNumbers, { name: '', person: '', phone: '', icon: 'Bus' }]);
    } else if (type === 'help') {
      setHelpItems([...helpItems, { title: '', description: '', contact: '', icon: 'Heart' }]);
    } else if (type === 'schedule') {
      setWorkSchedule([...workSchedule, { name: '', schedule: '', icon: 'Clock' }]);
    } else if (type === 'pvz') {
      setPvzItems([...pvzItems, { name: '', address: '', schedule: '', phone: '', hasFitting: false, photos: [] }]);
    }
  };

  const removeItem = (type: string, index: number) => {
    if (type === 'numbers') setImportantNumbers(importantNumbers.filter((_, i) => i !== index));
    else if (type === 'transit') setTransitNumbers(transitNumbers.filter((_, i) => i !== index));
    else if (type === 'help') setHelpItems(helpItems.filter((_, i) => i !== index));
    else if (type === 'schedule') setWorkSchedule(workSchedule.filter((_, i) => i !== index));
    else if (type === 'pvz') setPvzItems(pvzItems.filter((_, i) => i !== index));
  };

  const tabs = [
    { id: 'tickets', label: 'Тикеты', icon: 'LifeBuoy' },
    { id: 'messages', label: 'Системный чат', icon: 'MessageSquare' },
    { id: 'numbers', label: 'Важные номера', icon: 'Phone' },
    { id: 'transit', label: 'Транспорт', icon: 'Bus' },
    { id: 'help', label: 'Помощь', icon: 'Heart' },
    { id: 'schedule', label: 'Режим работы', icon: 'Clock' },
    { id: 'pvz', label: 'ПВЗ', icon: 'Package' }
  ];

  return (
    <div className="min-h-screen bg-wb-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-wb-purple shadow-lg">
                <Icon name="Settings" size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-wb-gray-900">
                  Админ-панель
                </h1>
                <p className="text-gray-600 mt-1 flex items-center gap-2">
                  <span>Управление контентом Горхон.Online</span>
                  {!isOnline && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
                      Офлайн
                    </span>
                  )}
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="gap-2 hover:bg-wb-purple/5 border-wb-gray-200 hover:border-wb-purple transition-all"
            >
              <Icon name="Home" size={18} />
              На главную
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative rounded-xl p-3 border transition-colors ${
                activeTab === tab.id
                  ? 'bg-wb-purple border-wb-purple text-white'
                  : 'bg-white border-wb-gray-200 text-wb-gray-700 hover:bg-wb-gray-50'
              }`}
            >
              {tab.id === 'tickets' && ticketsUnread > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {ticketsUnread}
                </span>
              )}
              <div className="flex flex-col items-center gap-1.5">
                <Icon name={tab.icon as any} size={22} />
                <span className="text-xs font-semibold text-center leading-tight">{tab.label}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="space-y-6">
          
          {activeTab === 'tickets' && <TicketsPlatform />}

          {activeTab === 'messages' && (
            <SystemMessagesTab
              systemMessages={systemMessages}
              newMessageText={newMessageText}
              setNewMessageText={setNewMessageText}
              addSystemMessage={addSystemMessage}
              deleteSystemMessage={deleteSystemMessage}
            />
          )}

          {activeTab === 'numbers' && (
            <ImportantNumbersTab
              importantNumbers={importantNumbers}
              setImportantNumbers={setImportantNumbers}
              addItem={addItem}
              removeItem={removeItem}
            />
          )}

          {activeTab === 'transit' && (
            <TransitTab
              transitNumbers={transitNumbers}
              setTransitNumbers={setTransitNumbers}
              addItem={addItem}
              removeItem={removeItem}
            />
          )}

          {activeTab === 'help' && (
            <HelpTab
              helpItems={helpItems}
              setHelpItems={setHelpItems}
              addItem={addItem}
              removeItem={removeItem}
            />
          )}

          {activeTab === 'schedule' && (
            <ScheduleTab
              workSchedule={workSchedule}
              setWorkSchedule={setWorkSchedule}
              addItem={addItem}
              removeItem={removeItem}
            />
          )}

          {activeTab === 'pvz' && (
            <PvzTab
              pvzItems={pvzItems}
              setPvzItems={setPvzItems}
              addItem={addItem}
              removeItem={removeItem}
            />
          )}

          {activeTab !== 'messages' && activeTab !== 'tickets' && (
            <div className="sticky bottom-4 z-10">
              <Button
                onClick={saveAllData}
                className="w-full py-6 text-lg font-bold bg-wb-purple hover:bg-wb-purple-dark shadow-xl transition-colors"
              >
                <Icon name="Save" size={24} className="mr-2" />
                💾 Сохранить все изменения
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;