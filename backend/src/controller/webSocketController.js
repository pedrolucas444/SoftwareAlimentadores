import { WebSocketServer } from "ws";
import moduloMestre from "../service/moduloMestre.js";

const wssTodos = new WebSocketServer({ noServer: true });
const wssAlimentador = new WebSocketServer({ noServer: true });
const wssErro = new WebSocketServer({ noServer: true });
const wssTemperaturaUmidade = new WebSocketServer({ noServer: true });
const time = 1000;

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
