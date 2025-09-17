import app from "./app.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { getProductsService } from "./services/products.service.js";
import productModel from "./models/products.model.js";

const httpServer = createServer(app);
const io = new Server(httpServer);

io.on("connection", async (socket) => {
	const result = await getProductsService({ limit: 6, page: 1 });
	socket.emit("products:list", result);

	socket.on("products:page", async (page) => {
		const result = await getProductsService({ limit: 6, page });
		socket.emit("products:list", result);
	});

	socket.on("product:create", async (data) => {
		await productModel.create(data);
		const result = await getProductsService({ limit: 6, page: 1 });
		io.emit("products:list", result);
	});

	socket.on("product:delete", async (productId) => {
		await productModel.findByIdAndDelete(productId);
		const result = await getProductsService({ limit: 6, page: 1 });
		io.emit("products:list", result);
	});

	socket.on("product:update", async ({ id, data }) => {
		await productModel.findByIdAndUpdate(id, data, { new: true });
		const result = await getProductsService({ limit: 6, page: 1 });
		io.emit("products:list", result);
	});
});

const port = process.env.PORT || 8080;
httpServer.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
