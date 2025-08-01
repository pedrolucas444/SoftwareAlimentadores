import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import type { AlimentadorData } from "../../hook/HookAlimentador";

export default function ConfiguracoesAlimentador() {
  const { id } = useParams();
  const [alimentadorData, setAlimentadorData] = useState<AlimentadorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000/ultimo-por-id");
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const dado = data.data?.find(
          (item: any) => String(item.id) === String(id)
        );
        if (dado) {
          setAlimentadorData(dado);
          setIsLoading(false);
        }
      } catch (err) {
        setAlimentadorData(null);
        setIsLoading(true);
      }
    };

    ws.onerror = () => {
      setAlimentadorData(null);
      setIsLoading(true);
    };

    return () => {
      ws.close();
    };
  }, [id]);

  return (
    <div className="max-w-2xl mx-auto space-y-4 mt-15">
      <Card>
        <CardContent className="p-3">
          <h2 className="font-bold text-center text-lg mb-7">
            CONFIGURAÇÃO ATUAL DA ALIMENTADOR
          </h2>

          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <div className="grid grid-cols-2 gap-4 text-lg space-y-3">
              <InfoItem label="HORA LIGA" value={alimentadorData?.horaLiga} />
              <InfoItem label="HORA DESLIGA" value={alimentadorData?.horaDesliga} />
              <InfoItem label="DOSE POR CICLO" value={alimentadorData?.dosePorCiclo} />
              <InfoItem label="SETPOINT" value={alimentadorData?.setPoint} />
              <InfoItem label="TIPO RAÇÃO" value={alimentadorData?.tipoRacao} />
              <InfoItem label="QUANTIDADE DE PEIXES" value={alimentadorData?.quantidadePeixes} />
              <InfoItem
                label="ESPÉCIE DO PEIXE"
                value={alimentadorData?.especie}
                fullWidth
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: number | string | undefined;
  fullWidth?: boolean;
}

function InfoItem({ label, value, fullWidth }: InfoItemProps) {
  return (
    <div className={`space-y-1 text-center ${fullWidth ? "col-span-2" : ""}`}>
      <label className="block font-medium">{label}</label>
      <div className="inline-block border-b border-gray-200 px-15 pb-0.5 text-center">
        {value ?? "Carregando..."}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 text-lg space-y-3 animate-pulse">
      <SkeletonItem />
      <SkeletonItem />
      <SkeletonItem />
      <SkeletonItem />
      <SkeletonItem fullWidth />
    </div>
  );
}

function SkeletonItem({ fullWidth }: { fullWidth?: boolean }) {
  return (
    <div className={`space-y-1 text-center ${fullWidth ? "col-span-2" : ""}`}>
      <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
      <div className="h-6 bg-gray-200 rounded w-full"></div>
    </div>
  );
}
