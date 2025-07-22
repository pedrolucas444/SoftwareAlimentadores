
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

// componentes UI e imagens
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Switch } from "../../components/ui/switch";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import alimentador from "../../assets/controlFeed.png";
import IotControl from "../../assets/IOT_CONTROL_BRANCA.png";

// grandes componentes
import ConfiguracoesAlimentador from "./ConfiguracoesAlimentador";
import ConfiguracoesAlimentadorManual from "./ConfiguracoesAlimentadorManual";
import Footer from "../../components/Footer";
import TabelaDeErros from "../../components/TabelaDeErros";
import ModalConfiguracao from "../../components/ModalConfigurar";
import type { CampoConfiguracao } from "../../components/ModalConfigurar";
import ModalSetpointManual from "../../components/ModalSetpointManual";
import MySidebar from "../../components/MySidebar";
import StatusModo from "../../components/StatusModo";
import ModalRegistradorEscrita from "../../components/ModalRegistradorEscrita";
import useModoStore from "../../store/useModoStore";
import { useAlimentadorData } from "../../hook/HookAlimentador";
import {
  PararAlimentador,
  EnviarModoAlimentador,
} from "../../service/deviceService";
import ContadorSaidas from "../../components/ContadorSaidas";



ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ChartDataLabels);

const erros = [
  { titulo: "ERRO 0: SEM ERRO", detalhe: "Sem erro" },
  { titulo: "ERRO 1: MOTOR NÃO FUNCIONOU", detalhe: "Sem erro aparente" },
  { titulo: "ERRO 2: TEMPO EXCEDIDO", detalhe: "Erro detectado" },
  { titulo: "ERRO 3: MOTOR TRAVADO", detalhe: "Erro detectado" },
  { titulo: "ERRO 4: SENSOR COM DEFEITO", detalhe: "Sem erro aparente" },
  { titulo: "ERRO 5: ALIMENTADOR VAZIO", detalhe: "Sem erro aparente" },
  { titulo: "ERRO 6: QUANTIDADE BAIXA", detalhe: "Sem erro aparente" },
];

const campos: CampoConfiguracao[] = [
  {
    id: "horaLiga",
    label: "DEFINIR HORA A LIGAR",
    placeholder: "8",
    tipo: "number",
    min: 0,
    max: 23,
  },
  {
    id: "horaDesliga",
    label: "DEFINIR HORA A DESLIGAR",
    placeholder: "18",
    tipo: "number",
    min: 0,
    max: 23,
  },
  { 
    id: "dosePorCiclo", 
    label: "DOSE POR CICLO (g)", 
    placeholder: "500", 
    tipo: "number",
    min: 1,
  },
  {
    id: "duracaoCiclo",
    label: "DURAÇÃO DO CICLO (min)",
    placeholder: "15",
    tipo: "number",
    min: 1,
  },
];




export default function Alimentador() {
  // const [modalAberto, setModalAberto] = useState(false);

  return (
    <>
      <MySidebar />
      {/* Card equipamento */}
      <div className="absolute right-0 ">
        <Card className="w-64 shadow-lg rounded-none border-3 border-emerald-400 border-t-0 border-r-0">
          <CardContent className="p-3 pt-1 flex flex-col items-center space-y-3">
            <img
              src={alimentador}
              alt="Alerta"
              className="w-full h-36 object-contain"
            />
            <h3 className="font-semibold text-lg text-center leading-snug">
              Alimentador Control Feed
            </h3>
            {/* <Button className="w-full" type="submit" onClick={() => setModalAberto(true)}>
              Configurar
            </Button> */}
          </CardContent>
        </Card>
      </div>

      <div className="min-h-screen bg-primary text-white p-4">
      <h1 className="text-3xl font-bold mb-6 text-center mt-5">Control Feed</h1>

        <div className="max-w-5xl mx-auto space-y-4">
          {/* Grafico de temperatura */}
          <div className="flex justify-center mt-10">
            <Card>
              <CardContent className="pb-4 pt-2 pl-25 pr-25 flex flex-col items-center">
                <h2 className="font-bold text-lg mb-2 text-center">Temperatura</h2>
                <div className="flex items-center justify-center w-full">
                  <div className="w-64 h-64">
                    <Doughnut data={dataTemperatura} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>



          {/* Graficos de Quantidade */}
                  <Card className="mt-10">
                      <CardContent className="p-4 flex flex-col items-center">
                          <h2 className="font-bold text-lg mb-6 text-center">Quantidade</h2>
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-50">
                              <div className="w-80 h-80">
                                    <Doughnut data={dataQuantidadeporc} options={optionsQuantidade} />
                              </div>
                              <div className="w-80 h-80">
                                  <Doughnut data={dataQuantidade} />
                              </div>
                          </div>
                      </CardContent>
                  </Card>



            {/* Configurações Do Alimentador*/}
            <ConfiguracoesAlimentador />

            {/* Nova Tabela de Erros*/}
            <div className="mb-20">
            <TabelaDeErros tituloTabela="Erros do Alimentador" erros={erros} />
            </div>
           
            {/* {modalAberto && <ModalConfiguracao closeModal={() => setModalAberto(false)} campos={campos} />} */}

        </div>
      </div>             
      <Footer />
    </>
  );
}
