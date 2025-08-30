import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProductManager {
	constructor(filePath) {
		this.path = path.resolve(__dirname, "..", filePath);
	}

	async getProducts() {
		try {
			const data = await fs.readFile(this.path, "utf-8");
			return JSON.parse(data);
		} catch (err) {
			console.error("Error reading product file:", err);
			return [];
		}
	}

	async getProductById(_id) {
		const products = await this.getProducts();
		return products.find((prod) => prod._id === _id) || null;
	}

	async addProduct(productData) {
		const products = await this.getProducts();

		if (
			!productData.title ||
			!productData.code ||
			productData.price == null ||
			productData.stock == null ||
			!productData.category
		) {
			return { error: "Missing required product fields" };
		}

		if (products.some((p) => p.code === productData.code)) {
			return { error: "Product code already exists" };
		}

		const newId = products.length > 0 ? products.at(-1)._id + 1 : 1;

		const newProduct = {
			_id: newId,
			title: productData.title,
			description: productData.description ?? "",
			code: productData.code,
			price: productData.price,
			status: productData.status ?? true,
			stock: productData.stock,
			category: productData.category,
		};

		products.push(newProduct);
		await fs.writeFile(this.path, JSON.stringify(products, null, 2), "utf-8");
		console.log("Product added:", newProduct);
		return newProduct;
	}

	async updateProduct(_id, updates) {
		const products = await this.getProducts();
		const index = products.findIndex((prod) => prod._id === _id);
		if (index === -1) return { error: "Product not found" };

		delete updates._id;
		products[index] = { ...products[index], ...updates };
		await fs.writeFile(this.path, JSON.stringify(products, null, 2), "utf-8");
		return products[index];
	}

	async deleteProduct(_id) {
		const products = await this.getProducts();
		const index = products.findIndex((p) => p._id === _id);
		if (index === -1) return { error: "Product not found" };

		const deleted = products.splice(index, 1)[0];
		await fs.writeFile(this.path, JSON.stringify(products, null, 2), "utf-8");
		return deleted;
	}
}

export default ProductManager;
