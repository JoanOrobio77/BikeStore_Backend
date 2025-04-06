const express = require('express');
const router = express.Router();
const detalleVentaController = require('../controllers/detalleVenta.controller');
const verifyToken = require('../middleware/auth.middleware');

// Rutas para detalles de venta
router.post('/', verifyToken, detalleVentaController.create);
router.get('/venta/:ventaId', verifyToken, detalleVentaController.findAll);
router.get('/:id', verifyToken, detalleVentaController.findOne);
router.put('/:id', verifyToken, detalleVentaController.update);
router.delete('/:id', verifyToken, detalleVentaController.delete);

module.exports = router; 