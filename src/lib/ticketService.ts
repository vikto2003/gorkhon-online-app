export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface TicketMessage {
  id: string;
  sender: 'user' | 'agent' | 'bot';
  authorName: string;
  content: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: TicketStatus;
  userName: string;
  visitorId: string;
  source: string;
  unreadForAdmin: number;
  unreadForUser: number;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

const STORAGE_KEY = 'supportTickets';
export const TICKETS_EVENT = 'tickets-updated';

const emit = () => {
  window.dispatchEvent(new Event(TICKETS_EVENT));
  window.dispatchEvent(new Event('storage'));
};

export const getVisitorId = (): string => {
  let id = localStorage.getItem('visitorId');
  if (!id) {
    id = `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem('visitorId', id);
  }
  return id;
};

export const getTickets = (): Ticket[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveTickets = (tickets: Ticket[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  emit();
};

export const getMyTickets = (): Ticket[] => {
  const visitorId = getVisitorId();
  return getTickets().filter(t => t.visitorId === visitorId);
};

export const getUnreadForAdmin = (): number =>
  getTickets().reduce((sum, t) => sum + (t.unreadForAdmin || 0), 0);

export const getUnreadForUser = (): number =>
  getMyTickets().reduce((sum, t) => sum + (t.unreadForUser || 0), 0);

export interface SupportPreview {
  preview: string;
  updatedAt?: string;
  unread: number;
  lastSenderIsUser: boolean;
}

// Превью последнего сообщения из чата поддержки — для списка чатов (стиль MAX)
export const getSupportPreview = (): SupportPreview => {
  const tickets = [...getMyTickets()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const last = tickets[0];
  const lastMsg = last?.messages[last.messages.length - 1];

  return {
    preview: lastMsg?.content || 'Ответим на вопросы и поможем 24/7',
    updatedAt: lastMsg?.createdAt,
    unread: getUnreadForUser(),
    lastSenderIsUser: lastMsg?.sender === 'user',
  };
};

export const createTicket = (params: {
  subject: string;
  description: string;
  userName?: string;
  source?: string;
}): Ticket => {
  const now = new Date().toISOString();
  const ticket: Ticket = {
    id: `T-${Date.now().toString(36).toUpperCase()}`,
    subject: params.subject.slice(0, 200),
    description: params.description,
    status: 'open',
    userName: params.userName || 'Житель Горхона',
    visitorId: getVisitorId(),
    source: params.source || 'chat',
    unreadForAdmin: 1,
    unreadForUser: 0,
    createdAt: now,
    updatedAt: now,
    messages: [
      {
        id: `m_${Date.now().toString(36)}`,
        sender: 'user',
        authorName: params.userName || 'Житель Горхона',
        content: params.description,
        createdAt: now,
      },
    ],
  };

  const tickets = getTickets();
  saveTickets([ticket, ...tickets]);
  notifyAdminNewTicket(ticket);
  return ticket;
};

export const addMessage = (
  ticketId: string,
  sender: TicketMessage['sender'],
  content: string,
  authorName?: string
): Ticket | null => {
  const tickets = getTickets();
  const idx = tickets.findIndex(t => t.id === ticketId);
  if (idx === -1) return null;

  const now = new Date().toISOString();
  const message: TicketMessage = {
    id: `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    sender,
    authorName: authorName || (sender === 'user' ? tickets[idx].userName : 'Агент поддержки'),
    content,
    createdAt: now,
  };

  const t = tickets[idx];
  tickets[idx] = {
    ...t,
    messages: [...t.messages, message],
    updatedAt: now,
    unreadForAdmin: sender === 'user' ? (t.unreadForAdmin || 0) + 1 : t.unreadForAdmin,
    unreadForUser: sender !== 'user' ? (t.unreadForUser || 0) + 1 : t.unreadForUser,
    status: sender === 'agent' && t.status === 'open' ? 'in_progress' : t.status,
  };

  saveTickets(tickets);

  if (sender === 'user') {
    notifyAdminNewMessage(tickets[idx], content);
  } else {
    notifyUserNewReply(tickets[idx], content);
  }

  return tickets[idx];
};

export const setStatus = (ticketId: string, status: TicketStatus) => {
  const tickets = getTickets();
  const idx = tickets.findIndex(t => t.id === ticketId);
  if (idx === -1) return;
  tickets[idx] = { ...tickets[idx], status, updatedAt: new Date().toISOString() };
  saveTickets(tickets);
};

export const markReadByAdmin = (ticketId: string) => {
  const tickets = getTickets();
  const idx = tickets.findIndex(t => t.id === ticketId);
  if (idx === -1) return;
  tickets[idx] = { ...tickets[idx], unreadForAdmin: 0 };
  saveTickets(tickets);
};

export const markReadByUser = (ticketId: string) => {
  const tickets = getTickets();
  const idx = tickets.findIndex(t => t.id === ticketId);
  if (idx === -1) return;
  tickets[idx] = { ...tickets[idx], unreadForUser: 0 };
  saveTickets(tickets);
};

// ---- Определение запроса на специалиста ----

const AGENT_TRIGGERS = [
  'позови специалиста',
  'позовите специалиста',
  'нужен специалист',
  'специалист',
  'позвать специалиста',
  'живой человек',
  'оператор',
  'хочу к человеку',
  'соедини с человеком',
  'позови человека',
  'техподдержка',
  'тех поддержка',
  'служба поддержки',
  'создай тикет',
  'создать тикет',
  'жалоба',
  'пожаловаться',
];

export const needsAgent = (text: string): boolean => {
  const t = text.toLowerCase().replace(/[^\wа-яё\s]/gi, ' ');
  return AGENT_TRIGGERS.some(trigger => t.includes(trigger));
};

// ---- Уведомления ----

const showNotification = async (title: string, body: string, tag: string) => {
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  const icon = 'https://cdn.poehali.dev/projects/80b27c13-e76f-4c17-9cd3-0ca13d96fc7a/bucket/6642dbf5-9434-4dca-abb3-693152bd21d7.png';

  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification(title, {
        body,
        icon,
        badge: icon,
        tag,
        renotify: true,
        requireInteraction: false,
        vibrate: [200, 100, 200],
      } as NotificationOptions);
      return;
    }
  } catch {
    // fallback ниже
  }

  new Notification(title, { body, icon, tag });
};

const notifyAdminNewTicket = (ticket: Ticket) => {
  showNotification(
    '🎫 Новый тикет в поддержке',
    `${ticket.userName}: ${ticket.subject}`,
    `ticket-${ticket.id}`
  );
};

const notifyAdminNewMessage = (ticket: Ticket, content: string) => {
  showNotification(
    `💬 Новое сообщение в тикете ${ticket.id}`,
    content.slice(0, 120),
    `ticket-${ticket.id}`
  );
};

const notifyUserNewReply = (ticket: Ticket, content: string) => {
  showNotification(
    '💬 Ответ от поддержки',
    content.slice(0, 120),
    `ticket-reply-${ticket.id}`
  );
};