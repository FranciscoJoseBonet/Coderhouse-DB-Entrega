import app from "./app.js";
import { createServer } from "http";
import { Server } from "socket.io";
import ProductManager from "./managers/ProductManager.js";
import path from "path";

const httpServer = createServer(app);
const io = new Server(httpServer);

const productManager = new ProductManager(
	path.join(process.cwd(), "src/data/products.json")
);

io.on("connection", async (socket) => {
	console.log("Client connected");

	socket.emit("products:list", await productManager.getProducts());

	socket.on("product:create", async (data) => {
		const created = await productManager.addProduct(data);
		io.emit("products:list", await productManager.getProducts());
		socket.emit("product:created", created);
	});

	socket.on("product:delete", async (productId) => {
		const deleted = await productManager.deleteProduct(productId);
		io.emit("products:list", await productManager.getProducts());
		socket.emit("product:deleted", deleted);
	});

	socket.on("product:update", async ({ id, updates }) => {
		const updated = await productManager.updateProduct(id, updates);
		io.emit("products:list", await productManager.getProducts());
		socket.emit("product:updated", updated);
	});

	socket.on("addProduct", async (product) => {
		await productManager.addProduct(product);
		const products = await productManager.getProducts();
		io.emit("products", products);
	});
});

const port = process.env.PORT || 8080;
httpServer.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
