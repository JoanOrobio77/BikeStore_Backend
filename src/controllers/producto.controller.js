const db = require('../config/db.config');

// Crear un nuevo producto
exports.create = async (req, res) => {
    try {
        const { nombre_producto, descripcion, precio, id_categoria } = req.body;
        const imagen = req.file ? req.file.buffer : null;

        const [result] = await db.execute(
            'INSERT INTO Producto (nombre_producto, descripcion, precio, imagen, id_categoria) VALUES (?, ?, ?, ?, ?)',
            [nombre_producto, descripcion, precio, imagen, id_categoria]
        );

        res.status(201).json({ message: 'Producto creado exitosamente', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear producto', error: error.message });
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

        const [result] = await db.execute(
            'UPDATE Producto SET nombre_producto = ?, descripcion = ?, precio = ?, imagen = ?, id_categoria = ? WHERE id_producto = ?',
            [nombre_producto, descripcion, precio, imagen, id_categoria, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json({ message: 'Producto actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
    }
};

// Eliminar un producto
exports.delete = async (req, res) => {
    try {
        const [result] = await db.execute('DELETE FROM Producto WHERE id_producto = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
    }
}; 