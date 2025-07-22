import React, { useState } from "react";
import { Button } from "./ui/button";
import BotaoFechar from "./BotaoFechar";
import { AtualizaIP } from "../service/deviceService";

function ModalIp({ closeModal }: { closeModal: (open: boolean) => void }) {
  const [ip, setIp] = useState("");
  const [mensagem, setMensagem] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensagem(null);
    setMensagem(await AtualizaIP(ip));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[32rem] shadow-2xl relative">
        <BotaoFechar onClick={() => closeModal(false)} />
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h2 className="font-semibold text-base mb-2 flex justify-center">
            IP DO MÓDULO MESTRE
          </h2>
          <input
            id="ip"
            type="text"
            placeholder="Ex: 192.168.0.240"
            className="border border-gray-300 rounded px-3 py-2 w-full"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
          />
          <Button className="w-full" type="submit">
            Configurar
          </Button>
        </form>
        {mensagem && (
          <div className="mt-4 text-center text-green-600 font-bold">
            {mensagem}
          </div>
        )}
      </div>
    </div>
  );
}

export default ModalIp;
