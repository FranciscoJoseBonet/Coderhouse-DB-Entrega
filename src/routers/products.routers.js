import { Router } from "express";
import { renderHome } from "../controllers/products.controller.js";

const router = Router();
router.get("/", renderHome);

export default router;
