import moduloMestre from "../service/moduloMestre.js";

export default function moduloMestreController(ws, id) {
  if (!id || isNaN(Number(id))) {
    ws.send(JSON.stringify({ error: "ID do alimentador inválido!" }));
    ws.close();
    return;
  }
  const interval = setInterval(async () => {
    try {
      const alimentador = await moduloMestre.lerAlimentador(Number(id));
      ws.send(JSON.stringify({ data: alimentador }));
    } catch (err) {
      ws.send(JSON.stringify({ error: "Erro ao buscar dados do alimentador" }));
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

export function errosIdWS(ws, id) {
  if (!id || isNaN(Number(id))) {
    ws.send(JSON.stringify({ error: "ID do alimentador inválido!" }));
    ws.close();
    return;
  }
  const interval = setInterval(() => {
    try {
      const erros = moduloMestre.lerErrosAlimentador(Number(id));
      ws.send(JSON.stringify({ data: erros }));
    } catch (err) {
      ws.send(JSON.stringify({ error: "erro ao ler os erros do alimentador" }));
    }
  });
  ws.on("close", () => clearTimeout(interval));
}

export function monitorWS(ws, id) {
  if (!id || isNaN(Number(id))) {
    ws.send(JSON.stringify({ erros: "ID do alimentador errado" }));
    ws.close();
    return;
  }

  const interval = setInterval(() => {
    try {
      const monitor = moduloMestre.lerTemperaturaUmidade(id);
      ws.send(JSON.stringify({ data: monitor }));
    } catch (err) {
      ws.send(JSON.stringify({ erro: "erro ao ler a temperatura e umidade" }));
    }
  });
  ws.on("close", () => clearInterval(interval));
}
