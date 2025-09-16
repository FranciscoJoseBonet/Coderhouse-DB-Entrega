import { Router } from "express";
import { renderCart } from "../controllers/carts.controller.js";
import Cart from "../models/carts.model.js";
import productModel from "../models/products.model.js";

const router = Router();

router.get("/", async (req, res) => {
	try {
		const carts = await Cart.find().populate("products.product").lean();
		res.json(carts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get("/:cid", renderCart);

router.post("/", async (req, res) => {
	try {
		const newCart = await Cart.create({ user: req.body.user, products: [] });
		res.status(201).json(newCart);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post("/:cid/product/:pid", async (req, res) => {
	try {
		const cart = await Cart.findById(req.params.cid);
		if (!cart) return res.status(404).json({ error: "Cart not found" });

		const product = await productModel.findById(req.params.pid);
		if (!product) return res.status(404).json({ error: "Product not found" });

		const quantity = req.body.quantity ?? 1;
		const prodIndex = cart.products.findIndex((p) => p.product.equals(product._id));
		if (prodIndex >= 0) {
			cart.products[prodIndex].quantity += Number(quantity);
		} else {
			cart.products.push({ product: product._id, quantity: Number(quantity) });
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

router.delete("/:cid/products/:pid", async (req, res) => {
	try {
		const cart = await Cart.findById(req.params.cid);
		if (!cart) return res.status(404).json({ error: "Cart not found" });

		cart.products = cart.products.filter((p) => !p.product.equals(req.params.pid));
		await cart.save();

		const populatedCart = await Cart.findById(req.params.cid)
			.populate("products.product")
			.lean();
		res.json(populatedCart);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.delete("/:cid", async (req, res) => {
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

export default router;
