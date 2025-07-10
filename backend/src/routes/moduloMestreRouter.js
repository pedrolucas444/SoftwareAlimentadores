import { Router } from "express";
import moduloMestreController from "../controller/moduloMestreController.js";

const router = Router();
//para todos alimentadores
router.get("/alimentador", moduloMestreController.getAlimentador);
router.get(
  "/alimentador-escrita/:id",
  moduloMestreController.getAlimentadorEscrita
);
//todos os historicos armazenado de ids
router.get("/historico", moduloMestreController.getHistorico);
//todos os ids organizado a partir do historico
router.get("/ultimo-por-id", moduloMestreController.getUltimoDeCadaID);
router.get(
  "/alimentador-manual/:id",
  moduloMestreController.getUltimoSetPointManual
);

router.post("/ip", moduloMestreController.setIP);
router.post("/alimentador/:id", moduloMestreController.setAlimentador);
router.post("/registraPosicao", moduloMestreController.setRegistraPosicao);

export default router;
