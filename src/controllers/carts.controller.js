import { getCartByIdService } from "../services/carts.service.js";

export const renderCart = async (req, res) => {
	try {
		// Traemos el carrito con los productos completos
		const cart = await getCartByIdService(req.params.cid, true); // true para populate
		if (!cart) {
			return res.status(404).render("cart", { cart: null });
		}

		// Calculamos el total del carrito
		const total = cart.products.reduce(
			(acc, item) => acc + item.product.price * item.quantity,
			0
		);

		res.render("cart", { cart, total });
	} catch (error) {
		console.error(error);
		res.status(500).send("Error al renderizar el carrito: " + error.message);
	}
};
