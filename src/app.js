import express from "express";
import productsRouter from "./routers/products.routers.js";
import cartsRouter from "./routers/carts.routers.js";

const app = express();
const PORT = 8080;

app.use(express.json());

app.use((req, res, next) => {
	console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
	next();
});

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.use((req, res) => {
	res.status(404).json({ error: "Ruta no encontrada" });
});

app.listen(PORT, () => {
	console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
