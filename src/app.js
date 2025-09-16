import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

import productsRouter from "./routers/products.routers.js";
import cartsRouter from "./routers/carts.routers.js";
import { createViewsRouter } from "./routers/views.routers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

mongoose
	.connect(
		"mongodb+srv://francisco:contrasenia123@cluster0.kzbq1pi.mongodb.net/FinalProjectDB?retryWrites=true&w=majority&appName=Cluster0"
	)
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.error("MongoDB connection error:", err));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
	console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
	next();
});

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", createViewsRouter());

app.use((req, res) => {
	res.status(404).json({ error: "Route not found" });
});

export default app;
