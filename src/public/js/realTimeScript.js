const socket = io();

const prodList = document.getElementById("prodList");

socket.on("products:list", (products) => {
	prodList.innerHTML = "";
	products.forEach((prod) => {
		const li = document.createElement("li");
		li.innerHTML = `
            <div class="title">${prod.title}</div>
            <div class="description">${prod.description || ""}</div>
            <div class="meta">
                <span class="price">$${prod.price}</span> —
                <small>ID: ${prod._id}</small> —
                <small>Code: ${prod.code}</small> —
                <small>Stock: ${prod.stock}</small> —
                <small>Category: ${prod.category}</small>
            </div>
        `;
		prodList.appendChild(li);
	});
});

document.getElementById("createForm").addEventListener("submit", (e) => {
	e.preventDefault();

	const title = e.target.title.value;
	const description = e.target.description.value;
	const code = e.target.code.value;
	const price = parseFloat(e.target.price.value);
	const stock = parseInt(e.target.stock.value);
	const category = e.target.category.value;
	const status = e.target.status.value === "true";

	socket.emit("product:create", {
		title,
		description,
		code,
		price,
		stock,
		category,
		status,
	});
	e.target.reset();
});

document.getElementById("deleteForm").addEventListener("submit", (e) => {
	e.preventDefault();
	const id = parseInt(e.target.prodId.value);
	socket.emit("product:delete", id);
	e.target.reset();
});
