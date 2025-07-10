import { WebSocketServer } from "ws";
import moduloMestreController, {
  statusControllerWS,
  ultimoPorIdControllerWS,
} from "../controller/webSocketController.js";

export default function RouterWS(server) {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (request, socket, head) => {
    const pathname = new URL(request.url, `http://${request.headers.host}`)
      .pathname;

    if (pathname.startsWith("/gaveta")) {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    } else if (pathname === "/status") {
      wss.handleUpgrade(request, socket, head, (ws) => {
        statusControllerWS(ws);
      });
    } else if (pathname === "/ultimo-por-id") {
      wss.handleUpgrade(request, socket, head, (ws) => {
        ultimoPorIdControllerWS(ws);
      });
    } else {
      socket.destroy();
    }
  });

  wss.on("connection", (ws, request) => {
    const pathname = new URL(request.url, `http://${request.headers.host}`)
      .pathname;
    if (pathname.startsWith("/gaveta")) {
      const partes = pathname.split("/");
      const id = partes[2];
      ws.send(`Conectado ao WebSocket da gaveta ${id || "todas"}`);
      moduloMestreController(ws, id);
    }
  });
}
