import { Router } from "express";
import { renderHome } from "../controllers/products.controller.js";

const router = Router();

// Ruta principal para mostrar productos
router.get("/", renderHome);

export default router;
