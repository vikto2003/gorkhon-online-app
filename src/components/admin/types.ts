export interface ImportantNumber {
  name: string;
  person: string;
  phone: string;
  icon: string;
}

export interface WorkScheduleItem {
  name: string;
  schedule: string;
  icon: string;
}

export interface PvzItem {
  name: string;
  address: string;
  schedule: string;
  phone: string;
  hasFitting: boolean;
  fittingCount?: string;
  note?: string;
  chatLink?: string;
  icon?: string;
  logoUrl?: string;
  photos: { url: string; caption: string; }[];
}

export interface SystemMessage {
  id: string;
  text: string;
  timestamp: string;
  isFromAdmin?: boolean;
}

export interface HelpItem {
  title: string;
  description: string;
  contact: string;
  icon: string;
}

export interface TransportRoute {
  route: string;
  time: string;
  price: string;
}

export interface TransportScheduleGroup {
  type: string;
  routes: TransportRoute[];
}

export interface TransportScheduleData {
  regular: TransportScheduleGroup[];
  temporary: TransportScheduleGroup[];
  temporaryNoticeTitle: string;
  temporaryNoticeText: string;
}

export interface ChatItem {
  name: string;
  platform: string;
  url: string;
  icon: string;
  color: string;
}

export interface DoctorButton {
  title: string;
  subtitle: string;
  note: string;
  buttonText: string;
  url: string;
}