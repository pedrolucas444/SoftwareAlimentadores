import express from "express";
import cors from "cors";
import moduloMestreRoutes from "./src/routes/ModuloMestreRouter.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/ModuloMestre", moduloMestreRoutes);
const PORT = 3000;
const server = app.listen(PORT, () => {
  console.log(`Servidor Rodando em http://localhost:${PORT}`);
});
