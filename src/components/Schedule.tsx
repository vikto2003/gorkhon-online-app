import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";

interface RouteInfo {
  route: string;
  time: string;
  price: string;
}

interface TransportSchedule {
  type: string;
  routes: RouteInfo[];
}

const Schedule = () => {
  const scheduleData: TransportSchedule[] = [
    {
      type: "🚌 Автобус",
      routes: [
        { route: "Горхон → УУ", time: "7:00 (ПН-ПТ)", price: "500₽" },
        { route: "Горхон → УУ", time: "8:00 (СБ-ВС, 16:30 ВС студ.)", price: "500₽" },
        { route: "Горхон → Заиграево", time: "7:00, 14:15 (ПН-ПТ)", price: "290₽" },
        { route: "Заиграево → Горхон", time: "13:00, вечером городской", price: "290₽" }
      ]
    },
    {
      type: "🚞 Электричка", 
      routes: [
        { route: "Горхон → УУ", time: "05:32 (ПН)", price: "296₽" },
        { route: "Горхон → УУ", time: "09:27 (СБ)", price: "296₽" },
        { route: "УУ → Горхон", time: "17:40 (ПТ)", price: "296₽" },
        { route: "УУ → Горхон", time: "08:35 (ВС)", price: "296₽" }
      ]
    }
  ];

  return (
    <Card data-tutorial="city-map" className="rounded-xl bg-white border border-wb-gray-200 shadow-sm transition-all duration-200">
      <CardHeader className="p-4 md:p-5 border-b border-wb-gray-100">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-wb-purple/10 flex-shrink-0">
            <Icon name="Bus" size={20} className="text-wb-purple" />
          </div>
          <div className="min-w-0">
            <span className="text-lg md:text-xl font-semibold text-wb-gray-900">Расписание транспорта</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 md:p-5 space-y-4">
        {scheduleData.map((transport, index) => (
          <div key={index}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">{transport.type.split(' ')[0]}</span>
              <h4 className="font-semibold text-sm md:text-base text-wb-gray-900">
                {transport.type.split(' ').slice(1).join(' ')}
              </h4>
            </div>
            
            <div className="space-y-2">
              {transport.routes.map((route, routeIndex) => (
                <div key={routeIndex} className="flex justify-between items-center p-3 md:p-4 rounded-lg bg-wb-gray-50 hover:bg-wb-gray-100 transition-colors duration-150">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Icon name="MapPin" size={14} className="text-wb-gray-600 flex-shrink-0" />
                      <p className="text-sm md:text-base font-semibold text-wb-gray-900 truncate">
                        {route.route}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-7">
                      <Icon name="Clock" size={12} className="text-gray-500 flex-shrink-0" />
                      <p className="text-xs md:text-sm text-gray-600 font-medium">{route.time}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 ml-3">
                    <Badge variant="secondary" className="bg-gradient-to-r from-gorkhon-orange to-gorkhon-orange/90 text-white border-0 px-3 md:px-4 py-1.5 font-bold text-sm shadow-lg shadow-gorkhon-orange/20">
                      {route.price}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Icon name="Ticket" size={10} />
                      <span className="hidden sm:inline">за билет</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {index < scheduleData.length - 1 && (
              <div className="flex items-center gap-3 mt-3 md:mt-5 mb-1">
                <Separator className="flex-1" />
                <div className="p-1 rounded-full bg-gorkhon-orange/10">
                  <Icon name="ArrowDown" size={12} className="text-gorkhon-orange" />
                </div>
                <Separator className="flex-1" />
              </div>
            )}
          </div>
        ))}
        
        <div className="mt-4 md:mt-6 p-3 md:p-4 rounded-lg md:rounded-xl bg-blue-50 md:bg-gradient-to-r md:from-blue-50 md:to-purple-50 border border-blue-200/50">
          <div className="flex items-center gap-2 text-blue-800 mb-2">
            <Icon name="Info" size={16} className="flex-shrink-0" />
            <p className="text-sm md:text-sm font-semibold">Полезная информация</p>
          </div>
          <p className="text-xs text-blue-700 leading-relaxed">Возможны изменения в расписании или отмены рейсов "Горхон - УУ", "УУ - Горхон", "Заиграево - Горхон", "Горхон - Заиграево". Уточняйте информацию в поселковых чатах в Telegram.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Schedule;