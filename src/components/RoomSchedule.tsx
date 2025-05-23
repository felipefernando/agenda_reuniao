import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Meeting {
  id: number;
  requester: string;
  room: string;
  subject: string;
  dateStart: number;
  dateEnd: number;
  isPast: boolean;
}

interface RoomScheduleProps {
  meetings: Meeting[];
}

export function RoomSchedule({ meetings }: RoomScheduleProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sortedMeetings, setSortedMeetings] = useState<Meeting[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const now = currentTime.getTime();
    const sorted = [...meetings].sort((a, b) => {
      const statusA = now >= a.dateStart && now <= a.dateEnd 
        ? "active"
        : now < a.dateStart 
          ? "upcoming" 
          : "past";
      
      const statusB = now >= b.dateStart && now <= b.dateEnd 
        ? "active"
        : now < b.dateStart 
          ? "upcoming" 
          : "past";

      const statusOrder = { active: 0, upcoming: 1, past: 2 };

      if (statusA !== statusB) {
        return statusOrder[statusA] - statusOrder[statusB];
      }

      return a.dateStart - b.dateStart;
    });

    setSortedMeetings(sorted);
  }, [meetings, currentTime]);

  const formatTimeRange = (start: number, end: number) => {
    const startTime = format(new Date(start), "HH:mm", { locale: ptBR });
    const endTime = format(new Date(end), "HH:mm", { locale: ptBR });
    return `${startTime} - ${endTime}`;
  };

  const getMeetingStatus = (meeting: Meeting) => {
    const now = currentTime.getTime();
    if (now >= meeting.dateStart && now <= meeting.dateEnd) {
      return "active";
    }
    if (now < meeting.dateStart) {
      return "upcoming";
    }
    return "past";
  };

  const capitalizeWords = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div>
      <div className="px-4 py-2 bg-gray-50 border-b flex items-center font-medium text-gray-600">
        <div className="w-2/12">Requisitante</div>
        <div className="w-2/12">Sala</div>
        <div className="w-6/12">Assunto</div>
        <div className="w-2/12">Horário</div>
      </div>

      {sortedMeetings.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          Não há reuniões agendadas para esta data.
        </div>
      ) : (
        <div className="divide-y">
          {sortedMeetings.map((meeting) => {
            const status = getMeetingStatus(meeting);
            return (
              <div
                key={meeting.id}
                className={cn(
                  "px-4 py-3 flex items-center transition-colors",
                  status === "active" ? "bg-blue-50" : "",
                  status === "past" ? "text-gray-400" : ""
                )}
              >
                <div className="w-2/12 flex items-center gap-2">
                  <span
                    className={cn(
                      "h-3 w-3 rounded-full",
                      status === "active" ? "bg-green-500" : "",
                      status === "upcoming" ? "bg-orange-500" : "",
                      status === "past" ? "bg-gray-300" : ""
                    )}
                  />
                  {capitalizeWords(meeting.requester)}
                </div>
                <div className="w-2/12">{meeting.room}</div>
                <div className="w-6/12">{meeting.subject}</div>
                <div className="w-2/12 text-sm">
                  {formatTimeRange(meeting.dateStart, meeting.dateEnd)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="p-3 bg-gray-50 border-t text-xs text-gray-500 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-green-500"></span>
            <span>Em andamento</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-orange-500"></span>
            <span>Próximas</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-gray-300"></span>
            <span>Concluídas</span>
          </div>
        </div>
        <div>
          Atualizado em: {format(currentTime, "dd/MM/yyyy HH:mm", { locale: ptBR })}
        </div>
      </div>
    </div>
  );
}
