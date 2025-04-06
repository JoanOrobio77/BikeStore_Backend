const express = require('express');
const router = express.Router();
const productoController = require('../controllers/producto.controller');
const upload = require('../config/multer.config');
const verifyToken = require('../middleware/auth.middleware');

// Rutas para productos
router.post('/', verifyToken, upload.single('imagen'), productoController.create);
router.get('/', productoController.findAll);
router.get('/:id', productoController.findOne);
router.put('/:id', verifyToken, upload.single('imagen'), productoController.update);
router.delete('/:id', verifyToken, productoController.delete);

module.exports = router; 