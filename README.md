
# 🛠️ API de Productos y Carritos

Esta API permite gestionar productos y carritos de compra utilizando Node.js y Express. Los datos se almacenan en archivos `.json`, sin uso de bases de datos externas. Ideal para prácticas de desarrollo backend con persistencia básica.

---

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- npm (v9 o superior)

---

## ⚙️ Instalación

1. Clonar este repositorio:

```bash
git clone <url-del-repositorio>
cd <nombre-del-proyecto>
```

2. Instalar las dependencias necesarias:

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

## 🧾 Estructura de Archivos Esperada

```
/src
  ├── routers
  │   ├── products.routers.js
  │   └── carts.routers.js
  ├── managers
  │   ├── ProductManager.js
  │   └── CartManager.js
  └── data
      ├── products.json
      └── carts.json
```

---

## 🧠 Descripción General

### 📁 Productos

**Base URL:** `/api/products`

| Método | Ruta                 | Descripción                            |
|--------|----------------------|----------------------------------------|
| GET    | /api/products        | Obtiene todos los productos            |
| POST   | /api/products        | Crea un nuevo producto                 |
| GET    | /api/products/:pid   | Obtiene un producto por ID             |
| PUT    | /api/products/:pid   | Actualiza un producto por ID           |
| DELETE | /api/products/:pid   | Elimina un producto por ID             |

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

| Método | Ruta                                 | Descripción                                      |
|--------|--------------------------------------|--------------------------------------------------|
| GET    | /api/carts                           | Obtiene todos los carritos                      |
| POST   | /api/carts                           | Crea un nuevo carrito vacío                     |
| GET    | /api/carts/:cid                      | Obtiene un carrito específico por ID            |
| POST   | /api/carts/:cid/product/:pid         | Agrega un producto al carrito (o incrementa)    |

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
