const db = require('../config/db.config');

// Crear un nuevo detalle de venta
exports.create = async (req, res) => {
    try {
        const { id_venta, id_producto, cantidad, precio_unitario, subtotal } = req.body;
        
        const [result] = await db.execute(
            'INSERT INTO Detalle_Venta (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
            [id_venta, id_producto, cantidad, precio_unitario, subtotal]
        );

        // Actualizar stock
        await db.execute(
            'UPDATE Stock SET cantidad = cantidad - ? WHERE id_producto = ?',
            [cantidad, id_producto]
        );

        res.status(201).json({ message: 'Detalle de venta creado exitosamente', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear detalle de venta', error: error.message });
    }
};

// Obtener todos los detalles de una venta
exports.findAll = async (req, res) => {
    try {
        const [detalles] = await db.execute(`
            SELECT dv.*, p.nombre_producto 
            FROM Detalle_Venta dv 
            JOIN Producto p ON dv.id_producto = p.id_producto 
            WHERE dv.id_venta = ?
        `, [req.params.ventaId]);

        res.status(200).json(detalles);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener detalles de venta', error: error.message });
    }
};

// Obtener un detalle de venta por ID
exports.findOne = async (req, res) => {
    try {
        const [detalle] = await db.execute(`
            SELECT dv.*, p.nombre_producto 
            FROM Detalle_Venta dv 
            JOIN Producto p ON dv.id_producto = p.id_producto 
            WHERE dv.id_detalle_venta = ?
        `, [req.params.id]);

        if (detalle.length === 0) {
            return res.status(404).json({ message: 'Detalle de venta no encontrado' });
        }
        res.status(200).json(detalle[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener detalle de venta', error: error.message });
    }
};

// Actualizar un detalle de venta
exports.update = async (req, res) => {
    try {
        const { id_venta, id_producto, cantidad, precio_unitario, subtotal } = req.body;
        const [result] = await db.execute(
            'UPDATE Detalle_Venta SET id_venta = ?, id_producto = ?, cantidad = ?, precio_unitario = ?, subtotal = ? WHERE id_detalle_venta = ?',
            [id_venta, id_producto, cantidad, precio_unitario, subtotal, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Detalle de venta no encontrado' });
        }

        res.status(200).json({ message: 'Detalle de venta actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar detalle de venta', error: error.message });
    }
};

// Eliminar un detalle de venta
exports.delete = async (req, res) => {
    try {
        const [result] = await db.execute('DELETE FROM Detalle_Venta WHERE id_detalle_venta = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Detalle de venta no encontrado' });
        }

        res.status(200).json({ message: 'Detalle de venta eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar detalle de venta', error: error.message });
    }
}; 