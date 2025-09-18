import { getProductsService } from "../services/products.service.js";

export function showRealTime(req, res) {
	res.render("realTimeProducts", { title: "Real-Time Products" });
}

export const renderHome = async (req, res) => {
	try {
		const result = await getProductsService(req.query);

		res.render("home", {
			title: "Home",
			products: result.products,
			filters: result.filters,
			page: result.page,
			totalPages: result.totalPages,
		});
	} catch (error) {
		console.error(error);
		res.status(500).send("Error al renderizar la página: " + error.message);
	}
};
