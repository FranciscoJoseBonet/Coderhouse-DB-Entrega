import productModel from "../models/products.model.js";

export const getProductsService = async (queryParams) => {
	let { limit = 10, page = 1, sort, query, minPrice, maxPrice } = queryParams;

	limit = Number(limit);
	page = Number(page);

	let filter = {};
	if (query) filter.category = { $regex: query, $options: "i" };
	if (minPrice !== undefined && minPrice !== "")
		filter.price = { ...filter.price, $gte: Number(minPrice) };
	if (maxPrice !== undefined && maxPrice !== "")
		filter.price = { ...filter.price, $lte: Number(maxPrice) };

	let sortOption = {};
	if (sort === "asc") sortOption.price = 1;
	if (sort === "desc") sortOption.price = -1;

	const skip = (page - 1) * limit;
	const totalDocs = await productModel.countDocuments(filter);
	const totalPages = Math.ceil(totalDocs / limit);

	const productsDocs = await productModel
		.find(filter)
		.sort(sortOption)
		.skip(skip)
		.limit(limit)
		.lean();

	const hasPrevPage = page > 1;
	const hasNextPage = page < totalPages;
	const prevPage = hasPrevPage ? page - 1 : null;
	const nextPage = hasNextPage ? page + 1 : null;

	return {
		products: productsDocs,
		page,
		limit,
		totalPages,
		hasPrevPage,
		hasNextPage,
		prevPage,
		nextPage,
		filters: { query, minPrice, maxPrice, sort },
	};
};
