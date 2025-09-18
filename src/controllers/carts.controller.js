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

export const addProductToCart = async (req, res) => {
	try {
		const { cid, pid } = req.params;
		const quantityToAdd = Number(req.body.quantity ?? 1);

		if (quantityToAdd < 1) {
			return res.status(400).json({ error: "La cantidad debe ser mayor a 0" });
		}

		const cart = await Cart.findById(cid);
		if (!cart) return res.status(404).json({ error: "Cart not found" });

		const product = await Product.findById(pid);
		if (!product) return res.status(404).json({ error: "Product not found" });

		const cartProduct = cart.products.find(
			(p) => p.product.toString() === product._id.toString()
		);

		let newQuantityInCart = quantityToAdd;

		if (cartProduct) {
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
			if (quantityToAdd > product.stock) {
				return res.status(400).json({
					error: `No hay suficiente stock. Stock disponible: ${product.stock}`,
				});
			}
			cart.products.push({ product: product._id, quantity: quantityToAdd });
		}

		product.stock -= quantityToAdd;

		await product.save();
		await cart.save();

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

		const cart = await Cart.findById(cid).populate("products.product");
		if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

		const productIndex = cart.products.findIndex(
			(item) => item.product._id.toString() === pid
		);
		if (productIndex === -1) {
			return res.status(404).json({ success: false, message: "Product not in cart" });
		}

		const cartItem = cart.products[productIndex];
		const productInDB = await Product.findById(pid);
		productInDB.stock += cartItem.quantity;
		await productInDB.save();

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
		const { cid, pid } = req.params;

		const cart = await Cart.findById(cid).populate("products.product");
		if (!cart) return res.status(404).json({ error: "Cart not found" });

		const prodIndex = cart.products.findIndex((p) => p.product._id.toString() === pid);
		if (prodIndex === -1) return res.status(404).json({ error: "Product not in cart" });

		const cartItem = cart.products[prodIndex];
		const productInDB = await Product.findById(pid);

		const diff = quantity - cartItem.quantity;

		if (diff > 0 && diff > productInDB.stock) {
			return res.status(400).json({
				error: `No hay suficiente stock para ${productInDB.title}. Disponible: ${productInDB.stock}`,
			});
		}

		productInDB.stock -= diff;
		await productInDB.save();

		cart.products[prodIndex].quantity = quantity;
		await cart.save();

		const populatedCart = await Cart.findById(cid).populate("products.product").lean();

		res.json(populatedCart);
	} catch (error) {
		console.error(error);
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

export const updateCartProducts = async (req, res) => {
	try {
		const { cid } = req.params;
		const { products } = req.body;

		if (!Array.isArray(products)) {
			return res.status(400).json({ error: "Products must be an array" });
		}

		const cart = await Cart.findById(cid).populate("products.product");
		if (!cart) return res.status(404).json({ error: "Cart not found" });

		const currentProductsMap = new Map();
		cart.products.forEach((p) => {
			currentProductsMap.set(p.product._id.toString(), p.quantity);
		});

		for (const item of products) {
			if (!item.product || item.quantity < 1) {
				return res.status(400).json({ error: "Invalid product or quantity" });
			}

			const productInDB = await Product.findById(item.product);
			if (!productInDB) {
				return res.status(404).json({ error: `Product not found: ${item.product}` });
			}

			const oldQty = currentProductsMap.get(item.product) || 0;
			const diff = item.quantity - oldQty; // diferencia a ajustar en stock

			if (diff > 0 && diff > productInDB.stock) {
				return res.status(400).json({
					error: `Not enough stock for product ${productInDB.title}. Available: ${productInDB.stock}`,
				});
			}

			productInDB.stock -= diff;
			await productInDB.save();
		}

		cart.products = products.map((p) => ({ product: p.product, quantity: p.quantity }));
		await cart.save();

		const populatedCart = await Cart.findById(cid).populate("products.product").lean();

		res.json(populatedCart);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
};
