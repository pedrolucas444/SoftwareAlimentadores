import React, { useState, useEffect } from "react";
import BotaoFechar from "./BotaoFechar";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import { AlimentadorAutomatico } from "../service/deviceService";

export function SeletorModo() {
  const { id } = useParams();

  const setModo = async (modo: number) => {
    try {
      await fetch(`http://localhost:3000/moduloMestre/alimentador/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modo }),
      });
    } catch (err) {
      console.error("Erro ao enviar o modo", err);
    }
  };

  useEffect(() => {
    setModo(1);
  }, [id]);

  return (
    <div className="flex gap-2 mb-4">
      <Button onClick={() => setModo(2)}>Manual</Button>
      <Button onClick={() => setModo(1)}>Automático</Button>
    </div>
  );
}
export type CampoConfiguracao = {
  label: string;
  placeholder: string;
  id: string;
  tipo: "text" | "time" | "number";
  min?: number;
  max?: number;
};

type ModalConfiguracaoProps = {
  closeModal: (open: boolean) => void;
  campos: CampoConfiguracao[];
  dispositivo: "alimentador";
  modo: number;
  onSetPointEnviado?: (valor: number) => void;
  atualizarRegistrosEscrita?: (data: Record<string, any>) => void;
  valorInicial?: Record<string, any>; // valores vindos do WebSocket
};

const ModalConfiguracao: React.FC<ModalConfiguracaoProps> = ({
  closeModal,
  campos,
  valorInicial,
  modo,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const inicial: Record<string, string> = {};
    campos.forEach((campo) => {
      inicial[campo.id] = "";
    });
    return inicial;
  });



  // Alteração: mensagem agora é objeto
  const [mensagem, setMensagem] = useState<{
    texto: string;
    tipo: "sucesso" | "erro";
  } | null>(null);
  const { id } = useParams();

  useEffect(() => {
    if (valorInicial) setFormData(valorInicial);
  }, []);

  const handleCloseModal = () => {
    closeModal(false);
  };

  const handleInputChange = (id: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value.toString(), // ✅ converte para string
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação das horas
    const horaLiga = Number(formData.horaLiga);
    if (horaLiga < 0 || horaLiga > 23) {
      setMensagem({
        texto: `Hora para ligar deve estar entre 0 e 23`,
        tipo: `erro`,
      });
      return;
    }

    if (formData.horaDesliga !== undefined) {
      const horaDesliga = Number(formData.horaDesliga);
      if (horaDesliga < 0 || horaDesliga > 23) {
        setMensagem({
          texto: "Hora para desligar deve estar entre 0 e 23",
          tipo: "erro",
        });
        return;
      }
    }

    try {
      if (id) {
        await AlimentadorAutomatico(Number(id), { ...formData, modo });
        setMensagem({
          texto: "Configuração enviada com sucesso!",
          tipo: "sucesso",
        });
      }
    } catch (err) {
      console.error("Erro ao enviar dados", err);
      setMensagem({
        texto: "Erro ao enviar configuração",
        tipo: "erro",
      });
    }
  };

  const usarGridDuasColunas = campos.length > 5;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[32rem] shadow-2xl relative">
        {/* Botão de Fechar */}
        <BotaoFechar onClick={handleCloseModal} />

        {/* Inputs */}
        <form
          className={`mt-6 text-black ${usarGridDuasColunas
              ? "grid grid-cols-2 gap-4"
              : "flex flex-col gap-4"
            }`}
          onSubmit={handleSubmit}
        >
          {campos.map((campo) => (
            <div className="flex flex-col" key={campo.id}>
              <label htmlFor={campo.id} className="scroll-mb-0.5 font-medium">
                {campo.label}
              </label>
              <input
                id={campo.id}
                type={campo.tipo}
                placeholder={campo.placeholder}
                className="border text-black border-gray-300 rounded px-3 py-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                value={formData[campo.id] ?? ""}
                min={campo.min}
                max={campo.max}
                onChange={(e) => handleInputChange(campo.id, e.target.value)}

              />
            </div>
          ))}

          {/* Botão de enviar ocupa as 2 colunas se for grid */}
          <div className={usarGridDuasColunas ? "col-span-2" : ""}>
            <Button className="w-full mt-2" type="submit">
              Configurar
            </Button>
          </div>
        </form>
        {/* Mensagem de sucesso/erro */}
        {mensagem && (
          <div
            className={`mt-4 text-center font-bold ${mensagem.tipo === "sucesso" ? "text-green-600" : "text-red-600"
              }`}
          >
            {mensagem.texto}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalConfiguracao;
