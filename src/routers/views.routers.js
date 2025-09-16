import { Router } from "express";
import { showRealTime } from "../controllers/views.controller.js";

export function createViewsRouter() {
	const router = Router();
	router.get("/realtimeproducts", showRealTime);

	// Ejemplo opcional: home con productos filtrados y paginados
	// router.get("/home-products", getProducts);

	return router;
}
