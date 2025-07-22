import { useState } from "react";
import { Home, ChevronLeft, Download } from "lucide-react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import StatusConexao from "./StatusConexao";
import { Button } from "../components/ui/button";
import moduloMestre from "../assets/monitorTemperatura.png";
import ModalIp from "./ModalIp";
import alimentador from "../assets/controlFeed.png";
export default function AppSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [modalIpAberto, setModalIpAberto] = useState(false);

  return (
    <>
      {/* Sidebar fixa no lado esquerdo */}
      <aside
  className={`
    fixed top-0 left-0 h-screen bg-white border-r border-gray-200
    transition-transform duration-300 z-10 w-80 flex flex-col
    ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Cabeçalho com logo */}
        <div className="p-4 border-b border-gray-200 flex items-center gap-3">
          {isOpen && <img src={logo} alt="Logo WBM" className="h-36 w-auto ml-2" />}
        </div>

  {/* Navegação - flex-1 para ocupar espaço disponível */}
  <nav className="px-2 py-4 flex-1">
    <ul className="space-y-1">
      <li>
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 border-2 border-gray-400"
        >
          <Home className="w-5 h-5" />
          {isOpen && <span>Home</span>}
        </Link>
      </li>
      <li>
        <a
          href="http://localhost:3000/moduloMestre/exportar/gaveta"
          className="flex items-center mt-2 gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 border-2 border-gray-400"
          download
        >
          <Download className="w-5 h-5" />
          {isOpen && <span>Configuração</span>}
        </a>
      </li>
      <li>
        <a
          href="http://localhost:3000/moduloMestre/exportar/nova_posicao_gaveta"
          className="flex items-center mt-2 gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 border-2 border-gray-400"
          download
        >
          <Download className="w-5 h-5" />
          {isOpen && <span>Movimentação</span>}
        </a>
      </li>
    </ul>
    
    {/* Div do módulo mestre */}
    <div className="mt-2">
      <img
        src={moduloMestre}
        alt="Alerta"
        className="
      w-full
      h-auto
      object-contain
      min-h-[100px]
      max-h-[18vh]
    "
      />
      <h3 className="font-semibold text-lg text-center leading-snug">
        Módulo Mestre
      </h3>

      <StatusConexao />

      <div className="flex justify-center w-full mt-4">
        <Button
          className="w-[50%] flex items-center justify-center transition-all duration-150 hover:scale-105"
          type="button"
          onClick={() => setModalIpAberto(true)}
        >
          Configurar
        </Button>
      </div>
    </div>
  </nav>

  {/* Imagem da válvula sempre no final */}
  <div className="mt-auto mb-18">
  <img
    src={alimentador}
    alt="Válvula Gaveta"
    className="
      w-full
      h-auto
      object-contain
      min-h-[140px]
      max-h-[28vh]
    "
  />
</div>






  {/* Botão de toggle */}
  <button
    onClick={() => setIsOpen(!isOpen)}
    className="absolute top-4 right-[-20px] p-2 bg-white border border-gray-300 hover:shadow-md rounded-full"
    aria-label="Toggle Sidebar"
  >
    <ChevronLeft className="w-4 h-4 text-gray-600" />
  </button>
</aside>
      {modalIpAberto && <ModalIp closeModal={setModalIpAberto} />}
    </>
  );
}