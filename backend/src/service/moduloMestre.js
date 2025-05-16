import ModbusRTU from "modbus-serial";
const client = new ModbusRTU();

const config = {
  ip: "192.168.0.240",
  port: 502,
  id: 99,
  tempo: 1000,
};

const mapa_escrita = {
  alimentador: {
    address: 0,
    fields: [
      "registradorAlimentador",
      "registradorHoraLiga",
      "registradorHoraDesliga",
      "registradorSetpoint",
      "resgistradorTemploCiclo",
      "registradorHora",
      "registradorMinuto",
    ],
  },
};

const mapa_leitura = {
  alimentador: {
    address: 7,
    fields: [
      "Selecionado",
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

async function conectarModuloMestre() {
  try {
    await client.connectTCP(config.ip, { port: config.port });
    client.setID(config.id);
    client.setTimeout(config.tempo);
    console.log("Conectado com o Modulo Mestre");
  } catch (err) {
    console.log("Erro de Conexão", err);
  }
}

async function lerTodosCampos() {
  try {
    if (!client.isOpen) await conectarModuloMestre();
    const respostaGeral = await client.readHoldingRegisters(7, 28);
    const dadosFormatados = {};
    Object.entries(mapa_leitura).forEach(([campo, config]) => {
      dadosFormatados[campo] = {};

      config.fields.forEach((dados, index) => {
        const endereco = config.address + index;
        dadosFormatados[campo][dados.trim()] = respostaGeral.data[endereco];
      });
    });
    return dadosFormatados;
  } catch (err) {
    console.log("Erro ler todos os campos", err);
  }
}
async function lerAlimentador() {}

async function lerErros() {}

async function lerMonitor() {}
export default {
  lerTodosCampos,
  conectarModuloMestre,
  lerAlimentador,
  lerErros,
  lerMonitor,
};
