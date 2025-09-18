import { Router } from "express";
import {
	addProductToCart,
	removeProductFromCart,
	createCart,
	updateProductQuantity,
	emptyCart,
	deleteCart,
	getCarts,
} from "../controllers/carts.controller.js";
import Cart from "../models/carts.model.js";

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
router.put("/:cid", async (req, res) => {
	try {
		const { products } = req.body;
		const cart = await Cart.findById(req.params.cid);
		if (!cart) return res.status(404).json({ error: "Cart not found" });

		cart.products = products.map((p) => ({ product: p.product, quantity: p.quantity }));
		await cart.save();

		const populatedCart = await Cart.findById(req.params.cid)
			.populate("products.product")
			.lean();
		res.json(populatedCart);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;
