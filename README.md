# Tarea1.2_DD

Esta es una API REST construida con Node.js y Express para gestionar productos almacenados en un archivo local JSON. Permite operaciones CRUD (Crear, Leer, Actualizar, Eliminar) y filtra productos disponibles.

Requisitos
-------------
- Node.js v18 o superior
- npm (gestor de paquetes)

Instalación
--------------
1. Clona este repositorio:

   git clone https://github.com/AJAguilar-23/Tarea1.2_DD.git
   cd tu-repo

2. Instala las dependencias:

   npm install

Ejecutar la API
------------------
En modo desarrollo (con recarga automática si usás --watch):

   npm run dev

En modo normal:

   node index.js

La API estará disponible en:
http://localhost:3000

Rutas disponibles
--------------------

Método | Ruta                      | Descripción
-------|---------------------------|----------------------------------------------------------
GET    | /                         | Página de bienvenida (HTML simple).
GET    | /productos                | Retorna todos los productos.
GET    | /productos/disponibles    | Retorna solo los productos con disponible: true.
GET    | /productos/:id            | Retorna un producto por su ID.
POST   | /productos                | Agrega un nuevo producto. Requiere: nombre, precio, descripcion.
PUT    | /productos/:id            | Modifica completamente un producto existente por ID.
DELETE | /productos/:id            | Elimina un producto por ID.
