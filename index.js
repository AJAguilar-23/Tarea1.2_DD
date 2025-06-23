import express from 'express';
import productosData from './local_db/productos.json' with { type: 'json' };

const app = express()
const PORT = process.env.PORT || 3000 
app.use(express.json())

let productos = productosData;

app.get('/', (req, res) => {
    res.send('<h1>Hola mundo desde Express!!</h1>')
})

// GET /productos: Retorna un listado con todos los productos. 
app.get('/productos', (req, res) => {
  res.json(productos);
});


// GET /productos/disponibles: Devuelve únicamente los productos que están marcados como disponibles (disponible: true). 
app.get('/productos/disponibles', (req, res) => {

    // Filtra los productos donde la propiedad 'disponible' es verdadera
    const productosDisponibles = productos.filter(p => p.disponible === true)
    res.json(productosDisponibles)
})

// GET /productos/:id: Retorna la información del producto con el ID especificado.
app.get('/productos/:id', (req, res) => {
  const { id } = req.params;
  const parsedId = Number(id);

  // Validar que el ID sea un número
  if (isNaN(parsedId)) {
    return res.status(400).json({ message: 'El ID debe ser un número válido.' }); 
  }

  const producto = productos.find(p => p.id === parsedId);

  // Producto no encontrado
  if (!producto) {
    return res.status(404).json({ message: 'Producto no encontrado.' }); 
  }

  res.json(producto);
});


// POST /productos: Permite agregar un nuevo producto.
app.post('/productos', async (req, res) => { 
  const { nombre, precio, descripcion, disponible } = req.body;

  // 1. El campo nombre es obligatorio.
  if (!nombre) {
    return res.status(400).json({ message: 'El campo "nombre" es obligatorio.' });
  }

  // 2. El precio debe ser un número positivo mayor a cero.
  if (typeof precio !== 'number' || precio <= 0) {
    return res.status(400).json({ message: 'El campo "precio" debe ser un número positivo mayor a cero.' }); 
  }

  // 3. La descripcion debe tener un mínimo de 10 caracteres.
  if (!descripcion || descripcion.length < 10) {
    return res.status(400).json({ message: 'El campo "descripcion" debe tener un mínimo de 10 caracteres.' });
  }

  //Asignar automáticamente id único y fecha_ingreso
  const newId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;
  const fechaIngreso = new Date().toLocaleString('es-ES', { hour12: false });

  const nuevoProducto = {
    id: newId,
    nombre,
    precio,
    descripcion,
    disponible: typeof disponible === 'boolean' ? disponible : true, // Por defecto true si no se especifica
    fecha_ingreso: fechaIngreso,
  };

  productos.push(nuevoProducto); // Agrega el producto al array en memoria


  res.status(201).json(nuevoProducto); // 201 Created
});

// PUT /productos/:id: Permite modificar los datos de un producto existente.
app.put('/productos/:id', async (req, res) => {
    const { id } = req.params
    const parsedId = Number(id)

    // Validar que el ID sea un número válido
    if (isNaN(parsedId)) {
        return res.status(400).json({
            message: 'El ID del producto debe ser un número válido.'
        })
    }

    // Busca el índice del producto a actualizar
    const index = productos.findIndex(p => p.id === parsedId)

    // Si el producto no se encuentra, retorna un error 404
    if (index === -1) {
        return res.status(404).json({ // 404 Not Found: Producto no encontrado 
            message: 'Producto no encontrado.'
        })
    }

    const { nombre, precio, descripcion, disponible } = req.body

    // Validaciones de datos de entrada para la actualización (todos los campos son esperados para un PUT completo) 
    if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) {
        return res.status(400).json({ message: 'El campo "nombre" es obligatorio y debe ser un texto válido.' })
    }
    if (typeof precio !== 'number' || precio <= 0) {
        return res.status(400).json({ message: 'El campo "precio" debe ser un número positivo mayor a cero.' })
    }
    if (typeof descripcion !== 'string' || descripcion.length < 10) {
        return res.status(400).json({ message: 'El campo "descripcion" debe tener un mínimo de 10 caracteres.' })
    }
    if (typeof disponible !== 'boolean') {
        return res.status(400).json({ message: 'El campo "disponible" es obligatorio y debe ser un valor booleano (true o false).' })
    }

    // Mantiene el ID original y la fecha de ingreso del producto existente
    const productoExistente = productos[index];
    const productoActualizado = {
        id: productoExistente.id, // El ID no debe cambiar
        nombre: nombre.trim(),
        precio,
        descripcion: descripcion.trim(),
        disponible,
        fecha_ingreso: productoExistente.fecha_ingreso //! La fecha de ingreso no debe cambiar
    }

    productos[index] = productoActualizado; // Reemplaza el producto existente con el actualizado en memoria

    res.json({
        message: 'Producto actualizado correctamente.',
        producto: productoActualizado
    })
})

// DELETE /productos/:id: Elimina un producto con base en su ID.
app.delete('/productos/:id', async (req, res) => {
    const { id } = req.params
    const parsedId = Number(id)

    // Validar que el ID sea un número válido
    if (isNaN(parsedId)) {
        return res.status(400).json({
            message: 'El ID del producto debe ser un número válido.'
        })
    }

    // Busca el índice del producto a eliminar
    const index = productos.findIndex(p => p.id === parsedId)

    // Si el producto no se encuentra, retorna un error 404
    if (index === -1) {
        return res.status(404).json({
            message: 'Producto no encontrado.'
        })
    }

    productos.splice(index, 1); // Elimina el producto del array en memoria 

    res.status(200).json({ // 200 OK: Eliminación exitosa
        message: 'Producto eliminado correctamente.',
        deletedId: parsedId
    })
})
// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});


