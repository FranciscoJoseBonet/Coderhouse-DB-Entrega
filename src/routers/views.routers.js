import { Router } from "express";
import { getProducts } from "../controllers/products.controller.js";
import {
	showRealTime,
	renderHome,
	renderCart,
	renderAllCarts,
} from "../controllers/views.controller.js";

const router = Router();

router.get("/", getProducts);

router.get("/realtimeproducts", showRealTime);

router.get("/home", renderHome);

router.get("/cartsList", renderAllCarts);

router.get("/:cid", renderCart);

export default router;
