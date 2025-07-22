interface StatusModoProps {
  modo: number | null;
}

export default function StatusModo({ modo }: StatusModoProps) {
  const getModoText = (modo: number | null) => {
    switch (modo) {
      case 0:
        return { text: "Parado", color: "bg-red-500" };
      case 1:
        return { text: "Automático", color: "bg-green-500" };
      case 2:
        return { text: "Manual", color: "bg-blue-500" };
      default:
        return { text: "Carregando...", color: "bg-gray-500" };
    }
  };

  const { text, color } = getModoText(modo);

  return (
    <div className="flex items-center justify-center space-x-2">
      <div className={`w-3 h-3 rounded-full ${color}`}></div>
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}
