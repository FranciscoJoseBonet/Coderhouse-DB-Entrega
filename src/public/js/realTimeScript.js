const socket = io();

const prodList = document.getElementById("prodList");
const paginationDiv = document.getElementById("pagination");

function renderProducts(result) {
	prodList.innerHTML = "";
	result.products.forEach((prod) => {
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

	// Render paginación
	paginationDiv.innerHTML = "";
	if (result.hasPrevPage) {
		const prevBtn = document.createElement("button");
		prevBtn.textContent = "Anterior";
		prevBtn.onclick = () => socket.emit("products:page", result.prevPage);
		paginationDiv.appendChild(prevBtn);
	}
	const pageInfo = document.createElement("span");
	pageInfo.textContent = `Página ${result.page} de ${result.totalPages}`;
	paginationDiv.appendChild(pageInfo);
	if (result.hasNextPage) {
		const nextBtn = document.createElement("button");
		nextBtn.textContent = "Siguiente";
		nextBtn.onclick = () => socket.emit("products:page", result.nextPage);
		paginationDiv.appendChild(nextBtn);
	}
}

socket.on("products:list", renderProducts);

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
	const id = e.target.prodId.value.trim();
	socket.emit("product:delete", id);
	e.target.reset();
});
