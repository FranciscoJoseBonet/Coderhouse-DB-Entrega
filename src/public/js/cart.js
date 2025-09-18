document.addEventListener("DOMContentLoaded", () => {
	const cartList = document.getElementById("cartList");
	const cartId = cartList?.dataset.cartId;

	if (!cartId) return;

	// DELETE
	cartList.querySelectorAll(".btn-delete").forEach((btn) => {
		btn.addEventListener("click", async (e) => {
			const li = e.target.closest("li");
			const productId = li.dataset.productId;
			if (!confirm("¿Querés eliminarlo?")) return;

			try {
				const res = await fetch(`/api/carts/${cartId}/products/${productId}`, {
					method: "DELETE",
				});
				const data = await res.json();
				if (res.ok) {
					alert("Producto eliminado correctamente");
					location.reload();
				} else {
					alert(data.error || "Error al eliminar el producto");
				}
			} catch (err) {
				console.error(err);
				alert("Error al eliminar el producto");
			}
		});
	});

	// UPDATE
	cartList.querySelectorAll(".btn-update").forEach((btn) => {
		btn.addEventListener("click", async (e) => {
			const li = e.target.closest("li");
			const productId = li.dataset.productId;
			const cartId = cartList.dataset.cartId;

			const quantity = parseInt(prompt("Ingrese la nueva cantidad:", "1"));
			if (isNaN(quantity) || quantity < 1) {
				alert("Cantidad inválida");
				return;
			}

			try {
				const res = await fetch(`/api/carts/${cartId}/products/${productId}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ quantity }), // ✅ sólo la cantidad
				});
				const data = await res.json();

				if (res.ok) {
					alert("Cantidad actualizada correctamente");
					location.reload();
				} else {
					alert(data.error || "Error al actualizar la cantidad");
				}
			} catch (err) {
				console.error(err);
				alert("Error al actualizar la cantidad");
			}
		});
	});
});
