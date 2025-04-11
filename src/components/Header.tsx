
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  selectedLocation: string;
}

export function Header({ selectedLocation }: HeaderProps) {
  const [time, setTime] = useState(new Date());
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearInterval(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const formattedTime = time.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header
      className={cn(
        "bg-white border-b transition-all duration-300 sticky top-0 z-10",
        scrolled ? "shadow-md" : ""
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <img
              src="https://via.placeholder.com/120x40?text=Mondial"
              alt="Logo Mondial"
              className="h-10 w-auto"
            />
            <div className="h-8 w-px bg-gray-200 hidden md:block" />
            <h1 className="text-xl font-semibold text-gray-800 hidden md:block">
              Sistema de Agendamento
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm text-gray-500">Unidade</span>
              <span className="font-medium">{selectedLocation}</span>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="text-xl font-bold text-purple-700">{formattedTime}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
