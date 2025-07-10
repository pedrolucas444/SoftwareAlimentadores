import { WebSocketServer } from "ws";
import moduloMestre from "../service/moduloMestre.js";

export default function moduloMestreController(ws, id) {
  if (!id || isNaN(Number(id))) {
    ws.send(JSON.stringify({ error: "ID da gaveta inválido!" }));
    ws.close();
    return;
  }
  const interval = setInterval(async () => {
    try {
      const dados = await moduloMestre.lerAlimentador(Number(id));
      ws.send(JSON.stringify({ gaveta: dados }));
    } catch (err) {
      ws.send(JSON.stringify({ error: "Erro ao buscar dados da gaveta" }));
    }
  }, 2000);

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
  }, 2000);

  ws.on("close", () => clearInterval(interval));
}

export function ultimoPorIdControllerWS(ws) {
  const interval = setInterval(() => {
    try {
      const ultimos = moduloMestre.getUltimoCadaID();
      ws.send(JSON.stringify({ data: ultimos }));
    } catch (err) {
      ws.send(
        JSON.stringify({ error: "Erro ao buscar dados do último por ID" })
      );
    }
  }, 2000);

  ws.on("close", () => clearInterval(interval));
}
