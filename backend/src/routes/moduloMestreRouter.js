import { Router } from "express";
import moduloMestreController from "../controller/moduloMestreController.js";

const router = Router();

router.get("/alimentador", moduloMestreController.getAlimentador);
router.get(
  "/alimentador-escrita/:id",
  moduloMestreController.getAlimentadorEscrita
);
router.get("/historico", moduloMestreController.getHistorico);
router.get("/ultimo-por-id", moduloMestreController.getUltimoDeCadaID);
router.get(
  "/alimentador-manual/:id",
  moduloMestreController.getUltimoSetPointManual
);

router.post("/ip", moduloMestreController.setIP);
router.post("/alimentador/:id", moduloMestreController.setAlimentador);
router.post("/registraPosicao", moduloMestreController.setRegistraPosicao);

export default router;
