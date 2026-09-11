import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Icon from "@/components/ui/icon";
import { PvzItem } from './types';

interface PvzTabProps {
  pvzItems: PvzItem[];
  setPvzItems: (items: PvzItem[]) => void;
  addItem: (type: string) => void;
  removeItem: (type: string, index: number) => void;
}

const PvzTab = ({
  pvzItems,
  setPvzItems,
  addItem,
  removeItem
}: PvzTabProps) => {
  return (
    <Card className="border-2 border-indigo-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardTitle className="flex items-center gap-3 text-indigo-700">
          <Icon name="Package" size={24} />
          Пункты выдачи заказов
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        {pvzItems.map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl p-4 border-2 border-gray-100 hover:border-indigo-300 transition-all space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Название ПВЗ (Wildberries, OZON...)"
                value={item.name}
                onChange={(e) => {
                  const updated = [...pvzItems];
                  updated[idx] = { ...updated[idx], name: e.target.value };
                  setPvzItems(updated);
                }}
              />
              <Input
                placeholder="Адрес"
                value={item.address}
                onChange={(e) => {
                  const updated = [...pvzItems];
                  updated[idx] = { ...updated[idx], address: e.target.value };
                  setPvzItems(updated);
                }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Режим работы"
                value={item.schedule}
                onChange={(e) => {
                  const updated = [...pvzItems];
                  updated[idx] = { ...updated[idx], schedule: e.target.value };
                  setPvzItems(updated);
                }}
              />
              <Input
                placeholder="Телефон (необязательно)"
                value={item.phone}
                onChange={(e) => {
                  const updated = [...pvzItems];
                  updated[idx] = { ...updated[idx], phone: e.target.value };
                  setPvzItems(updated);
                }}
              />
            </div>

            <Input
              placeholder="Ссылка на логотип ПВЗ (URL, необязательно)"
              value={item.logoUrl || ''}
              onChange={(e) => {
                const updated = [...pvzItems];
                updated[idx] = { ...updated[idx], logoUrl: e.target.value };
                setPvzItems(updated);
              }}
            />

            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
              <Checkbox
                id={`fitting-${idx}`}
                checked={!!item.hasFitting}
                onCheckedChange={(checked) => {
                  const updated = [...pvzItems];
                  updated[idx] = { ...updated[idx], hasFitting: !!checked };
                  setPvzItems(updated);
                }}
              />
              <label htmlFor={`fitting-${idx}`} className="text-sm font-medium text-gray-700 flex-shrink-0">
                Есть примерочные
              </label>
              {item.hasFitting && (
                <Input
                  placeholder="Сколько (например 2 шт.)"
                  value={item.fittingCount || ''}
                  onChange={(e) => {
                    const updated = [...pvzItems];
                    updated[idx] = { ...updated[idx], fittingCount: e.target.value };
                    setPvzItems(updated);
                  }}
                  className="flex-1"
                />
              )}
            </div>

            <Textarea
              placeholder="Описание / как добраться"
              value={item.note || ''}
              onChange={(e) => {
                const updated = [...pvzItems];
                updated[idx] = { ...updated[idx], note: e.target.value };
                setPvzItems(updated);
              }}
              rows={2}
            />
            <Input
              placeholder="Ссылка на чат ПВЗ в Telegram (необязательно)"
              value={item.chatLink || ''}
              onChange={(e) => {
                const updated = [...pvzItems];
                updated[idx] = { ...updated[idx], chatLink: e.target.value };
                setPvzItems(updated);
              }}
            />

            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Фотографии</p>
              {(item.photos || []).map((photo, pIdx) => (
                <div key={pIdx} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_36px] gap-2 items-start">
                  <Input
                    placeholder="Ссылка на фото (URL)"
                    value={photo.url}
                    onChange={(e) => {
                      const updated = [...pvzItems];
                      const photos = [...(updated[idx].photos || [])];
                      photos[pIdx] = { ...photos[pIdx], url: e.target.value };
                      updated[idx] = { ...updated[idx], photos };
                      setPvzItems(updated);
                    }}
                  />
                  <Input
                    placeholder="Подпись к фото"
                    value={photo.caption}
                    onChange={(e) => {
                      const updated = [...pvzItems];
                      const photos = [...(updated[idx].photos || [])];
                      photos[pIdx] = { ...photos[pIdx], caption: e.target.value };
                      updated[idx] = { ...updated[idx], photos };
                      setPvzItems(updated);
                    }}
                  />
                  <Button
                    onClick={() => {
                      const updated = [...pvzItems];
                      updated[idx] = { ...updated[idx], photos: (updated[idx].photos || []).filter((_, i) => i !== pIdx) };
                      setPvzItems(updated);
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
                  const updated = [...pvzItems];
                  updated[idx] = { ...updated[idx], photos: [...(updated[idx].photos || []), { url: '', caption: '' }] };
                  setPvzItems(updated);
                }}
                variant="outline"
                size="sm"
                className="border-dashed"
              >
                <Icon name="Plus" size={14} className="mr-1" />
                Добавить фото
              </Button>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => removeItem('pvz', idx)}
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Icon name="Trash2" size={16} className="mr-1" />
                Удалить ПВЗ
              </Button>
            </div>
          </div>
        ))}
        <Button
          onClick={() => addItem('pvz')}
          variant="outline"
          className="w-full border-2 border-dashed border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50"
        >
          <Icon name="Plus" size={18} className="mr-2" />
          Добавить ПВЗ
        </Button>
      </CardContent>
    </Card>
  );
};

export default PvzTab;
