import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";

export default function StatusConexao() {
  const [conectado, setConectado] = useState<boolean | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000/status");
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setConectado(data.conectado);
      } catch {
        setConectado(false);
      }
    };
    ws.onerror = () => setConectado(false);
    ws.onclose = () => setConectado(false);
    return () => ws.close();
  }, []);

  return (
    <div className="flex items-center justify-center p-4 ">
      <Button
        variant={conectado ? "default" : "destructive"}
        className={`cursor-default ${
          conectado ? "bg-green-500 hover:bg-green-500" : ""
        }`}
      >
        {conectado
          ? "Módulo mestre comunicando"
          : "Módulo mestre sem comunicação"}
      </Button>
    </div>
  );
}
