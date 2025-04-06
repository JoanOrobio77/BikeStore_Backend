const db = require('../config/db.config');

// Crear una nueva venta
exports.create = async (req, res) => {
    try {
        const { fecha_venta, id_usuario, total, detalles } = req.body;
        
        // Iniciar transacción
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // Insertar la venta
            const [result] = await connection.execute(
                'INSERT INTO Ventas (fecha_venta, id_usuario, total) VALUES (?, ?, ?)',
                [fecha_venta, id_usuario, total]
            );

            const id_venta = result.insertId;

            // Insertar detalles de venta
            for (const detalle of detalles) {
                await connection.execute(
                    'INSERT INTO Detalle_Venta (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
                    [id_venta, detalle.id_producto, detalle.cantidad, detalle.precio_unitario, detalle.subtotal]
                );

                // Actualizar stock
                await connection.execute(
                    'UPDATE Stock SET cantidad = cantidad - ? WHERE id_producto = ?',
                    [detalle.cantidad, detalle.id_producto]
                );
            }

            await connection.commit();
            res.status(201).json({ message: 'Venta creada exitosamente', id: id_venta });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al crear venta', error: error.message });
    }
};

// Obtener todas las ventas
exports.findAll = async (req, res) => {
    try {
        const [ventas] = await db.execute(`
            SELECT v.*, u.nombre as nombre_usuario 
            FROM Ventas v 
            JOIN Usuarios u ON v.id_usuario = u.id_usuario
        `);
        res.status(200).json(ventas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener ventas', error: error.message });
    }
};

// Obtener una venta por ID
exports.findOne = async (req, res) => {
    try {
        const [venta] = await db.execute(`
            SELECT v.*, u.nombre as nombre_usuario 
            FROM Ventas v 
            JOIN Usuarios u ON v.id_usuario = u.id_usuario 
            WHERE v.id_venta = ?
        `, [req.params.id]);

        if (venta.length === 0) {
            return res.status(404).json({ message: 'Venta no encontrada' });
        }

        // Obtener detalles de la venta
        const [detalles] = await db.execute(`
            SELECT dv.*, p.nombre_producto 
            FROM Detalle_Venta dv 
            JOIN Producto p ON dv.id_producto = p.id_producto 
            WHERE dv.id_venta = ?
        `, [req.params.id]);

        res.status(200).json({
            ...venta[0],
            detalles
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener venta', error: error.message });
    }
};

// Actualizar una venta
exports.update = async (req, res) => {
    try {
        const { fecha_venta, id_usuario, total } = req.body;
        const [result] = await db.execute(
            'UPDATE Ventas SET fecha_venta = ?, id_usuario = ?, total = ? WHERE id_venta = ?',
            [fecha_venta, id_usuario, total, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Venta no encontrada' });
        }

        res.status(200).json({ message: 'Venta actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar venta', error: error.message });
    }
};

// Eliminar una venta
exports.delete = async (req, res) => {
    try {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // Eliminar detalles de venta
            await connection.execute('DELETE FROM Detalle_Venta WHERE id_venta = ?', [req.params.id]);

            // Eliminar venta
            const [result] = await connection.execute('DELETE FROM Ventas WHERE id_venta = ?', [req.params.id]);

            if (result.affectedRows === 0) {
                await connection.rollback();
                return res.status(404).json({ message: 'Venta no encontrada' });
            }

            await connection.commit();
            res.status(200).json({ message: 'Venta eliminada exitosamente' });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar venta', error: error.message });
    }
}; 