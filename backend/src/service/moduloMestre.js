import ModbusRTU from "modbus-serial";
const client = new ModbusRTU();

const config = {
  ip: "192.168.0.253",
  port: 502,
  id: 99,
  tempo: 2000,
};

const mapa_leitura = {
  alimentador: {
    address: 7,
    fields: [
      "selecionado",
      "HoraLiga",
      "HoraDesliga",
      "Setpoint",
      "TempoCiclo",
      "Temperatura",
      "Erro",
      "Posicao",
      "Hora",
      "Minuto",
      "Ciclos",
      "QuantReservatorio",
    ],
  },
  erros: {
    address: 19,
    fields: [
      "QtdErro1",
      "QtdErro2",
      "QtdErro3",
      "QtdErro4",
      "QtdErro5",
      "QtdErro6",
      "QtdErro7",
      "ComErro1",
      "ComErro2",
      "ComErro3",
      "ComErro4",
      "ComErro5",
      "ComErro6",
      "ComErro7",
    ],
  },
  monitor: {
    address: 33,
    fields: ["Umidade", "Temperatura"],
  },
};

const mapa_escrita = {
  address: 0,
  fields: ["Id", "HoraLiga", "HoraDesliga", "Setpoint", "TempoCiclo"],
};

async function conectarModuloMestre() {
  if (!config.ip) {
    console.log("IP do Modbus não definido!");
  }
  try {
    await client.connectTCP(config.ip, { port: config.port });
    client.setID(config.id);
    client.setTimeout(config.tempo);
    console.log("Conectado ao Modulo Mestre");
  } catch (err) {
    console.log("Erro na conexão:", err.message);
  }
}

function isConnected() {
  return client.isOpen;
}

async function setIpModuloMestre(ip) {
  if (client.isOpen) {
    client.close(() => {
      console.log("Conexão Modbus fechada para troca de IP.");
    });
  }
  config.ip = ip;
}

async function selecionarAlimentador(id) {
  if (!client.isOpen) await conectarModuloMestre();

  const indexId = mapa_escrita.fields.indexOf("Id");
  const regId = mapa_escrita.address + indexId;
  await client.writeRegister(regId, id);
}

async function lerTodosCampos() {
  try {
    if (!client.isOpen) await conectarModuloMestre();
    const respostaGeral = await client.readHoldingRegisters(7, 28);
    const dadosFormatados = {};

    Object.entries(mapa_leitura).forEach(([nomeDispositivo, config]) => {
      dadosFormatados[nomeDispositivo] = {};

      config.fields.forEach((campo, index) => {
        const endereco = config.address + index;
        const indice = endereco - 7;
        dadosFormatados[nomeDispositivo][campo.trim()] =
          respostaGeral.data[indice];
      });
    });

    return dadosFormatados;
  } catch (err) {
    console.error("Erro geral:", err.message);
  }
}

async function lerAlimentador(id) {
  if (!client.isOpen) await conectarModuloMestre();
  try {
    const index = mapa_escrita.fields.indexOf("Id");
    const registrador = mapa_escrita.address + index;
    await client.writeRegister(registrador, id);

    const response = await client.readHoldingRegisters(
      mapa_leitura.alimentador.address,
      mapa_leitura.alimentador.fields.length
    );
    const dados = {};
    mapa_leitura.alimentador.fields.forEach((campo, index) => {
      dados[campo.trim()] = response.data[index];
    });
    return dados;
  } catch (err) {
    console.error("Erro ao ler alimentador:", err.message);
    throw err;
  }
}

async function lerErros() {
  try {
    const response = await client.readHoldingRegisters(
      mapa_leitura.erros.address,
      mapa_leitura.erros.fields.length
    );
    const dados = {};
    mapa_leitura.erros.fields.forEach((campo, index) => {
      dados[campo.trim()] = response.data[index];
    });
    return dados;
  } catch (err) {
    console.error("Erro ao ler erros:", err.message);
    throw err;
  }
}

async function lerTemperaturaUmidade() {
  try {
    const response = await client.readHoldingRegisters(
      mapa_leitura.monitor.address,
      mapa_leitura.monitor.fields.length
    );
    const dados = {};
    mapa_leitura.monitor.fields.forEach((campo, index) => {
      dados[campo.trim()] = response.data[index];
    });
    return dados;
  } catch (err) {
    console.error("Erro ao ler monitor:", err.message);
    throw err;
  }
}

