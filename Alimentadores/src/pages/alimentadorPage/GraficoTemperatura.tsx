import { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import type { ScriptableContext } from "chart.js";


const COLORS: string[] = [
  "rgb(140, 214, 16)",
  "rgb(239, 198, 0)",
  "rgb(231, 24, 49)",
];

function index(perc: number): number {
  return perc < 24 ? 0 : perc < 30 ? 1 : 2;
}

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

export default function GraficoTemperatura() {
  // Dados estáticos fictícios
  const temperaturaAtual = 26; // Temperatura fixa em 26°C
  const temperaturaMaxima = 35; // Temperatura máxima para o gráfico
  
  const [temperatura] = useState({
    labels: ["Temperatura Atual"],
    datasets: [
      {
        data: [temperaturaAtual, temperaturaMaxima - temperaturaAtual],
        backgroundColor: (ctx: ScriptableContext<"doughnut">) => {
          if (ctx.dataIndex === 1) return "#EAEAEA";
          return COLORS[index(temperaturaAtual)];
        },
      },
    ],
  });

  return (
    <div className="GraficoTemperatura">
      <h1 className="font-bold text-lg text-center">Temperatura 1</h1>
      <div className="w-80 h-52 flex flex-col items-center justify-center mt-10">
        <Doughnut className="mt-1" data={temperatura} options={optionsDoughnut} />
        <span className="font-bold text-4xl -mt-10">{temperaturaAtual}°C</span>
      </div>
    </div>
  );
}