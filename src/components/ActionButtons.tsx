import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { getDefaultDoctorButton } from "@/components/admin/defaultData";
import type { DoctorButton } from "@/components/admin/types";

const ActionButtons = () => {
  const [doctorButton, setDoctorButton] = useState<DoctorButton>(getDefaultDoctorButton());

  const loadData = useCallback(() => {
    try {
      const savedContent = localStorage.getItem('homePageContent');
      if (savedContent) {
        const content = JSON.parse(savedContent);
        if (content.doctorButton) {
          setDoctorButton(content.doctorButton);
          return;
        }
      }
      setDoctorButton(getDefaultDoctorButton());
    } catch {
      setDoctorButton(getDefaultDoctorButton());
    }
  }, []);

  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, [loadData]);

  return (
    <div className="space-y-6">
      {/* Medical Link */}
      <Card className="animate-fade-in bg-blue-50 border-0 rounded-2xl md:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden relative">
        {/* Декоративные элементы */}
        <div className="absolute top-0 right-0 w-24 h-24 md:w-40 md:h-40 bg-blue-400/10 rounded-full -translate-y-12 translate-x-12 md:-translate-y-20 md:translate-x-20 group-hover:scale-150 transition-transform duration-700"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 md:w-32 md:h-32 bg-indigo-400/5 rounded-full translate-y-10 -translate-x-10 md:translate-y-16 md:-translate-x-16 group-hover:scale-125 transition-transform duration-700"></div>
        
        <CardContent className="p-5 md:p-7 relative z-10">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-3.5 md:p-4 rounded-2xl bg-wb-purple shadow-lg shadow-blue-500/30 group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all duration-300 flex-shrink-0 group-hover:scale-110">
              <Icon name="Stethoscope" size={26} className="md:w-8 md:h-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-blue-900 text-xl md:text-2xl mb-1 tracking-tight">{doctorButton.title}</p>
              <p className="text-sm md:text-base text-blue-700 mb-1.5 leading-tight font-medium">
                {doctorButton.subtitle}
              </p>
              <p className="text-xs md:text-sm text-blue-600/80 font-medium">{doctorButton.note}</p>
            </div>
          </div>
          
          {/* Кнопка на всю ширину на мобильных */}
          <div className="mt-5 md:mt-6">
            <Button 
              size="lg"
              className="w-full md:w-auto bg-wb-purple hover:bg-wb-purple-dark text-white px-7 py-3.5 rounded-xl font-bold shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 text-base md:text-lg border-0"
              onClick={() => window.open(doctorButton.url, '_blank')}
            >
              <Icon name="Calendar" size={20} className="mr-2.5" />
              {doctorButton.buttonText}
              <Icon name="ExternalLink" size={16} className="ml-2.5 opacity-80" />
            </Button>
          </div>
        </CardContent>
      </Card>



    </div>
  );
};

export default ActionButtons;
