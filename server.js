const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./src/routes/auth.routes');
const usuarioRoutes = require('./src/routes/usuario.routes');
const rolRoutes = require('./src/routes/rol.routes');
const categoriaRoutes = require('./src/routes/categoria.routes');
const productoRoutes = require('./src/routes/producto.routes');
const stockRoutes = require('./src/routes/stock.routes');
const ventaRoutes = require('./src/routes/venta.routes');
const detalleVentaRoutes = require('./src/routes/detalleVenta.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'src/frontend')));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/roles', rolRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/detalle-ventas', detalleVentaRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/frontend/html/home.html'));
});

// Ruta para el panel de administración
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/frontend/html/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
