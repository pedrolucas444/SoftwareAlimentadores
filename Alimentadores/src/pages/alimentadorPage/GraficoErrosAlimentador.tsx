import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Switch } from "../../components/ui/switch";
import { useParams } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import type { ScriptableContext } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const dataGauge = (erro: number) => ({
  labels: [],
  datasets: [
    {
      data: [erro],
      backgroundColor: (ctx: ScriptableContext<"doughnut">) => {
        return ctx.dataIndex === 0
          ? erro > 0
            ? "rgb(231, 24, 49)"
            : "rgb(234, 234, 234)"
          : "#EAEAEA";
      },
      borderWidth: 0,
      cutout: "60%",
    },
  ],
});

const optionsGauge = {
  aspectRatio: 2,
  circumference: 360,
  rotation: -90,
  animation: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
    datalabels: {
      display: false,
    },
  },
};

export default function GraficoErrosAlimentador({
  mostrarTabelaErros,
  setMostrarTabelaErros,
}: {
  mostrarTabelaErros: boolean;
  setMostrarTabelaErros: (value: boolean) => void;
}) {
  const { id } = useParams();
  const [erro, setErro] = useState<number>(0);

  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimeout: number;

    function connect() {
      ws = new WebSocket("ws://localhost:3000/ultimo-por-id");

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // Filtra pelo ID desejado
          const dado = data.data?.find(
            (item: any) => String(item.id) === String(id)
          );
          setErro(dado?.erro ?? 0);
        } catch {
          setErro(0);
        }
      };

      ws.onerror = () => {
        setErro(0);
        ws.close();
      };

      ws.onclose = () => {
        reconnectTimeout = window.setTimeout(connect, 2000); // reconecta após 2s
      };
    }

    connect();

    return () => {
      clearTimeout(reconnectTimeout);
      if (ws) ws.close();
    };
  }, [id]);

  return (
    <div className="GraficoErrosAlimentador">
      <h2 className="font-bold text-lg mb-2 text-center">
        IDENTIFICADOR DE ERROS
      </h2>
      <div className="relative w-96 h-60 flex items-center justify-center">
        <Doughnut
          className="mt-1"
          data={dataGauge(erro)}
          options={optionsGauge}
        />
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-5xl text-center">
          {erro}
        </span>
      </div>
      <div className="flex items-center justify-center mt-4 space-x-2">
        <Switch
          checked={mostrarTabelaErros}
          onCheckedChange={setMostrarTabelaErros}
          className="scale-125"
        />
        <span className="text-md text-black font-medium pl-2">
          Tabela de Erros
        </span>
      </div>
    </div>
  );
}