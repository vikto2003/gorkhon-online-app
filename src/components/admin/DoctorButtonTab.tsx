import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import { DoctorButton } from './types';

interface DoctorButtonTabProps {
  doctorButton: DoctorButton;
  setDoctorButton: (data: DoctorButton) => void;
}

const DoctorButtonTab = ({ doctorButton, setDoctorButton }: DoctorButtonTabProps) => {
  return (
    <Card className="border-2 border-blue-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
        <CardTitle className="flex items-center gap-3 text-blue-700">
          <Icon name="Stethoscope" size={24} />
          Кнопка «Запись к врачу»
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-6">
        <Input
          placeholder="Заголовок (Запись к врачу)"
          value={doctorButton.title}
          onChange={(e) => setDoctorButton({ ...doctorButton, title: e.target.value })}
        />
        <Input
          placeholder="Подзаголовок (Чат с Заиграевской ЦРБ)"
          value={doctorButton.subtitle}
          onChange={(e) => setDoctorButton({ ...doctorButton, subtitle: e.target.value })}
        />
        <Input
          placeholder="Примечание (Быстро и удобно)"
          value={doctorButton.note}
          onChange={(e) => setDoctorButton({ ...doctorButton, note: e.target.value })}
        />
        <Input
          placeholder="Текст на кнопке (Записаться)"
          value={doctorButton.buttonText}
          onChange={(e) => setDoctorButton({ ...doctorButton, buttonText: e.target.value })}
        />
        <Input
          placeholder="Ссылка на чат/запись"
          value={doctorButton.url}
          onChange={(e) => setDoctorButton({ ...doctorButton, url: e.target.value })}
        />
      </CardContent>
    </Card>
  );
};

export default DoctorButtonTab;
