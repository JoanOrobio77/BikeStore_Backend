const db = require('../config/db.config');

// Crear una nueva categoría
exports.create = async (req, res) => {
    try {
        const { nombre_categoria } = req.body;
        
        // Validar que el nombre no esté vacío
        if (!nombre_categoria || nombre_categoria.trim() === '') {
            return res.status(400).json({ message: 'El nombre de la categoría es requerido' });
        }

        // Validar longitud del nombre
        if (nombre_categoria.length > 40) {
            return res.status(400).json({ 
                message: 'El nombre de la categoría es demasiado largo. Máximo 40 caracteres.' 
            });
        }

        // Limpiar y normalizar el texto
        const nombreLimpio = nombre_categoria.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        // Verificar si la categoría ya existe
        const [existing] = await db.execute(
            'SELECT * FROM Categoria WHERE nombre_categoria = ?',
            [nombreLimpio]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Ya existe una categoría con ese nombre' });
        }

        const [result] = await db.execute(
            'INSERT INTO Categoria (nombre_categoria) VALUES (?)',
            [nombreLimpio]
        );

        res.status(201).json({ 
            message: 'Categoría creada exitosamente', 
            id: result.insertId,
            categoria: {
                id_categoria: result.insertId,
                nombre_categoria
            }
        });
    } catch (error) {
        console.error('Error al crear categoría:', error);
        res.status(500).json({ 
            message: 'Error al crear categoría', 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Obtener todas las categorías
exports.findAll = async (req, res) => {
    try {
        const [categorias] = await db.execute('SELECT * FROM Categoria ORDER BY nombre_categoria');
        res.status(200).json(categorias);
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({ 
            message: 'Error al obtener categorías', 
            error: error.message 
        });
    }
};

// Obtener una categoría por ID
exports.findOne = async (req, res) => {
    try {
        const [categoria] = await db.execute(
            'SELECT * FROM Categoria WHERE id_categoria = ?',
            [req.params.id]
        );

        if (categoria.length === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        res.status(200).json(categoria[0]);
    } catch (error) {
        console.error('Error al obtener categoría:', error);
        res.status(500).json({ 
            message: 'Error al obtener categoría', 
            error: error.message 
        });
    }
};

// Actualizar una categoría
exports.update = async (req, res) => {
    try {
        const { nombre_categoria } = req.body;
        
        // Validar que el nombre no esté vacío
        if (!nombre_categoria || nombre_categoria.trim() === '') {
            return res.status(400).json({ message: 'El nombre de la categoría es requerido' });
        }

        // Validar longitud del nombre
        if (nombre_categoria.length > 40) {
            return res.status(400).json({ 
                message: 'El nombre de la categoría es demasiado largo. Máximo 40 caracteres.' 
            });
        }

        // Limpiar y normalizar el texto
        const nombreLimpio = nombre_categoria.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        // Verificar si la categoría existe
        const [existing] = await db.execute(
            'SELECT * FROM Categoria WHERE id_categoria = ?',
            [req.params.id]
        );

        if (existing.length === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        // Verificar si ya existe otra categoría con el mismo nombre
        const [duplicate] = await db.execute(
            'SELECT * FROM Categoria WHERE nombre_categoria = ? AND id_categoria != ?',
            [nombreLimpio, req.params.id]
        );

        if (duplicate.length > 0) {
            return res.status(400).json({ message: 'Ya existe una categoría con ese nombre' });
        }

        await db.execute(
            'UPDATE Categoria SET nombre_categoria = ? WHERE id_categoria = ?',
            [nombreLimpio, req.params.id]
        );

        res.status(200).json({ 
            message: 'Categoría actualizada exitosamente',
            categoria: {
                id_categoria: req.params.id,
                nombre_categoria
            }
        });
    } catch (error) {
        console.error('Error al actualizar categoría:', error);
        res.status(500).json({ 
            message: 'Error al actualizar categoría', 
            error: error.message 
        });
    }
};

// Eliminar una categoría
exports.delete = async (req, res) => {
    try {
        // Verificar si la categoría existe
        const [existing] = await db.execute(
            'SELECT * FROM Categoria WHERE id_categoria = ?',
            [req.params.id]
        );

        if (existing.length === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        // Verificar si hay productos asociados a esta categoría
        const [products] = await db.execute(
            'SELECT COUNT(*) as count FROM Producto WHERE id_categoria = ?',
            [req.params.id]
        );

        if (products[0].count > 0) {
            return res.status(400).json({ 
                message: 'No se puede eliminar la categoría porque tiene productos asociados' 
            });
        }

        await db.execute(
            'DELETE FROM Categoria WHERE id_categoria = ?',
            [req.params.id]
        );

        res.status(200).json({ message: 'Categoría eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        res.status(500).json({ 
            message: 'Error al eliminar categoría', 
            error: error.message 
        });
    }
}; 