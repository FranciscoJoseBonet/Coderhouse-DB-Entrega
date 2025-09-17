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

## 🧠 Descripción General

### 📁 Productos

**Base URL:** `/api/products`

| Método | Ruta               | Descripción                                          |
| ------ | ------------------ | ---------------------------------------------------- |
| GET    | /api/products      | Obtiene todos los productos (paginados y filtrables) |
| POST   | /api/products      | Crea un nuevo producto                               |
| GET    | /api/products/:pid | Obtiene un producto por ID                           |
| PUT    | /api/products/:pid | Actualiza un producto por ID                         |
| DELETE | /api/products/:pid | Elimina un producto por ID                           |

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

| Método | Ruta                          | Descripción                                            |
| ------ | ----------------------------- | ------------------------------------------------------ |
| GET    | /api/carts                    | Obtiene todos los carritos                             |
| POST   | /api/carts                    | Crea un nuevo carrito vacío                            |
| GET    | /api/carts/:cid               | Obtiene un carrito específico por ID (renderiza vista) |
| POST   | /api/carts/:cid/products/:pid | Agrega un producto al carrito (o incrementa)           |
| PUT    | /api/carts/:cid/products/:pid | Actualiza cantidad de un producto en el carrito        |
| DELETE | /api/carts/:cid/products/:pid | Elimina un producto del carrito                        |
| DELETE | /api/carts/:cid/empty         | Vacía el carrito completo                              |
| DELETE | /api/carts/:cid               | Elimina el carrito                                     |

---

## 🖥️ Vistas con Handlebars

- `/`  
  Muestra la lista de productos con filtros y paginación (`home.handlebars`).

- `/realtimeproducts`  
  Vista en tiempo real de productos. Permite agregar, eliminar y paginar productos usando formularios y actualiza la lista automáticamente mediante WebSocket (`realTimeProducts.handlebars`).

- `/api/carts/cart-view`  
  Muestra todos los carritos (`allCarts.handlebars`).

- `/api/carts/:cid`  
  Muestra el detalle de un carrito específico (`cart.handlebars`).

---

## 🔄 Productos en Tiempo Real (WebSocket)

La vista `/realtimeproducts` utiliza Socket.io para mostrar la lista de productos en tiempo real.

- Al agregar, eliminar o paginar productos desde el formulario, la lista se actualiza automáticamente para todos los clientes conectados.
- El frontend se comunica con el backend mediante eventos de WebSocket definidos en `public/js/realTimeScript.js`.
- El backend utiliza los servicios y controladores para obtener los productos paginados y filtrados.

---

## 🧪 Probar con Postman

### Crear un nuevo producto

- **Método:** POST
- **URL:** `http://localhost:8080/api/products`
- **Body:** (formato JSON como el anterior)

### Crear un nuevo carrito

- **Método:** POST
- **URL:** `http://localhost:8080/api/carts`
- **Body:** `{}`

---

## 👨‍💻 Autor

Francisco Bonet

---
