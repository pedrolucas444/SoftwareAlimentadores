import { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import type { ScriptableContext } from "chart.js";

const optionsDoughnut = {
  aspectRatio: 2,
  circumference: 180,
  rotation: -90,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
    datalabels: {
      display: false,
    },
  },
};

export default function GraficoQuantidadeRacao() {
  // Dados estáticos fictícios
  const quantidadeRacaoAtual = 500; // Quantidade atual em gramas
  const quantidadeRacaoMaxima = 1000; // Quantidade máxima para o gráfico

  const [quantidadeRacao] = useState({
    labels: ["Quantidade de Ração"],
    datasets: [
      {
        data: [quantidadeRacaoAtual, quantidadeRacaoMaxima - quantidadeRacaoAtual],
        backgroundColor: (ctx: ScriptableContext<"doughnut">) => {
          if (ctx.dataIndex === 1) return "#EAEAEA";
          return "rgb(139, 69, 19)";
        },
      },
    ],
  });

  return (
    <div className="GraficoQuantidadeRacao">
      <h1 className="font-bold text-lg text-center">Quantidade de Ração</h1>
      <div className="w-80 h-52 flex flex-col items-center justify-center mt-10">
        <Doughnut className="mt-1" data={quantidadeRacao} options={optionsDoughnut} />
        <span className="font-bold text-4xl -mt-10">{quantidadeRacaoAtual}g</span>
      </div>
    </div>
  );
}