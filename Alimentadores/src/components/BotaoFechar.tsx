import { X } from "lucide-react";
import { Button } from "./ui/button";

export default function BotaoFechar({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="absolute top-2 right-2 text-gray-500 hover:text-black cursor-pointer"
    >
      <X className="w-5 h-5" />
    </Button>
  );
}
