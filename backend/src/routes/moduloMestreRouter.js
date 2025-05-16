import { Router } from "express";
import ModuloMestreController from "../controller/ModuloMestreController.js";

const router = Router();

router.get("/todos", ModuloMestreController.getTodos);

export default router;
