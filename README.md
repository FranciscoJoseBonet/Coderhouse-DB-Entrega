# 🛠️ API de Productos y Carritos

Esta API permite gestionar productos y carritos de compra utilizando Node.js y Express. Los datos se almacenan en archivos `.json`, sin uso de bases de datos externas. Incluye vistas dinámicas con Handlebars y una vista en tiempo real de productos usando WebSocket (Socket.io).

---

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- npm (v9 o superior)

---

## ⚙️ Instalación

1. Clona este repositorio:

   ```bash
   git clone <url-del-repositorio>
   cd <nombre-del-proyecto>
   ```

2. Instala las dependencias necesarias:

   ```bash
   npm install
   ```

---

## 🚀 Ejecución del Servidor

Para iniciar el servidor:

```bash
npm start
```

> El servidor quedará escuchando en:
> **http://localhost:8080**

---

## 🧾 Estructura de Archivos

```
/src
  ├── app.js
  ├── index.js
  ├── controllers/
  │     └── views.controller.js
  ├── routers/
  │     ├── products.routers.js
  │     ├── carts.routers.js
  │     └── views.routers.js
  ├── managers/
  │     ├── ProductManager.js
  │     └── CartManager.js
  ├── data/
  │     ├── products.json
  │     └── carts.json
  ├── public/
  │     └── js/
  │           └── realTimeScript.js
  └── views/
        ├── home.handlebars
        ├── realTimeProducts.handlebars
        └── layouts/
              └── main.handlebars
```

---

## 🧠 Descripción General

### 📁 Productos

**Base URL:** `/api/products`

| Método | Ruta               | Descripción                  |
| ------ | ------------------ | ---------------------------- |
| GET    | /api/products      | Obtiene todos los productos  |
| POST   | /api/products      | Crea un nuevo producto       |
| GET    | /api/products/:pid | Obtiene un producto por ID   |
| PUT    | /api/products/:pid | Actualiza un producto por ID |
| DELETE | /api/products/:pid | Elimina un producto por ID   |

#### 💡 Ejemplo de Body para POST `/api/products`

```json
{
	"title": "Teclado Mecánico",
	"description": "Teclado con switches rojos",
	"code": "TEC123",
	"price": 150,
	"status": true,
	"stock": 25,
	"category": "Periféricos",
	"thumbnails": ["img1.jpg", "img2.jpg"]
}
```

---

### 🛒 Carritos

**Base URL:** `/api/carts`

| Método | Ruta                         | Descripción                                  |
| ------ | ---------------------------- | -------------------------------------------- |
| GET    | /api/carts                   | Obtiene todos los carritos                   |
| POST   | /api/carts                   | Crea un nuevo carrito vacío                  |
| GET    | /api/carts/:cid              | Obtiene un carrito específico por ID         |
| POST   | /api/carts/:cid/product/:pid | Agrega un producto al carrito (o incrementa) |

---

## 🖥️ Vistas con Handlebars

- `/`  
  Muestra la lista de productos renderizada desde `products.json` usando Handlebars (`home.handlebars`).

- `/realtimeproducts`  
  Vista en tiempo real de productos. Permite agregar y eliminar productos usando formularios y actualiza la lista automáticamente mediante WebSocket (`realTimeProducts.handlebars`).

---

## 🔄 Productos en Tiempo Real (WebSocket)

La vista `/realtimeproducts` utiliza Socket.io para mostrar la lista de productos en tiempo real.

- Al agregar o eliminar productos desde el formulario, la lista se actualiza automáticamente para todos los clientes conectados.
- El frontend se comunica con el backend mediante eventos de WebSocket definidos en `public/js/realTimeScript.js`.

---

## 📦 Formato de Archivos `.json`

Ejemplo de `products.json`:

```json
[
	{
		"id": 1,
		"title": "Teclado Mecánico",
		"description": "Teclado con switches rojos",
		"code": "TEC123",
		"price": 150,
		"status": true,
		"stock": 25,
		"category": "Periféricos",
		"thumbnails": ["img1.jpg", "img2.jpg"]
	}
]
```

Ejemplo de `carts.json`:

```json
[
	{
		"id": 1,
		"products": [
			{
				"product": 1,
				"quantity": 2
			}
		]
	}
]
```

---

## 🧪 Probar con Postman

### Crear un nuevo producto

- **Método:** POST
- **URL:** `http://localhost:8080/api/products`
- **Body:** (formato JSON como el anterior)

---

## 👨‍💻 Autor

Francisco
