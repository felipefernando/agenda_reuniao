import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoomSchedule } from "@/components/RoomSchedule";
import { BirthdayModal } from "@/components/BirthdayModal";
import { Building, Calendar as CalendarIcon, Users } from "lucide-react";
import { Header } from "@/components/Header";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useBirthdays } from "@/utils/database";

const locations = ["MANAUS", "SÃO PAULO", "CURITIBA", "RIO DE JANEIRO"];

const IndexPage = () => {
  const { toast } = useToast();
  const [selectedLocation, setSelectedLocation] = useState("MANAUS");
  const [date, setDate] = useState(new Date());
  const [meetings, setMeetings] = useState([]);
  const [showBirthdayModal, setShowBirthdayModal] = useState(false);
  
  const { birthdays, loading: birthdaysLoading } = useBirthdays(selectedLocation, date);

  const formattedDate = format(date, "yyyy-MM-dd");
  const currentDateFormatted = format(date, "dd 'de' MMMM", { locale: ptBR });
  const dayOfMonth = format(date, "dd");
  const monthName = format(date, "MMMM", { locale: ptBR });

  useEffect(() => {
    const demoMeetings = [
      {
        id: 1,
        requester: "Carlos Silva",
        room: "Sala Executiva 01",
        subject: "Planejamento Estratégico",
        dateStart: new Date(date).setHours(9, 0),
        dateEnd: new Date(date).setHours(10, 30),
        isPast: new Date(date).setHours(10, 30) < new Date().getTime(),
      },
      {
        id: 2,
        requester: "Ana Martins",
        room: "Sala de Conferência",
        subject: "Reunião com Fornecedores",
        dateStart: new Date(date).setHours(11, 0),
        dateEnd: new Date(date).setHours(12, 0),
        isPast: new Date(date).setHours(12, 0) < new Date().getTime(),
      },
      {
        id: 3,
        requester: "Roberto Almeida",
        room: "Sala de Treinamento",
        subject: "Onboarding Novos Colaboradores",
        dateStart: new Date(date).setHours(13, 30),
        dateEnd: new Date(date).setHours(15, 0),
        isPast: new Date(date).setHours(15, 0) < new Date().getTime(),
      },
      {
        id: 4,
        requester: "Maria Eduarda",
        room: "Sala Pequena 02",
        subject: "Revisão de Projetos",
        dateStart: new Date(date).setHours(15, 30),
        dateEnd: new Date(date).setHours(16, 30),
        isPast: new Date(date).setHours(16, 30) < new Date().getTime(),
      },
    ];

    setMeetings(demoMeetings);
  }, [date, selectedLocation]);

  useEffect(() => {
    if (birthdays.length > 0 && !birthdaysLoading) {
      const timer = setTimeout(() => {
        setShowBirthdayModal(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [birthdays, birthdaysLoading]);

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value);
    toast({
      title: "Local alterado",
      description: `Agora mostrando reuniões em ${value}`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header selectedLocation={selectedLocation} />

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-3">
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building size={18} />
                    Unidade
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={selectedLocation} onValueChange={handleLocationChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecionar local" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarIcon size={18} />
                    Calendário
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div 
                    className="mb-4 flex flex-col items-center p-2 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors border"
                    onClick={() => setShowBirthdayModal(true)}
                  >
                    <div className="text-4xl font-bold text-purple-700">{dayOfMonth}</div>
                    <div className="text-sm text-gray-500 capitalize">{monthName}</div>
                  </div>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    className="border rounded-md p-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users size={18} />
                    Aniversariantes
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Badge variant="outline" className={cn(
                        "w-full py-2 cursor-pointer",
                        birthdays.length > 0 ? "hover:bg-purple-50" : ""
                      )}>
                        {birthdaysLoading 
                          ? "Carregando aniversariantes..."
                          : birthdays.length > 0
                            ? `${birthdays.length} aniversariante(s) esta semana`
                            : "Sem aniversariantes"}
                      </Badge>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Aniversariantes da Semana</DialogTitle>
                      </DialogHeader>
                      <div className="max-h-[300px] overflow-y-auto">
                        {birthdaysLoading ? (
                          <div className="py-4 text-center">Carregando...</div>
                        ) : birthdays.length === 0 ? (
                          <div className="py-4 text-center">Nenhum aniversariante esta semana.</div>
                        ) : birthdays.map((birthday, index) => (
                          <div key={index} className="py-2 border-b last:border-0">
                            <div className="font-medium">{birthday.name}</div>
                            <div className="text-sm text-gray-500 flex justify-between">
                              <span className="capitalize">{birthday.department}</span>
                              <span>{birthday.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="md:col-span-9">
            <Card className="overflow-hidden">
              <CardHeader className="bg-purple-700 text-white">
                <CardTitle className="text-xl">
                  Agenda de Reuniões - {currentDateFormatted}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <RoomSchedule meetings={meetings} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <BirthdayModal 
        isOpen={showBirthdayModal} 
        onClose={() => setShowBirthdayModal(false)}
        birthdays={birthdays}
        loading={birthdaysLoading}
      />
    </div>
  );
};

export default IndexPage;
