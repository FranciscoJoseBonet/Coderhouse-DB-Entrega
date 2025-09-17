document.addEventListener("DOMContentLoaded", () => {
	const modal = document.getElementById("cartModal");
	const selectCart = document.getElementById("selectCart");
	const inputQuantity = document.getElementById("inputQuantity");
	const btnCancel = document.getElementById("btnCancel");
	const btnConfirm = document.getElementById("btnConfirm");
	const modalError = document.getElementById("modalError");

	let currentProductId = null;
	let currentStock = 0;
	let carts = [];

	fetch("/api/carts/all-json")
		.then((res) => res.json())
		.then((data) => {
			carts = data;
			if (carts.length === 0) {
				selectCart.innerHTML = "<option disabled>No hay carritos disponibles</option>";
			} else {
				selectCart.innerHTML = carts
					.map((c) => `<option value="${c._id}">${c.name}</option>`)
					.join("");
			}
		});

	function openModal() {
		modal.classList.add("show");
		inputQuantity.value = 1;
		modalError.textContent = "";
		inputQuantity.focus();
	}

	function closeModal() {
		modal.classList.remove("show");
		setTimeout(() => {
			modal.style.display = "none";
		}, 300);
	}

	document.querySelectorAll(".btn-add-cart").forEach((btn) => {
		btn.addEventListener("click", (e) => {
			const li = e.target.closest("li");
			currentProductId = li.dataset.productId;
			currentStock = Number(li.dataset.stock);
			modal.style.display = "flex";
			requestAnimationFrame(openModal);
		});
	});

	btnCancel.addEventListener("click", closeModal);

	btnConfirm.addEventListener("click", () => {
		const quantity = Number(inputQuantity.value);
		const cartId = selectCart.value;

		if (quantity < 1) {
			modalError.textContent = "La cantidad debe ser mayor a 0";
			return;
		}

		if (quantity > currentStock) {
			modalError.textContent = `No hay suficiente stock. Stock disponible: ${currentStock}`;
			return;
		}

		fetch(`/api/carts/${cartId}/products/${currentProductId}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ quantity }),
		})
			.then((res) => res.json())
			.then((data) => {
				closeModal();
				alert("Producto agregado al carrito correctamente");
				location.reload();
			})
			.catch((err) => {
				modalError.textContent = "Error al agregar al carrito";
				console.error(err);
			});
	});
});
