import { getCartByIdService } from "../services/carts.service.js";
import Cart from "../models/carts.model.js";

export const renderCart = async (req, res) => {
	try {
		const { cid } = req.params;
		const cart = await getCartByIdService(cid, true); // populate productos

		if (!cart) {
			return res.status(404).render("cart", { cart: null, total: 0 });
		}

		const total = cart.products.reduce((acc, item) => {
			if (!item.product) return acc; // ignora productos borrados
			const price = Number(item.product.price) || 0;
			return acc + price * item.quantity;
		}, 0);

		console.log(cart); // <- verificá aquí los datos
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
