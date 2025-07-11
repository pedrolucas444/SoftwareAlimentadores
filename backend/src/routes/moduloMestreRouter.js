import { Router } from "express";
import moduloMestreController from "../controller/moduloMestreController.js";

const router = Router();

router.post("/ip", moduloMestreController.setIP);
router.post("/alimentador/:id", moduloMestreController.setAlimentador);

export default router;
