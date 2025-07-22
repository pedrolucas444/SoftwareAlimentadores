import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import BotaoFechar from "./BotaoFechar";

interface ModalSetpointManualProps {
  closeModal: () => void;
  modo: number;
}

export default function ModalSetpointManual({
  closeModal,
  modo,
}: ModalSetpointManualProps) {
  const [setpointManual, setSetpointManual] = useState<number>(50);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar envio do setpoint manual
    console.log("Setpoint manual:", setpointManual, "Modo:", modo);
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative">
        <BotaoFechar onClick={closeModal} />
        <Card className="w-96">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4 text-center">
              Setpoint Manual
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Valor do Setpoint (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={setpointManual}
                  onChange={(e) => setSetpointManual(Number(e.target.value))}
                  className="w-full p-2 border rounded-md text-black"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Aplicar Setpoint
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
