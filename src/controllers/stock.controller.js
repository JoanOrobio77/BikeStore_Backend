const db = require('../config/db.config');

// Crear un nuevo registro de stock
exports.create = async (req, res) => {
    try {
        const { id_producto, cantidad, fecha_ingreso, fecha_salida } = req.body;
        
        const [result] = await db.execute(
            'INSERT INTO Stock (id_producto, cantidad, fecha_ingreso, fecha_salida) VALUES (?, ?, ?, ?)',
            [id_producto, cantidad, fecha_ingreso, fecha_salida]
        );

        res.status(201).json({ message: 'Registro de stock creado exitosamente', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear registro de stock', error: error.message });
    }
};

// Obtener todo el stock
exports.findAll = async (req, res) => {
    try {
        const [stock] = await db.execute(`
            SELECT s.*, p.nombre_producto 
            FROM Stock s 
            JOIN Producto p ON s.id_producto = p.id_producto
        `);
        res.status(200).json(stock);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener stock', error: error.message });
    }
};

// Obtener stock por ID
exports.findOne = async (req, res) => {
    try {
        const [stock] = await db.execute(`
            SELECT s.*, p.nombre_producto 
            FROM Stock s 
            JOIN Producto p ON s.id_producto = p.id_producto 
            WHERE s.id_stock = ?
        `, [req.params.id]);

        if (stock.length === 0) {
            return res.status(404).json({ message: 'Registro de stock no encontrado' });
        }
        res.status(200).json(stock[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener registro de stock', error: error.message });
    }
};

// Actualizar stock
exports.update = async (req, res) => {
    try {
        const { id_producto, cantidad, fecha_ingreso, fecha_salida } = req.body;
        const [result] = await db.execute(
            'UPDATE Stock SET id_producto = ?, cantidad = ?, fecha_ingreso = ?, fecha_salida = ? WHERE id_stock = ?',
            [id_producto, cantidad, fecha_ingreso, fecha_salida, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Registro de stock no encontrado' });
        }

        res.status(200).json({ message: 'Registro de stock actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar registro de stock', error: error.message });
    }
};

// Eliminar stock
exports.delete = async (req, res) => {
    try {
        const [result] = await db.execute('DELETE FROM Stock WHERE id_stock = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Registro de stock no encontrado' });
        }

        res.status(200).json({ message: 'Registro de stock eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar registro de stock', error: error.message });
    }
}; 