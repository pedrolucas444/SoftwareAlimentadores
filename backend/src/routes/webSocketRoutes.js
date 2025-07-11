import { WebSocketServer } from "ws";
import moduloMestreController, {
  statusControllerWS,
  ultimoPorIdControllerWS,
  errosIdWS,
  monitorWS,
} from "../controller/webSocketController.js";

export default function RouterWS(server) {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (request, socket, head) => {
    const pathname = new URL(request.url, `http://${request.headers.host}`)
      .pathname;

    if (pathname.startsWith("/alimentador")) {
      wss.handleUpgrade(request, socket, head, (ws) => {
        const partes = pathname.split("/");
        const id = partes[2];
        ws.send(`Conectado ao WebSocket do alimentador ${id}`);
        moduloMestreController(ws, id);
      });
    } else if (pathname === "/status") {
      wss.handleUpgrade(request, socket, head, (ws) => {
        statusControllerWS(ws);
      });
    } else if (pathname === "/todos-ids") {
      wss.handleUpgrade(request, socket, head, (ws) => {
        ultimoPorIdControllerWS(ws);
      });
    } else if (pathname === "/erros") {
      wss.handleUpgrade(request, socket, head, (ws) => {
        const partes = pathname.split("/");
        const id = partes[2];
        ws.send(`Conectado ao WebSocket do alimentador ${id}`);
        errosIdWS(ws, id);
      });
    } else if (pathname === "/umiTemp") {
      wss.handleUpgrade(request, socket, head, (ws) => {
        const partes = pathname.split("/");
        const id = partes[2];
        ws.send(`Conectado ao WebSocket do alimentador ${id}`);
        monitorWS(ws, id);
      });
    } else {
      socket.destroy();
    }
  });
}
