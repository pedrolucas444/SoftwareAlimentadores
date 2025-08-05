import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import type { AlimentadorData } from "../../hook/HookAlimentador";

export default function ConfiguracoesAlimentador() {
  const [alimentadorData, setAlimentadorData] = useState<AlimentadorData | null>(null);
  const [cicloAtivo, setCicloAtivo] = useState(false);
  const [isLoading] = useState(false);
  const [editandoRacao, setEditandoRacao] = useState(false);
  const [novoTipoRacao, setNovoTipoRacao] = useState("");
  const [peixesMortos, setPeixesMortos] = useState("");
  const [mostrarRegistroPeixesMortos, setMostrarRegistroPeixesMortos] = useState(false);
  const [mostrarFinalizarCiclo, setMostrarFinalizarCiclo] = useState(false);
  const [mostrarIniciarCiclo, setMostrarIniciarCiclo] = useState(false);
  const [peixesRetirados, setPeixesRetirados] = useState("");
  const [pesoRetirado, setPesoRetirado] = useState("");
  const [tipoRetirada, setTipoRetirada] = useState<"quantidade" | "peso">("quantidade");
  const [motivoRetirada, setMotivoRetirada] = useState("");
  const [observacoes, setObservacoes] = useState("");
  
  // Estados para o formulário de novo ciclo
  const [dadosNovoCiclo, setDadosNovoCiclo] = useState({
    horaLiga: "",
    horaDesliga: "",
    dosePorCiclo: "",
    tempoCiclo: "",
    tipoRacao: "",
    quantidadePeixes: "",
    especie: ""
  });

  const handleSalvarRacao = () => {
    if (novoTipoRacao.trim() && alimentadorData) {
      setAlimentadorData(prev => ({
        ...prev!,
        tipoRacao: novoTipoRacao.trim()
      }));
      setEditandoRacao(false);
      setNovoTipoRacao("");
    }
  };

  const handleCancelarEdicaoRacao = () => {
    setEditandoRacao(false);
    setNovoTipoRacao("");
  };

  const handleRegistrarPeixesMortos = () => {
    const quantidade = parseInt(peixesMortos);
    if (quantidade > 0 && alimentadorData?.quantidadePeixes) {
      const novaQuantidade = Math.max(0, alimentadorData.quantidadePeixes - quantidade);
      setAlimentadorData(prev => ({
        ...prev!,
        quantidadePeixes: novaQuantidade
      }));
      setPeixesMortos("");
      setMostrarRegistroPeixesMortos(false);
      alert(`${quantidade} peixes mortos registrados. Quantidade atual: ${novaQuantidade}`);
    }
  };

  const handleFinalizarCiclo = () => {
    const quantidadeRetirada = parseInt(peixesRetirados);
    const peso = parseFloat(pesoRetirado);

    let msg = "";
    if (tipoRetirada === "quantidade" && quantidadeRetirada > 0) {
      msg = `Ciclo finalizado! Peixes retirados: ${quantidadeRetirada}`;
    } else if (tipoRetirada === "peso" && peso > 0) {
      msg = `Ciclo finalizado! Peso retirado: ${peso}kg`;
    }
    msg += `\nMotivo: ${motivoRetirada || "Não informado"}`;
    if (observacoes.trim()) msg += `\nObservações: ${observacoes}`;

    alert(msg);

    // Limpar dados e finalizar ciclo
    setAlimentadorData(null);
    setCicloAtivo(false);
    setPeixesRetirados("");
    setPesoRetirado("");
    setMotivoRetirada("");
    setObservacoes("");
    setMostrarFinalizarCiclo(false);
  };

  const handleIniciarCiclo = () => {
    const dados: AlimentadorData = {
      horaLiga: parseInt(dadosNovoCiclo.horaLiga),
      horaDesliga: parseInt(dadosNovoCiclo.horaDesliga),
      dosePorCiclo: parseInt(dadosNovoCiclo.dosePorCiclo),
      tempoCiclo: parseInt(dadosNovoCiclo.tempoCiclo),
      tipoRacao: dadosNovoCiclo.tipoRacao,
      quantidadePeixes: parseInt(dadosNovoCiclo.quantidadePeixes),
      especie: dadosNovoCiclo.especie
    };

    setAlimentadorData(dados);
    setCicloAtivo(true);
    setMostrarIniciarCiclo(false);
    
    // Limpar formulário
    setDadosNovoCiclo({
      horaLiga: "",
      horaDesliga: "",
      dosePorCiclo: "",
      tempoCiclo: "",
      tipoRacao: "",
      quantidadePeixes: "",
      especie: ""
    });
  };

  const handleCancelarIniciarCiclo = () => {
    setMostrarIniciarCiclo(false);
    setDadosNovoCiclo({
      horaLiga: "",
      horaDesliga: "",
      dosePorCiclo: "",
      tempoCiclo: "",
      tipoRacao: "",
      quantidadePeixes: "",
      especie: ""
    });
  };

  const isFormularioValido = () => {
    return Object.values(dadosNovoCiclo).every(value => value.trim() !== "") &&
           parseInt(dadosNovoCiclo.horaLiga) >= 0 && parseInt(dadosNovoCiclo.horaLiga) <= 23 &&
           parseInt(dadosNovoCiclo.horaDesliga) >= 0 && parseInt(dadosNovoCiclo.horaDesliga) <= 23 &&
           parseInt(dadosNovoCiclo.dosePorCiclo) > 0 &&
           parseInt(dadosNovoCiclo.quantidadePeixes) > 0 &&
           parseInt(dadosNovoCiclo.tempoCiclo) > 5;
  };

  // Se não há ciclo ativo, mostra apenas o botão para iniciar
  if (!cicloAtivo) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 mt-15 mb-10">
        <Card>
          <CardContent className="p-3">
            <h2 className="font-bold text-center text-lg mb-7">
              CONFIGURAÇÕES DO CICLO ATUAL
            </h2>
            <div className="text-center space-y-6">
              <p className="text-gray-500 text-lg">Nenhum ciclo ativo</p>
              <Button
                onClick={() => setMostrarIniciarCiclo(true)}
                className="px-6 py-3 text-lg bg-green-600 hover:bg-green-700"
              >
                Iniciar Novo Ciclo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Modal para iniciar novo ciclo */}
        {mostrarIniciarCiclo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-bold mb-4 text-black text-center">
                Configurar Novo Ciclo
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hora Liga (0-23):
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={dadosNovoCiclo.horaLiga}
                      onChange={(e) => setDadosNovoCiclo(prev => ({...prev, horaLiga: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                      placeholder="Ex: 8"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hora Desliga (0-23):
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={dadosNovoCiclo.horaDesliga}
                      onChange={(e) => setDadosNovoCiclo(prev => ({...prev, horaDesliga: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                      placeholder="Ex: 18"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dose por Ciclo (g):
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={dadosNovoCiclo.dosePorCiclo}
                      onChange={(e) => setDadosNovoCiclo(prev => ({...prev, dosePorCiclo: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                      placeholder="Ex: 500"
                    />
                  </div>
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tempo de Ciclo:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={dadosNovoCiclo.tempoCiclo}
                    onChange={(e) => setDadosNovoCiclo(prev => ({...prev, tempoCiclo: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                    placeholder="Ex: 150"
                  />
                </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Ração:
                  </label>
                  <input
                    type="text"
                    value={dadosNovoCiclo.tipoRacao}
                    onChange={(e) => setDadosNovoCiclo(prev => ({...prev, tipoRacao: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                    placeholder="Ex: Ração Premium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantidade de Peixes:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={dadosNovoCiclo.quantidadePeixes}
                    onChange={(e) => setDadosNovoCiclo(prev => ({...prev, quantidadePeixes: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                    placeholder="Ex: 150"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Espécie do Peixe:
                  </label>
                  <input
                    type="text"
                    value={dadosNovoCiclo.especie}
                    onChange={(e) => setDadosNovoCiclo(prev => ({...prev, especie: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                    placeholder="Ex: Tilápia do Nilo"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <Button
                    onClick={handleCancelarIniciarCiclo}
                  >
                    Cancelar
                  </Button>
                  
                  <Button
                    onClick={handleIniciarCiclo}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={!isFormularioValido()}
                  >
                    Iniciar Ciclo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 mt-15">
      <Card className="mb-12">
        <CardContent className="p-3">
          <h2 className="font-bold text-center text-lg mb-7">
            CONFIGURAÇÕES DO CICLO ATUAL
          </h2>

          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <div className="grid grid-cols-2 gap-4 text-lg space-y-3">
              <InfoItem label="HORA LIGA" value={alimentadorData?.horaLiga} />
              <InfoItem label="HORA DESLIGA" value={alimentadorData?.horaDesliga} />
              <InfoItem label="DOSE POR CICLO" value={alimentadorData?.dosePorCiclo} />
              <InfoItem label="TEMPO POR CICLO" value={alimentadorData?.tempoCiclo} />

              {/* Tipo de Ração Editável */}
              <div className="space-y-1 text-center">
                <label className="block font-medium">TIPO RAÇÃO</label>
                {editandoRacao ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={novoTipoRacao}
                      onChange={(e) => setNovoTipoRacao(e.target.value)}
                      placeholder={alimentadorData?.tipoRacao?.toString() || ""}
                      className="w-full px-2 py-1 border rounded text-black text-center"
                    />
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        onClick={handleSalvarRacao}
                        className="px-3 py-1 text-xs"
                      >
                        Salvar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelarEdicaoRacao}
                        className="px-3 py-1 text-xs"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="inline-block border-b border-gray-200 px-15 pb-0.5 text-center">
                      {alimentadorData?.tipoRacao ?? "Carregando..."}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setEditandoRacao(true)}
                      className="block mx-auto px-3 py-1 text-xs"
                    >
                      Editar
                    </Button>
                  </div>
                )}
              </div>

              {/* Quantidade de Peixes com botão para registrar mortos */}
              <div className="space-y-1 text-center">
                <label className="block font-medium">QUANTIDADE DE PEIXES</label>
                <div className="inline-block border-b border-gray-200 px-15 pb-0.5 text-center">
                  {alimentadorData?.quantidadePeixes ?? "Carregando..."}
                </div>
                <Button
                  size="sm"
                  onClick={() => setMostrarRegistroPeixesMortos(true)}
                  className="block mx-auto px-3 py-1 text-xs bg-red-600 hover:bg-red-700"
                >
                  Registrar Mortos
                </Button>
              </div>

              <InfoItem
                label="ESPÉCIE DO PEIXE"
                value={alimentadorData?.especie}
                fullWidth
              />
            </div>
          )}

          {/* Botão Finalizar Ciclo */}
          <div className="mt-6 flex justify-center">
            <Button
              onClick={() => setMostrarFinalizarCiclo(true)}
              className="px-6 py-3 text-lg bg-blue-600 hover:bg-blue-700"
            >
              Finalizar Ciclo
            </Button>
          </div>

          {/* Modal para registrar peixes mortos */}
          {mostrarRegistroPeixesMortos && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                <h3 className="text-lg font-bold mb-4 text-black text-center">
                  Registrar Peixes Mortos
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantidade de peixes mortos:
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={alimentadorData?.quantidadePeixes || 0}
                      value={peixesMortos}
                      onChange={(e) => setPeixesMortos(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                      placeholder="Digite a quantidade"
                    />
                  </div>
                  <div className="flex gap-3 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setMostrarRegistroPeixesMortos(false);
                        setPeixesMortos("");
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleRegistrarPeixesMortos}
                      className="bg-red-600 hover:bg-red-700"
                      disabled={!peixesMortos || parseInt(peixesMortos) <= 0}
                    >
                      Registrar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal para finalizar ciclo */}
          {mostrarFinalizarCiclo && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                <h3 className="text-lg font-bold mb-4 text-black text-center">
                  Finalizar Ciclo
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de retirada:
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="quantidade"
                          checked={tipoRetirada === "quantidade"}
                          onChange={(e) => setTipoRetirada(e.target.value as "quantidade")}
                          className="mr-2"
                        />
                        <span className="text-black">Por quantidade</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="peso"
                          checked={tipoRetirada === "peso"}
                          onChange={(e) => setTipoRetirada(e.target.value as "peso")}
                          className="mr-2"
                        />
                        <span className="text-black">Por peso (kg)</span>
                      </label>
                    </div>
                  </div>

                  {tipoRetirada === "quantidade" ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantidade de peixes retirados:
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={peixesRetirados}
                        onChange={(e) => setPeixesRetirados(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                        placeholder="Digite a quantidade de peixes"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Peso retirado (kg):
                      </label>
                      <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={pesoRetirado}
                        onChange={(e) => setPesoRetirado(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                        placeholder="Digite o peso em kg"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Motivo da retirada:
                    </label>
                    <input
                      type="text"
                      value={motivoRetirada}
                      onChange={(e) => setMotivoRetirada(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                      placeholder="Ex: Abate, Transferência, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Observações (opcional):
                    </label>
                    <textarea
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                      placeholder="Digite observações adicionais"
                      rows={2}
                    />
                  </div>

                  <div className="flex gap-3 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setMostrarFinalizarCiclo(false);
                        setPeixesRetirados("");
                        setPesoRetirado("");
                        setMotivoRetirada("");
                        setObservacoes("");
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleFinalizarCiclo}
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={
                        (tipoRetirada === "quantidade" && (!peixesRetirados || parseInt(peixesRetirados) <= 0)) ||
                        (tipoRetirada === "peso" && (!pesoRetirado || parseFloat(pesoRetirado) <= 0)) ||
                        !motivoRetirada.trim()
                      }
                    >
                      Finalizar
                    </Button>
                  </div>
                </div>
              </div>
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
