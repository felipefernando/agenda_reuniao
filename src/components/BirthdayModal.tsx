
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BirthdayData } from "@/utils/database";

interface BirthdayModalProps {
  isOpen: boolean;
  onClose: () => void;
  birthdays: BirthdayData[];
  loading?: boolean;
}

export function BirthdayModal({ isOpen, onClose, birthdays, loading = false }: BirthdayModalProps) {
  // Auto-close the modal after 60 seconds
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 60000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (birthdays.length === 0 && !loading) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-red-500 rounded-full p-5">
          <PartyPopper size={30} className="text-white" />
        </div>

        <DialogHeader className="pt-8">
          <DialogTitle className="text-center text-2xl">Aniversariantes da Semana</DialogTitle>
        </DialogHeader>

        <div className="max-h-[300px] overflow-y-auto mt-4">
          {loading ? (
            <div className="p-4 text-center">Carregando aniversariantes...</div>
          ) : birthdays.length === 0 ? (
            <div className="p-4 text-center">Nenhum aniversariante esta semana.</div>
          ) : (
            birthdays.map((birthday, index) => (
              <div
                key={index}
                className={cn(
                  "p-4 mb-2 rounded-lg border transition-all duration-300 hover:shadow-md",
                  index % 2 === 0 ? "bg-red-50" : "bg-blue-50"
                )}
              >
                <div className="font-semibold text-lg">{birthday.name}</div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600 capitalize">{birthday.department}</span>
                  <span className="font-medium">{birthday.date}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
