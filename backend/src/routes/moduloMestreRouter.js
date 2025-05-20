import { Router } from "express";
import ModuloMestreController from "../controller/ModuloMestreController.js";

const router = Router();

router.get("/todos", ModuloMestreController.getTodos);
router.get("/alimentador", ModuloMestreController.getAlimentador);
router.get("/erros", ModuloMestreController.getErros);
router.get("/tempUmi", ModuloMestreController.getTemperaturaUmidade);

router.post("/ip", ModuloMestreController.setIP);
router.post("/config", ModuloMestreController.setConfig);

export default router;
