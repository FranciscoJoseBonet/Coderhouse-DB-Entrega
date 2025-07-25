import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager("./src/data/products.json");

router.get("/", async (req, res) => {
	const products = await productManager.getProducts();
	res.json(products);
});

router.get("/:pid", async (req, res) => {
	const pid = Number(req.params.pid);
	const product = await productManager.getProductById(pid);
	product ? res.json(product) : res.status(404).json({ error: "Not found" });
});

router.post("/", async (req, res) => {
	const newProduct = await productManager.addProduct(req.body);
	if (newProduct.error) {
		return res.status(400).json(newProduct);
	}
	res.status(201).json(newProduct);
});

router.put("/:pid", async (req, res) => {
	const pid = Number(req.params.pid);
	const updated = await productManager.updateProduct(pid, req.body);
	if (updated.error) {
		return res.status(404).json(updated);
	}
	res.json(updated);
});

router.delete("/:pid", async (req, res) => {
	const pid = Number(req.params.pid);
	const resolve = await productManager.deleteProduct(pid);
	if (resolve.error) {
		return res.status(404).json(resolve);
	}
	res.json(resolve);
});

export default router;
