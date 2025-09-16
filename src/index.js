import app from "./app.js";
import { createServer } from "http";
import { Server } from "socket.io";
import productModel from "./models/products.model.js";

const httpServer = createServer(app);
const io = new Server(httpServer);

io.on("connection", async (socket) => {
	console.log("Client connected");

	const products = await productModel.find().lean();
	socket.emit("products", products);

	socket.on("addProduct", async (data) => {
		await productModel.create(data);
		const products = await productModel.find().lean();
		io.emit("products", products);
	});
	socket.on("deleteProduct", async (productId) => {
		await productModel.findByIdAndDelete(productId);
		const products = await productModel.find().lean();
		io.emit("products", products);
	});
});

const port = process.env.PORT || 8080;
httpServer.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
