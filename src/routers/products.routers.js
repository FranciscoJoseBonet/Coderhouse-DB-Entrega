import { Router } from "express";
import { getProducts, renderHome } from "../controllers/products.controller.js";
import { showRealTime } from "../controllers/views.controller.js";

const router = Router();

router.get("/api/products", getProducts);
router.get("/", renderHome);

router.get("/realtimeproducts", showRealTime);

export default router;
