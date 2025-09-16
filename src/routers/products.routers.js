import { Router } from "express";
import { getProducts, renderHome } from "../controllers/products.controller.js";

const router = Router();

// API JSON
router.get("/api/products", getProducts);

// Renderizado con Handlebars
router.get("/", renderHome);

export default router;
