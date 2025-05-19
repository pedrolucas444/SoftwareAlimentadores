import express from "express";
import cors from "cors";
import moduloMestreRoutes from "./src/routes/ModuloMestreRouter.js";
import registerWebsocketRoutes from "./src/routes/webSocketRoutes.js";
import {
  wssTodos,
  wssAlimentador,
  wssErro,
  wssTemperaturaUmidade,
} from "./src/controller/webSocketController.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/ModuloMestre", moduloMestreRoutes);
const PORT = 3000;
const server = app.listen(PORT, () => {
  console.log(`Servidor Rodando em http://localhost:${PORT}`);
});

registerWebsocketRoutes(server, {
  wssTodos,
  wssAlimentador,
  wssErro,
  wssTemperaturaUmidade,
});
