import { getProductsService } from "../services/products.service.js";
import productModel from "../models/products.model.js";

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

export const allProductsJson = async (req, res) => {
	try {
		const products = await productModel.find().lean();
		res.json(products);
	} catch (error) {
		console.error(error);
		res.status(500).json({ status: "error", error: error.message });
	}
};

export const getProductById = async (req, res) => {
	try {
		const { pid } = req.params;
		console.log(pid);
		const product = await productModel.findById(pid);

		if (!product) {
			return res.status(404).json({ status: "error", message: "Producto no encontrado" });
		}

		res.json(product);
	} catch (error) {
		console.error(error);
		res.status(500).json({ status: "error", error: error.message });
	}
};

export const createProduct = async (req, res) => {
	try {
		const { title, description, code, price, status, stock, category, thumbnails } =
			req.body;

		if (!title || !code || !price || stock == null || !category) {
			return res
				.status(400)
				.json({ status: "error", message: "Faltan campos obligatorios" });
		}

		const newProduct = await productModel.create({
			title,
			description,
			code,
			price,
			status,
			stock,
			category,
			thumbnails: thumbnails || [],
		});

		res.status(201).json({ status: "success", payload: newProduct });
	} catch (error) {
		console.error(error);
		res.status(500).json({ status: "error", error: error.message });
	}
};

export const updateProduct = async (req, res) => {
	try {
		const { pid } = req.params;
		const updateData = { ...req.body };

		delete updateData._id;
		delete updateData.id;

		const updatedProduct = await productModel.findByIdAndUpdate(pid, updateData, {
			new: true,
			runValidators: true,
		});

		if (!updatedProduct) {
			return res.status(404).json({ status: "error", message: "Producto no encontrado" });
		}

		res.json({ status: "success", payload: updatedProduct });
	} catch (error) {
		console.error(error);
		res.status(500).json({ status: "error", error: error.message });
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const { pid } = req.params;

		const deletedProduct = await productModel.findByIdAndDelete(pid);

		if (!deletedProduct) {
			return res.status(404).json({ status: "error", message: "Producto no encontrado" });
		}

		res.json({ status: "success", message: "Producto eliminado correctamente" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ status: "error", error: error.message });
	}
};
