import Cart from "../models/carts.model.js";

export const getCartByIdService = async (cid, populateProducts = true) => {
	if (populateProducts) {
		return Cart.findById(cid).populate("products.product").lean();
	}
	return Cart.findById(cid).lean();
};
