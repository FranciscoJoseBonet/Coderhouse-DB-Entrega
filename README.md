---
# 🛠️ API de Productos y Carritos

Esta API permite gestionar productos y carritos de compra utilizando Node.js, Express y MongoDB (a través de Mongoose). Incluye vistas dinámicas con Handlebars y una vista en tiempo real de productos usando WebSocket (Socket.io).
---

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- npm (v9 o superior)
- Una instancia de MongoDB (local o Atlas)

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

3. Configura tu cadena de conexión a MongoDB en `src/app.js`:

```js
mongoose.connect(
	"mongodb+srv://<usuario>:<password>@<cluster>/<dbname>?retryWrites=true&w=majority"
);
```

---

## 🚀 Ejecución del Servidor

```bash
npm run dev
```

> El servidor quedará escuchando en: **[http://localhost:8080](http://localhost:8080)**

---

## 🧾 Estructura de Archivos

```
/src
  ├── app.js
  ├── index.js
  ├── controllers/
  │     ├── carts.controller.js
  │     ├── products.controller.js
  │     └── views.controller.js
  ├── models/
  │     ├── carts.model.js
  │     └── products.model.js
  ├── public/
  │     ├── css/
  │     └── js/
  ├── routers/
  │     ├── carts.routers.js
  │     ├── products.routers.js
  │     └── views.routers.js
  ├── services/
  │     ├── carts.service.js
  │     └── products.service.js
  └── views/
        ├── allCarts.handlebars
        ├── cart.handlebars
        ├── home.handlebars
        ├── realTimeProducts.handlebars
        └── layouts/
              └── main.handlebars
```

---

## 🧠 Endpoints

### 📁 Productos

**Base URL:** `/api/products`

| Método | Ruta                | Descripción                                                          |
| ------ | ------------------- | -------------------------------------------------------------------- |
| GET    | /api/products       | Obtiene todos los productos en formato JSON (paginados y filtrables) |
| GET    | /api/products/\:pid | Obtiene un producto específico por ID                                |
| POST   | /api/products       | Crea un nuevo producto                                               |
| PUT    | /api/products/\:pid | Actualiza un producto por ID                                         |
| DELETE | /api/products/\:pid | Elimina un producto por ID                                           |

#### 💡 Ejemplo de Body para POST `/api/products`

```json
{
	"title": "Teclado Mecánico",
	"description": "Teclado con switches rojos",
	"code": "TEC123",
	"price": 150,
	"status": true,
	"stock": 25,
	"category": "Periféricos"
}
```

---

### 🛒 Carritos

**Base URL:** `/api/carts`

| Método | Ruta                  | Descripción                                                            |
| ------ | --------------------- | ---------------------------------------------------------------------- |
| GET    | /api/carts            | Obtiene todos los carritos                                             |
| POST   | /api/carts            | Crea un nuevo carrito vacío                                            |
| GET    | /\:cid                | Renderiza la vista del carrito específico                              |
| POST   | /\:cid/products/\:pid | Agrega un producto al carrito o incrementa su cantidad                 |
| PUT    | /\:cid/products/\:pid | Actualiza la cantidad de un producto específico                        |
| PUT    | /\:cid                | Actualiza todos los productos del carrito (reemplaza arreglo completo) |
| DELETE | /\:cid/products/\:pid | Elimina un producto específico del carrito                             |
| DELETE | /\:cid/empty          | Vacía el carrito completo                                              |
| DELETE | /\:cid                | Elimina el carrito completo                                            |

#### 💡 Ejemplo de Body para PUT `/api/carts/:cid`

```json
{
	"products": [
		{ "productId": "64f1a0c5d2b9c8e5f1234567", "quantity": 2 },
		{ "productId": "64f1a0c5d2b9c8e5f7654321", "quantity": 1 }
	]
}
```

---

## 🖥️ Vistas con Handlebars

| Ruta                | Vista                       | Descripción                                                          |
| ------------------- | --------------------------- | -------------------------------------------------------------------- |
| `/`                 | home.handlebars             | Lista de productos en formato JSON (usado para filtros y paginación) |
| `/home`             | home.handlebars             | Renderiza la lista de productos con filtros y paginación             |
| `/realtimeproducts` | realTimeProducts.handlebars | Vista de productos en tiempo real usando WebSocket                   |
| `/cartsList`        | allCarts.handlebars         | Lista de todos los carritos                                          |
| `/:cid`             | cart.handlebars             | Detalle de un carrito específico                                     |

---

## 🔄 Productos en Tiempo Real (WebSocket)

- La vista `/realtimeproducts` permite agregar, eliminar y paginar productos con actualización instantánea.
- El frontend se comunica con el backend mediante eventos de Socket.io definidos en `public/js/realTimeScript.js`.
- El backend utiliza los servicios y controladores para manejar los productos de manera dinámica.

---

## 🧪 Probar con Postman

### Crear un nuevo producto

- **Método:** POST
- **URL:** `http://localhost:8080/api/products`
- **Body:** JSON como se mostró anteriormente

### Crear un nuevo carrito

- **Método:** POST
- **URL:** `http://localhost:8080/api/carts`
- **Body:** `{}`

### Agregar un producto a un carrito

- **Método:** POST
- **URL:** `http://localhost:8080/api/carts/:cid/products/:pid`
- **Body:** `{ "quantity": 1 }` (opcional, por defecto incrementa en 1)

### Actualizar todos los productos del carrito

- **Método:** PUT
- **URL:** `http://localhost:8080/api/carts/:cid`
- **Body:** Arreglo de productos con `productId` y `quantity`

---

## 👨‍💻 Autor

Francisco Bonet

---
