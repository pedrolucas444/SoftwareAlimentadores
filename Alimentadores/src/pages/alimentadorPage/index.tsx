import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

// componentes UI e imagens
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Switch } from "../../components/ui/switch";
import alimentador from "../../assets/controlFeed.png";
import IotControl from "../../assets/IOT_CONTROL_BRANCA.png";
import ControlFeed from "../../assets/LOGO_CONTROLFEED_BRANCA_E_VERDE.png";

// grandes componentes
import GraficoTemperatura from "./GraficoTemperatura";
import GraficoErrosAlimentador from "./GraficoErrosAlimentador";
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
import { PararAlimentador, EnviarModoAlimentador, } from "../../service/deviceService";
import ContadorSaidas from "../../components/ContadorSaidas";
import GraficoQuantidadeRacao from "./GraficoQuantidadeRacao";

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
  const { id } = useParams();
  const [modalAberto, setModalAberto] = useState(false);
  const [modalSetpointManualAberto, setModalSetpointManualAberto] = useState(false);
  const [mostrarTabelaErros, setMostrarTabelaErros] = useState(false);
  const { Alimentador } = useAlimentadorData();
  const [modalRegistrosAberto, setModalRegistrosAberto] = useState(false);
  const [modoWS, setModoWS] = useState<number | null>(null);
  const { setpointManualAtivo, setSetpointManualAtivo } = useModoStore();
  const [ciclosWS, setCiclosWS] = useState<number | null>(null);
  const wsCiclosRef = useRef<WebSocket | null>(null);
  const [numberID, setNumberID] = useState("");
  const [erroID, setErroID] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (Number(numberID) > 0) {
      setErroID(null);
      navigate(`/alimentador/${numberID}`);
    } else {
      setErroID("Número precisa ser maior que zero");
      setTimeout(() => setErroID(null), 3000);
    }
  };

  const valoresIniciais = {
    horaLiga: Alimentador?.horaLiga ?? 0,
    horaDesliga: Alimentador?.horaDesliga ?? 0,
    setPoint: Alimentador?.dosePorCiclo ?? 0,
    tempoCiclo: Alimentador?.quantidade ?? 0,
  };

  // Agora passando o id para o backend
  const enviarModo = async (modo: number) => {
    if (id) await EnviarModoAlimentador(modo, Number(id));
  };

  const pararAlimentador = async () => {
    if (id) await PararAlimentador(Number(id));
  };

  // Agora o handler só recebe o valor booleano
  const handleSwitchChange = (isManual: boolean) => {
    setSetpointManualAtivo(isManual);
    if (isManual) {
      localStorage.setItem("switchMode", "manual");
      enviarModo(2);
      pararAlimentador();
    } else {
      localStorage.removeItem("switchMode");
      enviarModo(1);
    }
  };

  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimeout: number;

    function connect() {
      ws = new WebSocket("ws://localhost:3000/ultimo-por-id");
      wsCiclosRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const dado = data.data?.find(
            (item: any) => String(item.id) === String(id)
          );
          setCiclosWS(dado?.ciclos ?? null);
          setModoWS(dado?.modo ?? null);
        } catch {
          setCiclosWS(null);
        }
      };

      ws.onerror = () => {
        setCiclosWS(null);
        ws.close();
      };

      ws.onclose = () => {
        reconnectTimeout = setTimeout(connect, 2000); // tenta reconectar após 2s para evitar erros de carregamento
      };
    }

    connect();

    return () => {
      clearTimeout(reconnectTimeout);
      if (ws) ws.close();
    };
  }, [id]);

  useEffect(() => {
    enviarModo(setpointManualAtivo ? 2 : 1);
    if (setpointManualAtivo) pararAlimentador();
    // eslint-disable-next-line
  }, [setpointManualAtivo, id]);

  useEffect(() => {
    const savedMode = localStorage.getItem("switchMode");
    if (savedMode === "manual") {
      setSetpointManualAtivo(true);
      enviarModo(2);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <MySidebar />
      <div className="fixed bottom-4 right-4 z-50">
        <ContadorSaidas />
      </div>

      <div className="absolute right-0 ">
        <Card className="w-64 shadow-lg rounded-none border-3 border-emerald-400 border-t-0 border-r-0">
          <CardContent className="p-3 pt-1 flex flex-col items-center space-y-3">
            <img
              src={alimentador}
              alt="Alerta"
              className="w-full h-36 object-contain"
            />
            <h3 className="font-semibold text-lg text-center leading-snug">
              Control Feed ID: <span>{id}</span>
            </h3>
            <div className="flex flex-col gap-1 mb-4">
              <div className="flex items-center gap-2">
                <input
                  className="w-48 px-4 py-2 border border-b-gray-900-500 rounded-lg bg-white text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition placeholder-gray-400"
                  type="number"
                  placeholder="Digite o ID do alimentador"
                  value={numberID}
                  onChange={(e) => setNumberID(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleNavigate();
                  }}
                />
              </div>
              {erroID && <span className="text-red-600 text-sm">{erroID}</span>}
            </div>
            <div className="flex justify-center mt-4">
              <Switch
                checked={setpointManualAtivo}
                onCheckedChange={handleSwitchChange}
                className="mt-1 mr-4 scale-125"
              />
              <h1>{setpointManualAtivo ? "Modo Manual" : "Modo Automático"}</h1>
            </div>
            <Button
              className="w-full mt-4"
              onClick={() => setModalRegistrosAberto(true)}
            >
              Ver registradores atualizados
            </Button>
            {modalRegistrosAberto && (
              <ModalRegistradorEscrita
                closeModal={() => setModalRegistrosAberto(false)}
              />
            )}
            <StatusModo modo={modoWS} />
            <div className="space-y-1 text-center col-span-2 mx-auto mt-5">
              <label className="block font-medium">Quantidade de ciclos</label>
              <div className="inline-block border-b border-gray-200 px-15 pb-0.5 space-y-1 text-center">
                {ciclosWS === null ? "Carregando..." : ciclosWS}
              </div>
            </div>
            <Button
              className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-bold"
              onClick={pararAlimentador}
            >
              Parar Alimentador
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="min-h-screen bg-primary text-white p-4">
        <div className="flex justify-center items-center mt-5 gap-10 w-full">
          <div className="h-25 flex items-center">
            <img
              src={ControlFeed}
              alt="Control Feed"
              className="max-h-full w-auto object-contain "
            />
          </div>
          <div className="h-24 flex items-center">
            <img
              src={IotControl}
              alt="Iot Control"
              className="max-h-full w-auto object-contain"
            />
          </div>
        </div>

        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex justify-center mt-10 space-x-4">
            <Card className="flex-1">
              <CardContent className="pb-4 pt-2 px-10 flex flex-col items-center">
                <GraficoTemperatura />
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardContent className="pb-4 pt-2 px-10 flex flex-col items-center">
                <GraficoQuantidadeRacao />
              </CardContent>
            </Card>
            
          </div>
          <div className="flex justify-center mt-18">
            <Card className="w-1/2">
              <CardContent className="pb-4 pt-2 px-10 flex flex-col items-center">
                <GraficoErrosAlimentador
                  mostrarTabelaErros={mostrarTabelaErros}
                  setMostrarTabelaErros={setMostrarTabelaErros}
                />
              </CardContent>
            </Card>
          </div>
          {mostrarTabelaErros && (
            <div className="mb-20">
              <TabelaDeErros tituloTabela="Erros da Válvula" erros={erros} />
            </div>
          )}

          {/* <Card className="mt-10">
            <CardContent className="p-4 flex flex-col items-center">
              <h2 className="font-bold text-lg mb-6 text-center">Quantidade de ração</h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-50">
                <div className="w-80 h-80">
                  <Doughnut data={dataQuantidadeRacao} options={optionsQuantidade} />
                </div>
                <div className="w-80 h-80">
                  <Doughnut data={dataQuantidadeRacao} />
                </div>
              </div>
            </CardContent>
          </Card> */}

          {setpointManualAtivo ? (
            <ConfiguracoesAlimentadorManual />
          ) : (
            <ConfiguracoesAlimentador />
          )}

          {modalAberto && (
            <ModalConfiguracao
              closeModal={() => setModalAberto(false)}
              campos={campos}
              dispositivo="alimentador"
              valorInicial={valoresIniciais}
              modo={1}
            />
          )}

          {modalSetpointManualAberto && (
            <ModalSetpointManual
              closeModal={() => setModalSetpointManualAberto(false)}
              modo={2}
            />
          )}

        </div>
      </div>
      <Footer />
    </>
  );
}
