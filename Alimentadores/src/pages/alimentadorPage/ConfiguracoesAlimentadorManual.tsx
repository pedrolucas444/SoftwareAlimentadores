import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export default function ConfiguracoesAlimentadorManual() {
  const [doseManual, setDoseManual] = useState(500);
  const [mostrarSetpoint, setMostrarSetpoint] = useState(false);
  const [novoSetpoint, setNovoSetpoint] = useState("");

  const handleEnviarSetpoint = () => {
    const valor = parseInt(novoSetpoint);
    if (valor > 0) {
      setDoseManual(valor);
      setMostrarSetpoint(false);
      setNovoSetpoint("");
      alert(`Setpoint atualizado para: ${valor}g`);
    }
  };

  const handleCancelarSetpoint = () => {
    setMostrarSetpoint(false);
    setNovoSetpoint("");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 mt-15 mb-10">
      <Card>
        <CardContent className="p-3">
          <h2 className="font-bold text-center text-lg mb-7">
            CONFIGURAÇÕES MANUAL
          </h2>

          <div className="grid grid-cols-2 gap-4 text-lg space-y-3 mt-3">
            <div className="space-y-1 text-center col-span-2 mx-auto">
              <label className="block font-medium">DOSE MANUAL (g)</label>
              <div className="inline-block border-b border-gray-200 px-15 pb-0.5 space-y-1 text-center">
                {doseManual}
              </div>
            </div>
          </div>

          {/* Botão Enviar Setpoint */}
          <div className="mt-6 flex justify-center">
            <Button
              onClick={() => setMostrarSetpoint(true)}
              className="px-6 py-3 text-lg bg-green-600 hover:bg-green-700"
            >
              Enviar Setpoint
            </Button>
          </div>

          {/* Modal para enviar setpoint */}
          {mostrarSetpoint && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                <h3 className="text-lg font-bold mb-4 text-black text-center">
                  Definir Novo Setpoint
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dose Manual (g):
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={novoSetpoint}
                      onChange={(e) => setNovoSetpoint(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                      placeholder="Digite a dose em gramas"
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-3 justify-end">
                    <Button
                      variant="outline"
                      onClick={handleCancelarSetpoint}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleEnviarSetpoint}
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={!novoSetpoint || parseInt(novoSetpoint) <= 0}
                    >
                      Enviar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
