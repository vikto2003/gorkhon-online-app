import Icon from "@/components/ui/icon";
import { useState } from "react";

interface FAQProps {
  onClose: () => void;
}

interface FAQItem {
  question: string;
  answer: string;
  icon: string;
}

const FAQ = ({ onClose }: FAQProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems: FAQItem[] = [
    {
      question: "Что такое Горхон.Online?",
      answer: "Горхон.Online — это информационный портал поселка Горхон. Здесь вы найдете расписание транспорта, важные контакты служб, новости и сможете получить помощь через нашего ИИ-ассистента Лину.",
      icon: "Info"
    },
    {
      question: "Как работает ИИ-помощник Лина?",
      answer: "Лина — это виртуальная помощница с искусственным интеллектом. Она может ответить на вопросы о поселке, подсказать контакты служб, помочь с расписанием транспорта и решить технические проблемы. Просто напишите ей вопрос в чате!",
      icon: "Bot"
    },
    {
      question: "Где найти расписание автобусов?",
      answer: "Расписание автобусов находится на главной странице в разделе 'Расписание транспорта'. Там указаны все рейсы, время отправления и маршруты. Также можете спросить у Лины!",
      icon: "Bus"
    },
    {
      question: "Как связаться со службами поселка?",
      answer: "Все контакты служб находятся в разделе 'Важные контакты' на главной странице. Там указаны номера телефонов администрации, медпункта, МЧС, полиции и других важных служб.",
      icon: "Phone"
    },
    {
      question: "Работает ли приложение без интернета?",
      answer: "Да! Горхон.Online работает в режиме PWA (Progressive Web App). После первого открытия основная информация сохраняется и доступна офлайн. Вы сможете посмотреть расписание и контакты даже без интернета.",
      icon: "Wifi"
    },
    {
      question: "Как установить приложение на телефон?",
      answer: "На Android: откройте сайт в Chrome, нажмите три точки → 'Установить приложение' или 'Добавить на главный экран'. На iOS: откройте в Safari, нажмите 'Поделиться' → 'На экран Домой'.",
      icon: "Download"
    },
    {
      question: "Где находятся ваши социальные сети?",
      answer: "Наши официальные страницы доступны в боковом меню (три полоски справа вверху) в разделе 'Социальные сети'. Там вы найдете ссылки на ВКонтакте, Telegram и MAX.",
      icon: "Share2"
    },
    {
      question: "Как сообщить об ошибке на сайте?",
      answer: "Напишите Лине в чате или свяжитесь с администрацией через контакты в разделе 'Важные контакты'. Мы оперативно исправим все проблемы!",
      icon: "AlertCircle"
    },
    {
      question: "Могу ли я предложить улучшения для портала?",
      answer: "Конечно! Мы открыты к вашим идеям. Напишите предложения Лине в чате, в наших соцсетях или напрямую администрации поселка. Каждое мнение важно!",
      icon: "Lightbulb"
    },
    {
      question: "Как часто обновляется информация?",
      answer: "Мы стараемся поддерживать информацию максимально актуальной. Расписание транспорта и контакты обновляются при любых изменениях. Следите за новостями в наших соцсетях!",
      icon: "RefreshCw"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className="sticky top-0 bg-wb-purple text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Icon name="HelpCircle" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Частые вопросы</h2>
              <p className="text-sm opacity-90">Ответы на популярные вопросы</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        {/* Содержимое */}
        <div className="overflow-y-auto p-6 space-y-3">
          {faqItems.map((item, index) => (
            <div 
              key={index}
              className="border border-wb-gray-200 rounded-xl overflow-hidden transition-all hover:border-wb-purple"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center gap-4 p-4 text-left bg-white hover:bg-gray-50 transition-colors"
              >
                <div className={`p-2 rounded-lg ${openIndex === index ? 'bg-wb-purple text-white' : 'bg-gray-100 text-wb-gray-700'}`}>
                  <Icon name={item.icon as any} size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-wb-gray-900">{item.question}</h3>
                </div>
                <Icon 
                  name="ChevronDown" 
                  size={20} 
                  className={`text-wb-gray-400 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                />
              </button>
              
              {openIndex === index && (
                <div className="px-4 pb-4 pt-2 bg-gray-50 border-t border-wb-gray-100">
                  <p className="text-wb-gray-700 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Футер */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-wb-gray-200 px-6 py-4">
          <div className="flex items-start gap-3">
            <div className="bg-wb-purple/10 p-2 rounded-lg">
              <Icon name="MessageCircle" size={20} className="text-wb-purple" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-wb-gray-900">Не нашли ответ?</p>
              <p className="text-sm text-wb-gray-600">Напишите вопрос Лине — она поможет!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;