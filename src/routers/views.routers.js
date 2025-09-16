import { Router } from "express";
import { showRealTime } from "../controllers/views.controller.js";

export function createViewsRouter() {
	const router = Router();
	router.get("/realtimeproducts", showRealTime);

	return router;
}
