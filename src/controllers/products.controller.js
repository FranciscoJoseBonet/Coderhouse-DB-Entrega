import productModel from "../models/products.model.js";

export const renderHome = async (req, res) => {
	try {
		const { category, minPrice, maxPrice, sort, page = 1, limit = 10 } = req.query;

		// Filtro dinámico
		let filter = {};
		if (category) filter.category = category;
		if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
		if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };

		// Orden
		let sortOption = {};
		if (sort === "priceAsc") sortOption.price = 1;
		if (sort === "priceDesc") sortOption.price = -1;

		// Paginado
		const skip = (Number(page) - 1) * Number(limit);

		const productsDocs = await productModel
			.find(filter)
			.sort(sortOption)
			.skip(skip)
			.limit(Number(limit));
		const products = productsDocs.map((p) => p.toObject());

		const total = await productModel.countDocuments(filter);
		const totalPages = Math.ceil(total / limit);

		res.render("home", {
			products,
			page: Number(page),
			totalPages,
			limit: Number(limit),
			filters: { category, minPrice, maxPrice, sort },
		});
	} catch (error) {
		res.status(500).send("Error al renderizar la página: " + error.message);
	}
};