// Lê os registradores de escrita de um alimentador específico
async function getAlimentadorEscrita(id) {
  if (!client.isOpen) await conectarModuloMestre();

  const indexId = mapa_escrita.fields.indexOf("Id");
  const regId = mapa_escrita.address + indexId;
  await client.writeRegister(regId, id);

  const escrita = await client.readHoldingRegisters(
    mapa_escrita.address,
    mapa_escrita.fields.length
  );
  const dadosAlimentador = {};
  mapa_escrita.fields.forEach((campo, index) => {
    dadosAlimentador[campo.trim()] = escrita.data[index];
  });
  return dadosAlimentador;
}

let historicoLeituras = [];
let ultimaPosicaoSalva = {}; // Guarda a última posição salva

async function atualizarHistorico() {
  try {
    const dados = await lerTodosCampos();
    console.log(dados);
    historicoLeituras.push({ ...dados, timestamp: new Date().toISOString() });
    if (historicoLeituras.length > 30) historicoLeituras.shift();

    if (
      dados.alimentador?.selecionado &&
      dados.alimentador?.Posicao !== undefined &&
      dados.alimentador?.Posicao !==
        ultimaPosicaoSalva[dados.alimentador.selecionado]
    ) {
      await repository.salvaPosicao(
        dados.alimentador.selecionado,
        dados.alimentador.Posicao,
        dados.alimentador.Erro
      );
      ultimaPosicaoSalva[dados.alimentador.selecionado] =
        dados.alimentador.Posicao;
    }
  } catch (err) {
    console.log("Erro ao atualizar histórico:", err.message);
  }
}

// Atualiza o histórico a cada 1 segundos
setInterval(atualizarHistorico, 1000);

// Monitoramento ativo da conexão Modbus
setInterval(async () => {
  if (!client.isOpen) {
    console.log("[MONITOR] Modbus desconectado. Tentando reconectar...");
    await conectarModuloMestre();
  }
}, 5000);

function getHistoricoLeituras() {
  return historicoLeituras;
}

function getUltimoDeCadaID() {
  const ultimos = {};
  historicoLeituras.forEach((item) => {
    if (item.alimentador?.selecionado) {
      ultimos[item.alimentador.selecionado] = item;
    }
  });
  return Object.values(ultimos);
}

let escrevendo = false;
const filaEscrita = [];

async function adicionarNaFila(id, config, valor) {
  return new Promise((resolve, reject) => {
    filaEscrita.push({ id, config, valor, resolve, reject });
    processarFilaEscrita();
  });
}

async function processarFilaEscrita() {
  if (escrevendo || filaEscrita.length === 0) return;
  escrevendo = true;
  while (filaEscrita.length > 0) {
    const { id, config, valor, resolve, reject } = filaEscrita.shift();
    try {
      await escreverDispositivoInterno(id, config, valor);
      resolve();
    } catch (err) {
      reject(err);
    }
  }
  escrevendo = false;
}

// Função interna que faz a escrita real
async function escreverDispositivoInterno(id, config, valor) {
  const inicio = Date.now();

  if (!client.isOpen) await conectarModuloMestre();

  const indexId = mapa_escrita.fields.indexOf("Id");
  const regId = mapa_escrita.address + indexId;
  await client.writeRegister(regId, id);

  const indexCampo = mapa_escrita.fields.indexOf(config);
  if (indexCampo === -1) {
    throw new Error(`Configuração "${config}" não existe no ID ${id}!`);
  }
  const registrador = mapa_escrita.address + indexCampo;
  await client.writeRegister(registrador, valor);

  const leitura = await client.readHoldingRegisters(registrador, 1);
  console.log(
    `[DEBUG] Valor lido após escrita em id=${id}.${config} (reg ${registrador}): ${leitura.data[0]}`
  );
  const fim = Date.now();
  console.log(
    `[DEBUG] Escrita em id=${id}.${config} (${registrador}) valor=${valor} - Tempo: ${
      fim - inicio
    }ms\n`
  );
}

export default {
  lerTodosCampos,
  isConnected,
  getAlimentadorEscrita,
  setIpModuloMestre,
  getHistoricoLeituras,
  getUltimoDeCadaID,
  selecionarAlimentador,
  adicionarNaFila,
  lerAlimentador,
  lerErros,
  lerTemperaturaUmidade,
  conectarModuloMestre,
};

process.on("SIGINT", () => {
  console.log("Encerrando servidor...");
  if (client.isOpen) client.close();
  process.exit();
});
