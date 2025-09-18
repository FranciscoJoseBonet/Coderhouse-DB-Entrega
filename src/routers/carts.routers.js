import { Router } from "express";
import {
	addProductToCart,
	removeProductFromCart,
	createCart,
	updateProductQuantity,
	emptyCart,
	deleteCart,
	getCarts,
	updateCartProducts,
} from "../controllers/carts.controller.js";

const router = Router();

router.get("/", getCarts);

// Crear un carrito vacío
router.post("/", createCart);

// Agregar producto al carrito
router.post("/:cid/products/:pid", addProductToCart);

// Actualizar cantidad de un producto específico
router.put("/:cid/products/:pid", updateProductQuantity);

// Borrar un producto específico del carrito
router.delete("/:cid/products/:pid", removeProductFromCart);

// Vaciar carrito completo
router.delete("/:cid/empty", emptyCart);

// Para borrar el carrito
router.delete("/:cid", deleteCart);

// Actualizar todos los productos de un carrito
router.put("/:cid", updateCartProducts);

export default router;
