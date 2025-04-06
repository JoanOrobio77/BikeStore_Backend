const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');

// Rutas para usuarios
router.post('/', usuarioController.create);
router.get('/', usuarioController.findAll);
router.get('/:id', usuarioController.findOne);
router.put('/:id', usuarioController.update);
router.delete('/:id', usuarioController.delete);

module.exports = router; 