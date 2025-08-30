import ProductManager from "../managers/ProductManager.js";

const productManager = new ProductManager("./data/products.json");

export async function showHome(req, res) {
	try {
		const products = await productManager.getProducts();
		res.render("home", { title: "Home", products });
	} catch (err) {
		console.error("Error getting products:", err);
		res.status(500).send("Internal server error");
	}
}

export function showRealTime(req, res) {
	res.render("realTimeProducts", { title: "Real-Time Products" });
}
