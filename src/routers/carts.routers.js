import { Router } from "express";
import {
	addProductToCart,
	renderCart,
	renderAllCarts,
	removeProductFromCart,
	createCart,
} from "../controllers/carts.controller.js";
import Cart from "../models/carts.model.js";

const router = Router();

router.get("/", renderAllCarts);

router.get("/all-json", async (req, res) => {
	try {
		const carts = await Cart.find().lean();
		res.json(carts);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Error al obtener los carritos" });
	}
});

// Vista de un carrito específico
router.get("/:cid", renderCart);

// Crear un carrito vacío
router.post("/", createCart);

// Agregar producto al carrito
router.post("/:cid/product/:pid", addProductToCart);

// Actualizar cantidad de un producto específico
router.put("/:cid/products/:pid", async (req, res) => {
	try {
		const { quantity } = req.body;
		const cart = await Cart.findById(req.params.cid);
		if (!cart) return res.status(404).json({ error: "Cart not found" });

		const prodIndex = cart.products.findIndex((p) => p.product.equals(req.params.pid));
		if (prodIndex >= 0) {
			cart.products[prodIndex].quantity = Number(quantity);
		} else {
			return res.status(404).json({ error: "Product not in cart" });
		}

		await cart.save();

		const populatedCart = await Cart.findById(req.params.cid)
			.populate("products.product")
			.lean();
		res.json(populatedCart);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

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

router.delete("/:cid/products/:pid", removeProductFromCart);

// Vaciar carrito completo
router.delete("/:cid/empty", async (req, res) => {
	try {
		const cart = await Cart.findById(req.params.cid);
		if (!cart) return res.status(404).json({ error: "Cart not found" });

		cart.products = [];
		await cart.save();
		res.json({ success: true });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Para borrar el carrito
router.delete("/:cid", async (req, res) => {
	try {
		const cart = await Cart.findByIdAndDelete(req.params.cid);
		if (!cart) return res.status(404).json({ error: "Cart not found" });

		res.json({ success: true });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;
