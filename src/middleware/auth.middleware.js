const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(403).json({ message: 'No se proporcionó token' });
    }

    // Extraer el token del encabezado Authorization (formato: "Bearer TOKEN")
    const token = authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(403).json({ message: 'Formato de token inválido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
};

module.exports = verifyToken; 