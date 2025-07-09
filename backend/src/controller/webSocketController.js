import { WebSocketServer } from "ws";
import moduloMestre from "../service/moduloMestre.js";

const wssTodos = new WebSocketServer({ noServer: true });
const wssAlimentador = new WebSocketServer({ noServer: true });
const wssErro = new WebSocketServer({ noServer: true });
const wssTemperaturaUmidade = new WebSocketServer({ noServer: true });
const time = 2000;

wssTodos.on("connection", (ws) => {
  const interval = setInterval(async () => {
    try {
      const todosData = await moduloMestre.lerTodosCampos();
      ws.send(
        JSON.stringify({
          time: new Date().toLocaleDateString(),
          data: todosData,
        })
      );
    } catch (err) {
      ws.send(
        JSON.stringify({ error: "Erro ao obter dados de todos os campos" })
      );
    }
  }, time);
  ws.on("close", () => clearInterval(interval));
});

wssAlimentador.on("connection", (ws) => {
  const interval = setInterval(async () => {
    try {
      const alimentadorData = await moduloMestre.lerAlimentador();
      ws.send(
        JSON.stringify({
          time: new Date().toLocaleTimeString(),
          data: alimentadorData,
        })
      );
    } catch (err) {
      ws.send(JSON.stringify({ error: "Erro ao obter dados do alimentador" }));
    }
  }, time);
  ws.on("close", () => clearInterval(interval));
});

wssErro.on("connection", (ws) => {
  const interval = setInterval(async () => {
    try {
      const erroData = await moduloMestre.lerErros();
      ws.send(
        JSON.stringify({
          time: new Date().toLocaleTimeString(),
          data: erroData,
        })
      );
    } catch (erro) {
      ws.send("close", () => clearInterval(interval));
    }
  }, time);
});

wssTemperaturaUmidade.on("connection", (ws) => {
  const interval = setInterval(async () => {
    try {
      const temperaturaUmidadeData = await moduloMestre.lerTemperaturaUmidade();
      ws.send(
        JSON.stringify({
          time: new Date().toLocaleTimeString(),
          data: temperaturaUmidadeData,
        })
      );
    } catch (erro) {
      ws.send("close", () => clearInterval(interval));
    }
  }, time);
});

export { wssTodos, wssAlimentador, wssErro, wssTemperaturaUmidade };

export function moduloMestreControllerWS(ws, id) {
  if (!id || isNaN(Number(id))) {
    ws.send(JSON.stringify({ error: "ID do alimentador inválido!" }));
    ws.close();
    return;
  }
  const interval = setInterval(async () => {
    try {
      const dados = await moduloMestre.lerAlimentador(Number(id));
      ws.send(JSON.stringify({ alimentador: dados }));
    } catch (err) {
      ws.send(JSON.stringify({ error: "Erro ao buscar dados do alimentador" }));
    }
  }, time);

  ws.on("close", () => clearInterval(interval));
}

export function statusControllerWS(ws) {
  const interval = setInterval(async () => {
    try {
      const conectado = (await moduloMestre.isConnected?.()) ?? true;
      ws.send(JSON.stringify({ conectado }));
    } catch {
      ws.send(JSON.stringify({ conectado: false }));
    }
  }, time);

  ws.on("close", () => clearInterval(interval));
}

export function ultimoPorIdControllerWS(ws) {
  const interval = setInterval(() => {
    try {
      const ultimos = moduloMestre.getUltimoDeCadaID();
      ws.send(JSON.stringify({ data: ultimos }));
    } catch (err) {
      ws.send(
        JSON.stringify({ error: "Erro ao buscar dados do último por ID" })
      );
    }
  }, time);

  ws.on("close", () => clearInterval(interval));
}
