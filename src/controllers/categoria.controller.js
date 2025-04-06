const db = require('../config/db.config');

// Crear una nueva categoría
exports.create = async (req, res) => {
    try {
        const { nombre_categoria } = req.body;
        
        const [result] = await db.execute(
            'INSERT INTO Categoria (nombre_categoria) VALUES (?)',
            [nombre_categoria]
        );

        res.status(201).json({ message: 'Categoría creada exitosamente', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear categoría', error: error.message });
    }
};

// Obtener todas las categorías
exports.findAll = async (req, res) => {
    try {
        const [categorias] = await db.execute('SELECT * FROM Categoria');
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener categorías', error: error.message });
    }
};

// Obtener una categoría por ID
exports.findOne = async (req, res) => {
    try {
        const [categoria] = await db.execute('SELECT * FROM Categoria WHERE id_categoria = ?', [req.params.id]);
        if (categoria.length === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        res.status(200).json(categoria[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener categoría', error: error.message });
    }
};

// Actualizar una categoría
exports.update = async (req, res) => {
    try {
        const { nombre_categoria } = req.body;
        const [result] = await db.execute(
            'UPDATE Categoria SET nombre_categoria = ? WHERE id_categoria = ?',
            [nombre_categoria, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        res.status(200).json({ message: 'Categoría actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar categoría', error: error.message });
    }
};

// Eliminar una categoría
exports.delete = async (req, res) => {
    try {
        const [result] = await db.execute('DELETE FROM Categoria WHERE id_categoria = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        res.status(200).json({ message: 'Categoría eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar categoría', error: error.message });
    }
}; 