const db = require('../config/db.config');

// Crear un nuevo producto
exports.create = async (req, res) => {
    try {
        const { nombre_producto, descripcion, precio, id_categoria } = req.body;
        const imagen = req.file ? req.file.buffer : null;

        // Validar campos requeridos
        if (!nombre_producto || !descripcion || !precio || !id_categoria) {
            return res.status(400).json({ 
                message: 'Todos los campos son requeridos',
                missing: {
                    nombre_producto: !nombre_producto,
                    descripcion: !descripcion,
                    precio: !precio,
                    id_categoria: !id_categoria
                }
            });
        }

        // Validar longitud de la descripción
        if (descripcion.length > 65535) {
            return res.status(400).json({ 
                message: 'La descripción es demasiado larga. Máximo 65535 caracteres.' 
            });
        }

        // Limpiar y normalizar el texto
        const nombreLimpio = nombre_producto.trim();
        const descripcionLimpia = descripcion.trim();

        const [result] = await db.execute(
            'INSERT INTO Producto (nombre_producto, descripcion, precio, imagen, id_categoria) VALUES (?, ?, ?, ?, ?)',
            [nombreLimpio, descripcionLimpia, precio, imagen, id_categoria]
        );

        res.status(201).json({ 
            message: 'Producto creado exitosamente', 
            id: result.insertId,
            producto: {
                id_producto: result.insertId,
                nombre_producto: nombreLimpio,
                descripcion: descripcionLimpia,
                precio,
                id_categoria
            }
        });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ 
            message: 'Error al crear producto', 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Obtener todos los productos
exports.findAll = async (req, res) => {
    try {
        const [productos] = await db.execute('SELECT * FROM Producto');
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos', error: error.message });
    }
};

// Obtener un producto por ID
exports.findOne = async (req, res) => {
    try {
        const [producto] = await db.execute('SELECT * FROM Producto WHERE id_producto = ?', [req.params.id]);
        if (producto.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json(producto[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener producto', error: error.message });
    }
};

// Actualizar un producto
exports.update = async (req, res) => {
    try {
        const { nombre_producto, descripcion, precio, id_categoria } = req.body;
        const imagen = req.file ? req.file.buffer : null;

        // Validar campos requeridos
        if (!nombre_producto || !descripcion || !precio || !id_categoria) {
            return res.status(400).json({ 
                message: 'Todos los campos son requeridos'
            });
        }

        // Limpiar y normalizar el texto
        const nombreLimpio = nombre_producto.trim();
        const descripcionLimpia = descripcion.trim();

        const [result] = await db.execute(
            'UPDATE Producto SET nombre_producto = ?, descripcion = ?, precio = ?, imagen = ?, id_categoria = ? WHERE id_producto = ?',
            [nombreLimpio, descripcionLimpia, precio, imagen, id_categoria, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json({ 
            message: 'Producto actualizado exitosamente',
            producto: {
                id_producto: parseInt(req.params.id),
                nombre_producto: nombreLimpio,
                descripcion: descripcionLimpia,
                precio,
                id_categoria
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
    }
};

// Eliminar un producto
exports.delete = async (req, res) => {
    try {
        // Verificar si el producto existe
        const [producto] = await db.execute(
            'SELECT * FROM Producto WHERE id_producto = ?',
            [req.params.id]
        );

        if (producto.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Verificar si hay registros en Stock
        const [stockRegistros] = await db.execute(
            'SELECT COUNT(*) as count FROM Stock WHERE id_producto = ?',
            [req.params.id]
        );

        if (stockRegistros[0].count > 0) {
            return res.status(400).json({ 
                message: 'No se puede eliminar el producto porque tiene registros de stock asociados. Elimine primero los registros de stock.' 
            });
        }

        // Verificar si hay registros en Detalle_Venta
        const [ventasRegistros] = await db.execute(
            'SELECT COUNT(*) as count FROM Detalle_Venta WHERE id_producto = ?',
            [req.params.id]
        );

        if (ventasRegistros[0].count > 0) {
            return res.status(400).json({ 
                message: 'No se puede eliminar el producto porque tiene ventas asociadas.' 
            });
        }

        // Si no hay registros relacionados, proceder con la eliminación
        const [result] = await db.execute(
            'DELETE FROM Producto WHERE id_producto = ?', 
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ 
            message: 'Error al eliminar producto', 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}; 