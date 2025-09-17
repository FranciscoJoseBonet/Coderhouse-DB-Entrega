async function vaciarCarrito(cartId) {
	if (!confirm("¿Querés vaciar este carrito?")) return;
	try {
		const res = await fetch(`/api/carts/${cartId}/empty`, { method: "DELETE" });
		const data = await res.json();
		if (data.success) {
			alert("Carrito vaciado\ncorrectamente");
			location.reload();
		} else {
			alert(data.message || "Error al vaciar el carrito");
		}
	} catch (err) {
		console.error(err);
		alert("Error al vaciar el carrito");
	}
}
async function eliminarCarrito(cartId) {
	if (!confirm("¿Querés eliminar este carrito completamente?")) return;
	try {
		const res = await fetch(`/api/carts/${cartId}`, { method: "DELETE" });
		const data = await res.json();
		if (data.success) {
			alert("Carrito eliminado\ncorrectamente");
			location.reload();
		} else {
			alert(data.message || "Error al eliminar el carrito");
		}
	} catch (err) {
		console.error(err);
		alert("Error al eliminar el carrito");
	}
}

async function crearCarrito() {
	try {
		const res = await fetch("/api/carts", { method: "POST" });
		const data = await res.json();

		if (data.success) {
			location.reload();
		} else {
			alert(data.message || "Error al crear el carrito");
		}
	} catch (err) {
		console.error(err);
		alert("Error al crear el carrito");
	}
}
