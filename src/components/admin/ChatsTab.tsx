import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import { ChatItem } from './types';

interface ChatsTabProps {
  chats: ChatItem[];
  setChats: (chats: ChatItem[]) => void;
}

const ChatsTab = ({ chats, setChats }: ChatsTabProps) => {
  return (
    <Card className="border-2 border-cyan-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50">
        <CardTitle className="flex items-center gap-3 text-cyan-700">
          <Icon name="MessageCircle" size={24} />
          Чаты на главной странице
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        {chats.map((chat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-4 border-2 border-gray-100 hover:border-cyan-300 transition-all space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Название чата"
                value={chat.name}
                onChange={(e) => {
                  const updated = [...chats];
                  updated[idx] = { ...updated[idx], name: e.target.value };
                  setChats(updated);
                }}
              />
              <Input
                placeholder="Платформа (Telegram, MAX, ВКонтакте...)"
                value={chat.platform}
                onChange={(e) => {
                  const updated = [...chats];
                  updated[idx] = { ...updated[idx], platform: e.target.value };
                  setChats(updated);
                }}
              />
            </div>
            <Input
              placeholder="Ссылка на чат"
              value={chat.url}
              onChange={(e) => {
                const updated = [...chats];
                updated[idx] = { ...updated[idx], url: e.target.value };
                setChats(updated);
              }}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Иконка (название из Lucide, напр. Send)"
                value={chat.icon}
                onChange={(e) => {
                  const updated = [...chats];
                  updated[idx] = { ...updated[idx], icon: e.target.value };
                  setChats(updated);
                }}
              />
              <Input
                placeholder="Цвет фона (напр. bg-blue-500)"
                value={chat.color}
                onChange={(e) => {
                  const updated = [...chats];
                  updated[idx] = { ...updated[idx], color: e.target.value };
                  setChats(updated);
                }}
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => setChats(chats.filter((_, i) => i !== idx))}
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Icon name="Trash2" size={16} className="mr-1" />
                Удалить
              </Button>
            </div>
          </div>
        ))}
        <Button
          onClick={() => setChats([...chats, { name: '', platform: '', url: '', icon: 'MessageCircle', color: 'bg-wb-purple' }])}
          variant="outline"
          className="w-full border-2 border-dashed border-cyan-300 hover:border-cyan-500 hover:bg-cyan-50"
        >
          <Icon name="Plus" size={18} className="mr-2" />
          Добавить чат
        </Button>
      </CardContent>
    </Card>
  );
};

export default ChatsTab;
