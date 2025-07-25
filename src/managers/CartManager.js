import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CartManager {
	constructor(filePath) {
		this.path = path.resolve(__dirname, "..", filePath);
	}

	async getCarts() {
		try {
			const data = await fs.readFile(this.path, "utf-8");
			return JSON.parse(data);
		} catch (err) {
			console.error("Error reading carts file:", err);
			return [];
		}
	}

	async getCartById(_id) {
		const carts = await this.getCarts();
		return carts.find((cart) => cart.id === _id) || null;
	}

	async createCart() {
		const carts = await this.getCarts();
		const newId = carts.length > 0 ? carts.at(-1).id + 1 : 1;

		const newCart = {
			id: newId,
			products: [],
		};

		carts.push(newCart);
		await fs.writeFile(this.path, JSON.stringify(carts, null, 2), "utf-8");
		return newCart;
	}

	async addProductToCart(cartId, productId, quantity = 1) {
		const carts = await this.getCarts();
		const cart = carts.find((c) => c.id === cartId);
		if (!cart) return { error: "Cart not found" };

		const existingProduct = cart.products.find((p) => p.productId === productId);

		if (existingProduct) {
			existingProduct.quantity += quantity;
		} else {
			cart.products.push({ productId, quantity });
		}

		await fs.writeFile(this.path, JSON.stringify(carts, null, 2), "utf-8");
		return cart;
	}

	async deleteCart(cartId) {
		const carts = await this.getCarts();
		const index = carts.findIndex((c) => c.id === cartId);
		if (index === -1) return { error: "Cart not found" };

		const deleted = carts.splice(index, 1)[0];
		await fs.writeFile(this.path, JSON.stringify(carts, null, 2), "utf-8");
		return deleted;
	}
}

export default CartManager;
