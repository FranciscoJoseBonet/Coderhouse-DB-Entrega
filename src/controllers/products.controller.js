import { getProductsService } from "../services/products.service.js";

export const getProducts = async (req, res) => {
	try {
		const result = await getProductsService(req.query);

		const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`;
		const buildLink = (targetPage) => {
			const params = new URLSearchParams();
			if (targetPage) params.set("page", targetPage);
			if (req.query.limit) params.set("limit", result.limit);
			if (req.query.sort) params.set("sort", result.filters.sort);
			if (req.query.query) params.set("query", result.filters.query);
			if (req.query.minPrice) params.set("minPrice", result.filters.minPrice);
			if (req.query.maxPrice) params.set("maxPrice", result.filters.maxPrice);
			return `${baseUrl}?${params.toString()}`;
		};

		res.json({
			status: "success",
			payload: result.products,
			totalPages: result.totalPages,
			prevPage: result.prevPage,
			nextPage: result.nextPage,
			page: result.page,
			hasPrevPage: result.hasPrevPage,
			hasNextPage: result.hasNextPage,
			prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
			nextLink: result.hasNextPage ? buildLink(result.nextPage) : null,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ status: "error", error: error.message });
	}
};
