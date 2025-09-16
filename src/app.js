import express from "express";
import { create } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

import productsRouter from "./routers/products.routers.js";
import cartsRouter from "./routers/carts.routers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Conexión a MongoDB
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

const hbs = create({
	helpers: {
		add: (a, b) => a + b,
		subtract: (a, b) => a - b,
		ifEquals: (a, b, options) => (a == b ? options.fn(this) : options.inverse(this)),
		gt: (a, b) => a > b,
		lt: (a, b) => a < b,
	},
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Routers
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", productsRouter);

// 404
app.use((req, res) => {
	res.status(404).json({ error: "Route not found" });
});

export default app;
