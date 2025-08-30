import { Router } from "express";
import { showHome, showRealTime } from "../controllers/views.controller.js";

export function createViewsRouter() {
	const router = Router();

	router.get("/", showHome);
	router.get("/realtimeproducts", showRealTime);

	return router;
}
