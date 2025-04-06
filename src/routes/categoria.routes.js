const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoria.controller');
const verifyToken = require('../middleware/auth.middleware');

// Rutas para categorías
router.post('/', verifyToken, categoriaController.create);
router.get('/', categoriaController.findAll);
router.get('/:id', categoriaController.findOne);
router.put('/:id', verifyToken, categoriaController.update);
router.delete('/:id', verifyToken, categoriaController.delete);

module.exports = router; 