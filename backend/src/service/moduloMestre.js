import ModbusRTU from "modbus-serial";
const client = new ModbusRTU();

const config = {
  ip: "192.168.0.250",
  port: 502,
  id: 99,
  tempo: 2000,
};

const mapa_leitura = {
  alimentador: {
    address: 7,
    fields: [
      "id",
      "horaLiga",
      "horaDesliga",
      "setPoint",
      "tempoCiclo",
      "temperatura",
      "erro",
      "posicao",
      "hora",
      "minuto",
      "ciclos",
      "quantReservatorio",
    ],
  },
  erros: {
    address: 19,
    fields: [
      "qtdErro1",
      "qtdErro2",
      "qtdErro3",
      "qtdErro4",
      "qtdErro5",
      "qtdErro6",
      "qtdErro7",
      "comErro1",
      "comErro2",
      "comErro3",
      "comErro4",
      "comErro5",
      "comErro6",
      "comErro7",
    ],
  },
  monitor: {
    address: 33,
    fields: ["umidade", "temperatura"],
  },
};

const mapa_escrita = {
  address: 0,
  fields: ["id", "horaLiga", "horaDesliga", "setpoint", "tempoCiclo"],
};

async function conectarModuloMestre() {
  if (!config.ip) {
    console.log("IP do Modbus diferente do atual!");
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

function setIpModuloMestre(ip) {
  if (client.isOpen) {
    client.close(() => {
      console.log("Conexão Modbus fechada para troca de IP.");
    });
  }
  config.ip = ip;
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
  const pares = getUltimoCadaID();
  const encontrado = pares.find(
    ([chave, item]) => Number(item.alimentador?.id) === Number(id)
  );
  return encontrado ? encontrado[1] : null;
}

async function lerErrosAlimentador(id) {
  const pares = getUltimoCadaID();
  const encontrado = pares.find(
    ([chave, item]) => Number(item.alimentador?.id) === Number(id)
  );
  return encontrado ? encontrado[1].erros?.[campo] : null;
}

async function lerTemperaturaUmidade(id) {
  const pares = getUltimoCadaID();
  const encontrado = pares.find(
    ([chave, item]) => Number(item.alimentador?.id) === Number(id)
  );
  return encontrado ? encontrado[1].monitor : null;
}

let historicoLeituras = [];

async function atualizarHistorico() {
  try {
    const dados = await lerTodosCampos();
    historicoLeituras.push({ ...dados, timetamp: new Date().toISOString() });
    if (historicoLeituras.length > 30) historicoLeituras.shift();
  } catch (err) {
    console.log("Erro ao ler alimentador", err.message);
  }
}
setInterval(atualizarHistorico, 1000);

function getHistoricoLeituras() {
  return historicoLeituras;
}

function getUltimoCadaID() {
  const ultimos = {};
  historicoLeituras.forEach((item) => {
    const id = item.alimentador?.id;
    if (id !== undefined) {
      ultimos[id] = item;
    }
  });
  return Object.entries(ultimos);
}

// Fila de escrita universal
let escrevendo = false;
const filaEscrita = [];

// Remove comandos antigos do mesmo tipo antes de adicionar um novo
async function escreverDispositivo(dispositivo, config, valor) {
  for (let i = filaEscrita.length - 1; i >= 0; i--) {
    if (
      filaEscrita[i].dispositivo === dispositivo &&
      filaEscrita[i].config === config
    ) {
      filaEscrita.splice(i, 1);
    }
  }
  return new Promise((resolve, reject) => {
    filaEscrita.push({ dispositivo, config, valor, resolve, reject }); // insere no final
    processarFilaEscrita();
  });
}

async function processarFilaEscrita() {
  if (escrevendo || filaEscrita.length === 0) return;
  escrevendo = true;
  const { dispositivo, config, valor, resolve, reject } = filaEscrita.shift(); // remove no inicio
  try {
    await escreverDispositivoInterno(dispositivo, config, valor);
    resolve();
  } catch (err) {
    reject(err);
  }
  escrevendo = false;
  processarFilaEscrita();
}

// Função interna que faz a escrita real
async function escreverDispositivoInterno(id, config, valor) {
  const inicio = Date.now();

  if (!client.isOpen) await conectarModuloMestre();

  const indexId = mapa_escrita.fields.indexOf("id");
  const regId = mapa_escrita.address + indexId;
  await client.writeRegister(regId, id);

  const index = mapa_escrita.fields.indexOf(config);
  if (index === -1) {
    throw new Error(`Configuração "${config}" não existe no mapa de escrita!`);
  }
  const registrador = mapa_escrita.address + index;

  console.log(`[DEBUG] Vai escrever ${config} (reg ${registrador}) = ${valor}`);
  await client.writeRegister(registrador, valor);

  // Leitura de verificação após escrita
  const leitura = await client.readHoldingRegisters(registrador, 1);
  console.log(
    `[DEBUG] Valor lido após escrita ${config} (reg ${registrador}): ${leitura.data[0]}`
  );
  const fim = Date.now();
  console.log(
    `[DEBUG] Escrita ${config} (${registrador}) valor=${valor} - Tempo: ${
      fim - inicio
    }ms\n`
  );
}

console.log("Iniciando cliente Modulo Mestre...");
setInterval(lerTodosCampos, config.tempo);

process.on("SIGINT", () => {
  console.log("\nDesconectando...");
  client.close();
  process.exit();
});

export default {
  conectarModuloMestre,
  lerTodosCampos,
  escreverDispositivo,
  lerAlimentador,
  lerTemperaturaUmidade,
  setIpModuloMestre,
  getHistoricoLeituras,
  getUltimoCadaID,
  lerErrosAlimentador,
};
