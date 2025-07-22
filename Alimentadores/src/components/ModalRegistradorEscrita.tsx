import React, { useEffect, useState } from "react";
import BotaoFechar from "./BotaoFechar";
import { ultimoID } from "../service/deviceService";
import { useParams } from "react-router-dom";

interface ModalRegistradorEscritaProps {
  closeModal: () => void;
}

const ModalRegistradorEscrita: React.FC<ModalRegistradorEscritaProps> = ({
  closeModal,
}) => {
  const [registros, setRegistros] = useState<any>(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const updateGavetaEscrita = async () => {
    setLoading(true);
    const data = await ultimoID();
    const registro = data?.data?.find(
      (item: any) => String(item.id) === String(id)
    );
    setRegistros(registro || null);
    setLoading(false);
  };

  useEffect(() => {
    if (id !== undefined) {
      updateGavetaEscrita();
    }
  }, [id]);

  const getModoLabel = (modo?: string | number) => {
    if (modo === "1" || modo === 1) return "Modo automático";
    if (modo === "2" || modo === 2) return "Modo manual";
    return modo?.toString() || "-";
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[28rem] shadow-2xl relative">
        <BotaoFechar onClick={closeModal} />
        <h2 className="text-lg font-bold mb-1 text-center text-black p-3">
          Registradores de Escrita
        </h2>
        {loading ? (
          <div className="text-center text-black">Carregando...</div>
        ) : registros ? (
          <ul className="text-sm text-black space-y-4 divide-y divide-gray-200">
            <li className="pb-1">
              <span className="font-semibold text-base">HORA LIGA</span>:{" "}
              {registros.horaLiga ?? "-"}
            </li>
            <li className="pb-1">
              <span className="font-semibold text-base">HORA DESLIGA</span>:{" "}
              {registros.horaDesliga ?? "-"}
            </li>
            <li className="pb-1">
              <span className="font-semibold text-base">TEMPO CICLO</span>:{" "}
              {registros.tempoCiclo ?? "-"}
            </li>
            <li className="pb-1">
              <span className="font-semibold text-base">TEMPO ABERTO</span>:{" "}
              {registros.tempoAberto ?? "-"}
            </li>
            <li className="pb-1">
              <span className="font-semibold text-base">SETPOINT</span>:{" "}
              {registros.setPoint ?? "-"}
            </li>
            <li className="pb-1">
              <span className="font-semibold text-base">MODO</span>:{" "}
              {getModoLabel(registros.modo)}
            </li>
            <li className="pb-1">
              <span className="font-semibold text-base">SETPOINT MANUAL</span>:{" "}
              {registros.posicao ?? "-"}
            </li>
          </ul>
        ) : (
          <div className="text-center text-black">Dados não disponíveis</div>
        )}
      </div>
    </div>
  );
};

export default ModalRegistradorEscrita;
