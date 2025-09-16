import productModel from "../models/products.model.js";

export async function showHome(req, res) {
	try {
		//trae los productos desde Mongo
		const products = await productModel.find();
		// Renderiza la vista
		res.render("home", {
			title: "Home",
			products: products.map((p) => p.toObject()),
		});
	} catch (err) {
		console.error("Error getting products:", err);
		res.status(500).send("Internal server error");
	}
}

export function showRealTime(req, res) {
	res.render("realTimeProducts", { title: "Real-Time Products" });
}
