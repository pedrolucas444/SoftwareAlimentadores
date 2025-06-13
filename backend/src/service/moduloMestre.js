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
  if (!client.isOpen) await conectarModuloMestre();
  try {
    const index = mapa_escrita.fields.indexOf("Id");
    const registrador = mapa_escrita.address + index + 7;
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
async function escreverDispositivoInterno(config, valor) {
  const inicio = Date.now();

  if (!client.isOpen) await conectarModuloMestre();

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
  lerErros,
  lerTemperaturaUmidade,
  setIpModuloMestre,
};
