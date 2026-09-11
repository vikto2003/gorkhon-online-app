import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { getDefaultChats } from "@/components/admin/defaultData";
import type { ChatItem } from "@/components/admin/types";

const ChatsSection = () => {
  const [chats, setChats] = useState<ChatItem[]>(getDefaultChats());

  const loadData = useCallback(() => {
    try {
      const savedContent = localStorage.getItem('homePageContent');
      if (savedContent) {
        const content = JSON.parse(savedContent);
        if (content.chats && content.chats.length > 0) {
          setChats(content.chats);
          return;
        }
      }
      setChats(getDefaultChats());
    } catch {
      setChats(getDefaultChats());
    }
  }, []);

  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, [loadData]);

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
                  <Icon name={chat.icon as any} size={18} className="text-white" />
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

        <div className="mt-4 p-3 md:p-4 rounded-lg bg-wb-purple/5 border border-wb-purple/20">
          <div className="flex items-start gap-2">
            <Icon name="Info" size={16} className="text-wb-purple flex-shrink-0 mt-0.5" />
            <p className="text-xs md:text-sm text-wb-gray-700 leading-relaxed">
              Для добавления чата на витрину платформы обратитесь по электронной почте:{" "}
              <a 
                href="mailto:admin@gorhon.ru" 
                className="text-wb-purple hover:text-wb-purple-dark font-medium underline"
              >
                admin@gorhon.ru
              </a>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatsSection;
