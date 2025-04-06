const db = require('../config/db.config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { nombre, telefono, email, contrasena } = req.body;
        
        // Verificar si el email ya existe
        const [existingUser] = await db.execute('SELECT * FROM Usuarios WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }

        // Verificar si existe el rol de usuario (id_rol = 2)
        const [roles] = await db.execute('SELECT * FROM rol WHERE id_rol = 2');
        if (roles.length === 0) {
            // Si no existe el rol, lo creamos
            await db.execute('INSERT INTO rol (id_rol, nombre_rol) VALUES (2, "Usuario")');
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        // Asignar rol de usuario por defecto (2)
        const id_rol = 2;

        // Crear usuario
        const [result] = await db.execute(
            'INSERT INTO Usuarios (nombre, telefono, email, contrasena, id_rol) VALUES (?, ?, ?, ?, ?)',
            [nombre, telefono, email, hashedPassword, id_rol]
        );

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ 
            message: 'Error al registrar usuario', 
            error: error.message,
            details: error.stack 
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, contrasena } = req.body;

        // Buscar usuario y su rol
        const [users] = await db.execute(`
            SELECT u.*, r.nombre_rol 
            FROM Usuarios u 
            JOIN rol r ON u.id_rol = r.id_rol 
            WHERE u.email = ?
        `, [email]);

        if (users.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = users[0];

        // Verificar contraseña
        const validPassword = await bcrypt.compare(contrasena, user.contrasena);
        if (!validPassword) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Generar token
        const token = jwt.sign(
            { 
                id: user.id_usuario, 
                email: user.email, 
                rol: user.id_rol,
                rolNombre: user.nombre_rol 
            },
            process.env.JWT_SECRET || 'bikestore_secret_key_2024',
            { expiresIn: '24h' }
        );

        res.status(200).json({
            token,
            user: {
                id: user.id_usuario,
                nombre: user.nombre,
                email: user.email,
                rol: user.id_rol,
                rolNombre: user.nombre_rol
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ 
            message: 'Error al iniciar sesión', 
            error: error.message,
            details: error.stack 
        });
    }
}; 