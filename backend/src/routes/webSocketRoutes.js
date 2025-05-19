export default function registerWebsocketRoutes(server, websocket) {
  const { wssTodos, wssAlimentador, wssErro, wssTemperaturaUmidade } =
    websocket;

  server.on("upgrade", (request, socket, head) => {
    const pathname = new URL(request.url, `http://${request.headers.host}`)
      .pathname;

    if (pathname === "/ws/todos") {
      wssTodos.handleUpgrade(request, socket, head, (ws) => {
        wssTodos.emit("connection", ws, request);
      });
    } else if (pathname === "ws/alimentador") {
      wssAlimentador.handleUpgrade(request, socket, head, (ws) => {
        wssAlimentador.emit("connection", ws, request);
      });
    } else if (pathname === "ws/erros") {
      wssErro.handleUpgrade(request, socket, head, (ws) => {
        wssErro.emit("connection", ws, request);
      });
    } else if (pathname === "ws/temperaturaUmidade") {
      wssTemperaturaUmidade.handleUpgrade(request, socket, head, (ws) => {
        wssTemperaturaUmidade.emit("connection", ws, socket);
      });
    } else {
      socket.destroy();
    }
  });
}
