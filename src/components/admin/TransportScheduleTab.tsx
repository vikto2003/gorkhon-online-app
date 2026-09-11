import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";
import { TransportScheduleData, TransportScheduleGroup } from './types';

interface TransportScheduleTabProps {
  data: TransportScheduleData;
  setData: (data: TransportScheduleData) => void;
}

const emptyGroup: TransportScheduleGroup = { type: '🚌 Новый транспорт', routes: [] };

const TransportScheduleTab = ({ data, setData }: TransportScheduleTabProps) => {
  const updateGroups = (key: 'regular' | 'temporary', groups: TransportScheduleGroup[]) => {
    setData({ ...data, [key]: groups });
  };

  const renderGroups = (key: 'regular' | 'temporary') => {
    const groups = data[key];

    return (
      <div className="space-y-4">
        {groups.map((group, gIdx) => (
          <div key={gIdx} className="bg-white rounded-xl p-4 border-2 border-gray-100 space-y-3">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Тип транспорта (например 🚌 Автобус)"
                value={group.type}
                onChange={(e) => {
                  const updated = [...groups];
                  updated[gIdx] = { ...updated[gIdx], type: e.target.value };
                  updateGroups(key, updated);
                }}
                className="flex-1"
              />
              <Button
                onClick={() => updateGroups(key, groups.filter((_, i) => i !== gIdx))}
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
              >
                <Icon name="Trash2" size={16} />
              </Button>
            </div>

            <div className="space-y-2 pl-2 border-l-2 border-gray-100">
              {group.routes.map((route, rIdx) => (
                <div key={rIdx} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_100px_36px] gap-2 items-start">
                  <Input
                    placeholder="Маршрут (Горхон → УУ)"
                    value={route.route}
                    onChange={(e) => {
                      const updated = [...groups];
                      const routes = [...updated[gIdx].routes];
                      routes[rIdx] = { ...routes[rIdx], route: e.target.value };
                      updated[gIdx] = { ...updated[gIdx], routes };
                      updateGroups(key, updated);
                    }}
                  />
                  <Input
                    placeholder="Время отправления"
                    value={route.time}
                    onChange={(e) => {
                      const updated = [...groups];
                      const routes = [...updated[gIdx].routes];
                      routes[rIdx] = { ...routes[rIdx], time: e.target.value };
                      updated[gIdx] = { ...updated[gIdx], routes };
                      updateGroups(key, updated);
                    }}
                  />
                  <Input
                    placeholder="Цена"
                    value={route.price}
                    onChange={(e) => {
                      const updated = [...groups];
                      const routes = [...updated[gIdx].routes];
                      routes[rIdx] = { ...routes[rIdx], price: e.target.value };
                      updated[gIdx] = { ...updated[gIdx], routes };
                      updateGroups(key, updated);
                    }}
                  />
                  <Button
                    onClick={() => {
                      const updated = [...groups];
                      updated[gIdx] = { ...updated[gIdx], routes: updated[gIdx].routes.filter((_, i) => i !== rIdx) };
                      updateGroups(key, updated);
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-600 hover:bg-red-50"
                  >
                    <Icon name="X" size={14} />
                  </Button>
                </div>
              ))}
              <Button
                onClick={() => {
                  const updated = [...groups];
                  updated[gIdx] = { ...updated[gIdx], routes: [...updated[gIdx].routes, { route: '', time: '', price: '' }] };
                  updateGroups(key, updated);
                }}
                variant="outline"
                size="sm"
                className="border-dashed"
              >
                <Icon name="Plus" size={14} className="mr-1" />
                Добавить рейс
              </Button>
            </div>
          </div>
        ))}

        <Button
          onClick={() => updateGroups(key, [...groups, { ...emptyGroup }])}
          variant="outline"
          className="w-full border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50"
        >
          <Icon name="Plus" size={18} className="mr-2" />
          Добавить вид транспорта
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-orange-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50">
          <CardTitle className="flex items-center gap-3 text-orange-700">
            <Icon name="AlertTriangle" size={24} />
            Уведомление о временных изменениях
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-6">
          <Input
            placeholder="Заголовок уведомления"
            value={data.temporaryNoticeTitle}
            onChange={(e) => setData({ ...data, temporaryNoticeTitle: e.target.value })}
          />
          <Textarea
            placeholder="Текст уведомления"
            value={data.temporaryNoticeText}
            onChange={(e) => setData({ ...data, temporaryNoticeText: e.target.value })}
            rows={3}
          />
        </CardContent>
      </Card>

      <Card className="border-2 border-blue-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardTitle className="flex items-center gap-3 text-blue-700">
            <Icon name="AlertCircle" size={24} />
            Временное расписание
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {renderGroups('temporary')}
        </CardContent>
      </Card>

      <Card className="border-2 border-blue-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardTitle className="flex items-center gap-3 text-blue-700">
            <Icon name="Calendar" size={24} />
            Обычное расписание
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {renderGroups('regular')}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransportScheduleTab;
