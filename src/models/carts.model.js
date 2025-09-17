import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
	products: [
		{
			product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
			quantity: { type: Number, required: true, default: 1 },
		},
	],
	status: {
		type: String,
		enum: ["active", "completed", "abandoned"],
		default: "active",
	},
	name: {
		type: String,
		unique: true,
		required: true,
	},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

cartSchema.pre("save", function (next) {
	this.updatedAt = Date.now();
	next();
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
