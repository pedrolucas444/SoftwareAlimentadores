import { Card, CardContent } from "../../components/ui/card";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import planta from "../../assets/plantaArq.png";
import alimentador from "../../assets/controlFeed.png";
import logoWBM from "../../assets/LOGO-OFC-WBM-2.0.png";
import saaeItabirito from "../../assets/logo itabirito2.png";
import IotControl from "../../assets/Iot_Control_preta.png";
import { useEffect, useState } from "react";
// import ContadorSaidas from "../../components/ContadorSaidas"; // Importe o componente do contador

export default function Painel() {
  const [dados, setDados] = useState<any>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const ws = new WebSocket("ws://localhost:3000/ultimo-por-id");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setDados(data.data[0]);
    };

    ws.onopen = () => console.log("WebSocket conectado!");
    ws.onclose = () => console.log("WebSocket desconectado!");

    return () => {
      ws.close();
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <>
      {/* Header */}
      <div className="bg-white flex flex-row justify-center items-center w-full gap-x-50 mt-3 mb-3">
        <img src={logoWBM} alt="Logo WBM" className="h-32 w-auto mt-2" />
        <img src={saaeItabirito} alt="Saae Itabirito" className="h-28 w-auto" />
        <img src={IotControl} alt="Iot Control" className="h-28 w-auto" />
      </div>

      <div className="flex flex-col min-h-screen bg-gray-400 text-white relative">
        {/* Card Principal e restante do conteúdo */}
        <div className="flex w-full gap-8 flex-1">
          <div className="flex-1 flex flex-col items-end">
            <Card className="w-full h-full border-none shadow-none bg-transparent">
              <CardContent className="p-4 flex flex-col items-center h-full">
                <div className="w-full flex justify-center items-start">
                  <div className="relative w-full max-w-5xl">
                    <img
                      src={planta}
                      alt="Exemplo"
                      className="w-full h-auto"
                      style={{
                        maxHeight: 800,
                        maxWidth: 1400,
                      }}
                    />
                    <div className="absolute bg-white bg-opacity-90 rounded-2xl shadow p-4 bottom-70 right-280 h-48 flex flex-col items-center min-w-xs min-h-[250px]">
                      <div className="w-full flex flex-col items-center mb-2">
                        <span className="text-black text-lg font-bold flex items-center gap-2">
                          ALIMENTADOR 1
                          {Number(dados?.erro) > 0 && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="22"
                              height="22"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-triangle-alert-icon ml-2 text-yellow-500"
                            >
                              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
                              <path d="M12 9v4" />
                              <path d="M12 17h.01" />
                            </svg>
                          )}
                        </span>
                        <div className="w-full border-b-2 border-black mt-1"></div>
                      </div>
                      <table className="text-base w-full">
                        <tbody>
                          <tr className="h-12 align-middle">
                            <td className="font-semibold pr-4 text-black">
                              POSIÇÃO:
                            </td>
                            <td>
                              <div className="bg-white text-center px-4 py-2 my-2 shadow">
                                {dados?.posicao ?? "-"}
                              </div>
                            </td>
                          </tr>
                          <tr className="h-12 align-middle">
                            <td className="font-semibold pr-4 text-black">
                              MODO:
                            </td>
                            <td>
                              <div className="bg-white text-center px-4 py-2 my-2 shadow">
                                {dados?.modo === 1
                                  ? "Automático"
                                  : dados?.modo === 2
                                    ? "Manual"
                                    : "-"}
                              </div>
                            </td>
                          </tr>
                          <tr className="h-12 align-middle">
                            <td className="font-semibold pr-4 text-black">
                              ERRO:
                            </td>
                            <td>
                              <div className="bg-white text-center px-4 py-2 my-2 shadow">
                                <span
                                  className={
                                    dados?.erro && dados.erro !== 0
                                      ? "text-red-600 font-bold"
                                      : ""
                                  }
                                >
                                  {dados?.erro === 0
                                    ? "Nenhum"
                                    : dados?.erro ?? "-"}
                                </span>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="absolute right-233 bottom-75 white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="180"
                        height="40"
                        viewBox="0 0 108 24"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-move-right-icon lucide-move-right"
                      >
                        <path d="M102 8L106 12L102 16" />
                        <path d="M2 12H106" />
                      </svg>
                    </div>
                    <button
                      className="absolute cursor-pointer bottom-70 left-22"
                      onClick={() => (window.location.href = "/alimentador/1")}
                      data-tooltip-id="equipamento-1"
                      data-tooltip-content="ID: Equipamento 1"
                    >
                      <img src={alimentador} alt="Botão 1" className="w-24 h-24" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contador no canto inferior direito */}
        {/* <div className="fixed bottom-4 right-4 z-50">
          <ContadorSaidas />
        </div> */}

        <Tooltip id="equipamento-1" />
      </div>
    </>
  );
}