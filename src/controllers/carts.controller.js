import { getCartByIdService } from "../services/carts.service.js";
import Cart from "../models/carts.model.js";
import Product from "../models/products.model.js";

export const getCarts = async (req, res) => {
	try {
		const carts = await Cart.find().lean();
		res.json(carts);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Error al obtener los carritos" });
	}
};

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
		const quantityToAdd = Number(req.body.quantity ?? 1);

		if (quantityToAdd < 1) {
			return res.status(400).json({ error: "La cantidad debe ser mayor a 0" });
		}

		// Buscar carrito
		const cart = await Cart.findById(cid);
		if (!cart) return res.status(404).json({ error: "Cart not found" });

		// Buscar producto
		const product = await Product.findById(pid);
		if (!product) return res.status(404).json({ error: "Product not found" });

		// Buscar producto en el carrito
		const cartProduct = cart.products.find(
			(p) => p.product.toString() === product._id.toString()
		);

		let newQuantityInCart = quantityToAdd;

		if (cartProduct) {
			// Sumar cantidad al existente
			newQuantityInCart = cartProduct.quantity + quantityToAdd;
			if (newQuantityInCart > product.stock) {
				return res.status(400).json({
					error: `No hay suficiente stock. Stock disponible: ${
						product.stock - cartProduct.quantity
					}`,
				});
			}
			cartProduct.quantity = newQuantityInCart;
		} else {
			// Verificar stock antes de agregar
			if (quantityToAdd > product.stock) {
				return res.status(400).json({
					error: `No hay suficiente stock. Stock disponible: ${product.stock}`,
				});
			}
			cart.products.push({ product: product._id, quantity: quantityToAdd });
		}

		// Reducir stock del producto
		product.stock -= quantityToAdd;
		await product.save();

		// Guardar carrito
		await cart.save();

		// Devolver carrito poblado
		const populatedCart = await Cart.findById(cid).populate("products.product").lean();

		res.json(populatedCart);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
};
export const removeProductFromCart = async (req, res) => {
	try {
		const { cid, pid } = req.params;

		const cart = await Cart.findById(cid);
		if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

		// Buscar índice del producto en el carrito
		const productIndex = cart.products.findIndex(
			(item) => item.product.toString() === pid
		);

		if (productIndex === -1) {
			return res.status(404).json({ success: false, message: "Product not in cart" });
		}

		// Eliminar el producto
		cart.products.splice(productIndex, 1);
		await cart.save();

		return res.json({ success: true, message: "Product removed from cart" });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};

export const createCart = async (req, res) => {
	try {
		const lastCart = await Cart.findOne().sort({ createdAt: -1 });
		let nextNumber = 1;

		if (lastCart && lastCart.name) {
			const match = lastCart.name.match(/Carrito-(\d+)/);
			if (match) {
				nextNumber = parseInt(match[1]) + 1;
			}
		}

		const newCart = await Cart.create({
			products: [],
			name: `Carrito-${nextNumber}`,
		});

		const populatedCart = await Cart.findById(newCart._id)
			.populate("products.product")
			.lean();

		res.status(201).json({ success: true, cart: populatedCart });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

export const updateProductQuantity = async (req, res) => {
	try {
		const { quantity } = req.body;
		const cart = await Cart.findById(req.params.cid);
		if (!cart) return res.status(404).json({ error: "Cart not found" });

		const prodIndex = cart.products.findIndex((p) => p.product.equals(req.params.pid));
		if (prodIndex >= 0) {
			cart.products[prodIndex].quantity = Number(quantity);
		} else {
			return res.status(404).json({ error: "Product not in cart" });
		}

		await cart.save();

		const populatedCart = await Cart.findById(req.params.cid)
			.populate("products.product")
			.lean();
		res.json(populatedCart);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const emptyCart = async (req, res) => {
	try {
		const cart = await Cart.findById(req.params.cid);
		if (!cart) return res.status(404).json({ error: "Cart not found" });

		cart.products = [];
		await cart.save();
		res.json({ success: true });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const deleteCart = async (req, res) => {
	try {
		const cart = await Cart.findByIdAndDelete(req.params.cid);
		if (!cart) return res.status(404).json({ error: "Cart not found" });

		res.json({ success: true });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
