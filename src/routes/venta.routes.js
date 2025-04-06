const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/venta.controller');
const verifyToken = require('../middleware/auth.middleware');

// Rutas para ventas
router.post('/', verifyToken, ventaController.create);
router.get('/', verifyToken, ventaController.findAll);
router.get('/:id', verifyToken, ventaController.findOne);
router.put('/:id', verifyToken, ventaController.update);
router.delete('/:id', verifyToken, ventaController.delete);

module.exports = router; 