import { Router } from "express";
import { getProducts } from "../controllers/products.controller.js";
import { showRealTime, renderHome } from "../controllers/views.controller.js";

const router = Router();

router.get("/", getProducts);

router.get("/realtimeproducts", showRealTime);

router.get("/home", renderHome);

export default router;
