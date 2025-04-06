const db = require('../config/db.config');

// Crear un nuevo rol
exports.create = async (req, res) => {
    try {
        const { nombre_rol } = req.body;
        
        const [result] = await db.execute(
            'INSERT INTO rol (nombre_rol) VALUES (?)',
            [nombre_rol]
        );

        res.status(201).json({ message: 'Rol creado exitosamente', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear rol', error: error.message });
    }
};

// Obtener todos los roles
exports.findAll = async (req, res) => {
    try {
        const [roles] = await db.execute('SELECT * FROM rol');
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener roles', error: error.message });
    }
};

// Obtener un rol por ID
exports.findOne = async (req, res) => {
    try {
        const [rol] = await db.execute('SELECT * FROM rol WHERE id_rol = ?', [req.params.id]);
        if (rol.length === 0) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }
        res.status(200).json(rol[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener rol', error: error.message });
    }
};

// Actualizar un rol
exports.update = async (req, res) => {
    try {
        const { nombre_rol } = req.body;
        const [result] = await db.execute(
            'UPDATE rol SET nombre_rol = ? WHERE id_rol = ?',
            [nombre_rol, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }

        res.status(200).json({ message: 'Rol actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar rol', error: error.message });
    }
};

// Eliminar un rol
exports.delete = async (req, res) => {
    try {
        const [result] = await db.execute('DELETE FROM rol WHERE id_rol = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }

        res.status(200).json({ message: 'Rol eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar rol', error: error.message });
    }
}; 