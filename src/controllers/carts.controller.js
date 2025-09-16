import { getCartByIdService } from "../services/carts.service.js";
import Cart from "../models/carts.model.js";
import Product from "../models/products.model.js";

export const renderCart = async (req, res) => {
	try {
		const { cid } = req.params;
		const cart = await getCartByIdService(cid, true);

		if (!cart) {
			return res.status(404).render("cart", { cart: null, total: 0 });
		}

		const total = cart.products.reduce((acc, item) => {
			if (!item.product) return acc;
			const price = Number(item.product.price) || 0;
			return acc + price * item.quantity;
		}, 0);

		console.log(cart);
		res.render("cart", { cart, total });
	} catch (error) {
		console.error(error);
		res.status(500).send("Error al renderizar el carrito: " + error.message);
	}
};

export const renderAllCarts = async (req, res) => {
	try {
		const carts = await Cart.find().populate("products.product").lean();
		res.render("allCarts", { carts });
	} catch (error) {
		console.error(error);
		res.status(500).send("Error al renderizar todos los carritos: " + error.message);
	}
};

export const addProductToCart = async (req, res) => {
	try {
		const { cid, pid } = req.params;
		const quantity = Number(req.body.quantity ?? 1);

		const cart = await Cart.findById(cid);
		if (!cart) return res.status(404).json({ error: "Cart not found" });

		const product = await Product.findById(pid);
		if (!product) return res.status(404).json({ error: "Product not found" });

		if (product.stock < quantity) {
			return res.status(400).json({
				error: `No hay suficiente stock. Stock disponible: ${product.stock}`,
			});
		}

		product.stock -= quantity;
		await product.save();

		const prodIndex = cart.products.findIndex((p) => p.product.equals(product._id));
		if (prodIndex >= 0) {
			cart.products[prodIndex].quantity += quantity;
		} else {
			cart.products.push({ product: product._id, quantity });
		}

		await cart.save();

		const populatedCart = await Cart.findById(cid).populate("products.product").lean();
		res.json(populatedCart);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
