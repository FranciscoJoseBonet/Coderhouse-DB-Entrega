import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager("./src/data/carts.json");

router.get("/", async (req, res) => {
	const carts = await cartManager.getCarts();
	res.json(carts);
});

router.get("/:cid", async (req, res) => {
	const cid = Number(req.params.cid);
	const cart = await cartManager.getCartById(cid);
	cart ? res.json(cart) : res.status(404).json({ error: "Cart not found" });
});

router.post("/", async (req, res) => {
	const newCart = await cartManager.createCart();
	res.status(201).json(newCart);
});

router.post("/:cid/product/:pid", async (req, res) => {
	const cid = Number(req.params.cid);
	const pid = Number(req.params.pid);
	const quantity = req.body.quantity ?? 1;

	const result = await cartManager.addProductToCart(cid, pid, quantity);

	if (result.error) {
		return res.status(404).json(result);
	}
	res.json(result);
});

router.delete("/:cid", async (req, res) => {
	const cid = Number(req.params.cid);
	const deleted = await cartManager.deleteCart(cid);

	if (deleted.error) {
		return res.status(404).json(deleted);
	}
	res.json(deleted);
});

export default router;
