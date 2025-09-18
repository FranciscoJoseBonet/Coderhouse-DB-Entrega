import { Router } from "express";
import {
	allProductsJson,
	getProductById,
	createProduct,
	deleteProduct,
	updateProduct,
} from "../controllers/products.controller.js";

const router = Router();

router.get("/", allProductsJson);

router.get("/:pid", getProductById);

router.post("/", createProduct);

router.put("/:pid", updateProduct);

router.delete("/:pid", deleteProduct);

export default router;
