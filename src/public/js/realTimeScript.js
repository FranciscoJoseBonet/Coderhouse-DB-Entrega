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
                <small>Category: ${prod.category}</small> —
                <small>Status: ${prod.status ? "Active" : "Inactive"}</small>
            </div>
			<div styles="margin-top: 10px; display: flex; justify-content: flex-end;">
            	<button styles='background: #ff1212 !important' class="deleteBtn" data-id="${
								prod._id
							}">Delete</button>
            	<button class="updateBtn" data-id="${prod._id}">Update</button>
			</div>
			`;
		prodList.appendChild(li);
	});

	document.querySelectorAll(".updateBtn").forEach((btn) => {
		btn.addEventListener("click", () => openModal(btn.dataset.id, result.products));
	});

	document.querySelectorAll(".deleteBtn").forEach((btn) => {
		btn.addEventListener("click", () => {
			if (!confirm("¿Querés eliminar este producto?")) return;
			try {
				const prodId = btn.dataset.id;
				socket.emit("product:delete", prodId);
				alert("Producto eliminado con exito");
			} catch (error) {
				console.error("Error al eliminar el producto: ", error);
			}
		});
	});

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

// Abrir modal con datos del producto
function openModal(prodId, products) {
	const product = products.find((p) => p._id === prodId);
	if (!product) return;

	document.getElementById("updateProdId").value = product._id;
	document.getElementById("updateTitle").value = product.title;
	document.getElementById("updateDescription").value = product.description || "";
	document.getElementById("updateCode").value = product.code;
	document.getElementById("updatePrice").value = product.price;
	document.getElementById("updateStock").value = product.stock;
	document.getElementById("updateCategory").value = product.category;
	document.getElementById("updateStatus").value = product.status;

	document.getElementById("updateModal").style.display = "block";
}

// Cerrar modal
document.getElementById("closeModal").addEventListener("click", () => {
	document.getElementById("updateModal").style.display = "none";
});
window.addEventListener("click", (e) => {
	if (e.target == document.getElementById("updateModal")) {
		document.getElementById("updateModal").style.display = "none";
	}
});

// Submit form actualización
document.getElementById("updateForm").addEventListener("submit", (e) => {
	e.preventDefault();
	const id = document.getElementById("updateProdId").value;
	const data = {
		title: document.getElementById("updateTitle").value,
		description: document.getElementById("updateDescription").value,
		code: document.getElementById("updateCode").value,
		price: parseFloat(document.getElementById("updatePrice").value),
		stock: parseInt(document.getElementById("updateStock").value),
		category: document.getElementById("updateCategory").value,
		status: document.getElementById("updateStatus").value === "true",
	};

	socket.emit("product:update", { id, data });
	document.getElementById("updateModal").style.display = "none";

	const li = document.querySelector(`.updateBtn[data-id="${id}"]`).parentElement;
	li.querySelector(".title").textContent = data.title;
	li.querySelector(".description").textContent = data.description || "";
	li.querySelector(".meta").innerHTML = `
        <span class="price">$${data.price}</span> —
        <small>ID: ${id}</small> —
        <small>Code: ${data.code}</small> —
        <small>Stock: ${data.stock}</small> —
        <small>Category: ${data.category}</small> —
        <small>Status: ${data.status ? "Active" : "Inactive"}</small>
    `;
});

// Crear producto
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

// Eliminar producto
document.getElementById("deleteForm").addEventListener("submit", (e) => {
	e.preventDefault();
	const id = e.target.prodId.value.trim();
	socket.emit("product:delete", id);
	e.target.reset();
});

// Escuchar lista de productos
socket.on("products:list", renderProducts);
