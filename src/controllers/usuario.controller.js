const db = require('../config/db.config');
const bcrypt = require('bcryptjs');

// Crear un nuevo usuario
exports.create = async (req, res) => {
    try {
        const { nombre, telefono, email, contrasena, id_rol } = req.body;
        const hashedPassword = await bcrypt.hash(contrasena, 10);
        
        const [result] = await db.execute(
            'INSERT INTO Usuarios (nombre, telefono, email, contrasena, id_rol) VALUES (?, ?, ?, ?, ?)',
            [nombre, telefono, email, hashedPassword, id_rol]
        );
        
        res.status(201).json({ message: 'Usuario creado exitosamente', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear usuario', error: error.message });
    }
};

// Obtener todos los usuarios
exports.findAll = async (req, res) => {
    try {
        const [usuarios] = await db.execute('SELECT * FROM Usuarios');
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
    }
};

// Obtener un usuario por ID
exports.findOne = async (req, res) => {
    try {
        const [usuario] = await db.execute('SELECT * FROM Usuarios WHERE id_usuario = ?', [req.params.id]);
        if (usuario.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(usuario[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
    }
};

// Actualizar un usuario
exports.update = async (req, res) => {
    try {
        const { nombre, telefono, email, id_rol } = req.body;
        const [result] = await db.execute(
            'UPDATE Usuarios SET nombre = ?, telefono = ?, email = ?, id_rol = ? WHERE id_usuario = ?',
            [nombre, telefono, email, id_rol, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        
        res.status(200).json({ message: 'Usuario actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
    }
};

// Eliminar un usuario
exports.delete = async (req, res) => {
    try {
        const [result] = await db.execute('DELETE FROM Usuarios WHERE id_usuario = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        
        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
    }
}; 