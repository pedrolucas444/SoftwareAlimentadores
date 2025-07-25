import { useEffect, useState, useRef } from "react";
import { Doughnut } from "react-chartjs-2";
import { useParams } from "react-router-dom";
import { registraTemperatura } from "../../service/deviceService";

const optionsGauge = {
    aspectRatio: 2,
    circumference: 180,
    rotation: -90,
    plugins: {
        legend: { display: false },
        tooltip: { enabled: true },
        datalabels: { display: false },
    },
};

type TemperaturaData = {
    id: number;
    temperatura: number;
    modo: number;
};

export default function GraficoTemperatura() {
    const { id } = useParams();
    const [temperatura, setTemperatura] = useState<{
        labels: string[];
        datasets: { data: number[]; backgroundColor: string[] }[];
    } | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const ultimaTemperaturaEnviada = useRef<number | null>(null);
    const [modo, setModo] = useState<number | null>(null);

    useEffect(() => {
        let ws: WebSocket;
        let reconnectTimeout: number;

        function connect() {
            ws = new WebSocket("ws://localhost:3000/ultimo-por-id");
            wsRef.current = ws;

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    const dado = data.data?.find(
                        (item: TemperaturaData) => String(item.id) === String(id)
                    );
                    if (dado && typeof dado.temperatura === "number") {
                        const temperaturaCorrigida = Math.max(0, Math.min(100, dado.temperatura));
                        setTemperatura({
                            labels: ["Temperatura Atual"],
                            datasets: [
                                {
                                    data: [temperaturaCorrigida, 100 - temperaturaCorrigida],
                                    backgroundColor: ["#00C49F", "#EAEAEA"],
                                },
                            ],
                        });
                        setModo(dado.modo ?? null);
                    }
                } catch {
                    // Em caso de erro, pode exibir mensagem de erro, mas não zera o estado
                }
            };

            ws.onerror = () => {
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
        <div className="GraficoPosicao">
            <h2 className="font-bold text-lg mb-2 text-center">TEMPERATURA DO ALIMENTADOR</h2>
            <div className="w-80 h-52 flex flex-col items-center justify-center">
                {temperatura ? (
                    <>
                        <Doughnut className="mt-18" data={temperatura} options={optionsGauge} />
                        <span className="font-bold text-4xl -mt-10">
                            {temperatura.datasets[0].data[0]}%
                        </span>
                    </>
                ) : (
                    <span className="text-gray-500">Carregando dados...</span>
                )}
            </div>
        </div>
    );
}