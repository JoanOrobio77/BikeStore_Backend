const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stock.controller');
const verifyToken = require('../middleware/auth.middleware');

// Rutas para stock
router.post('/', verifyToken, stockController.create);
router.get('/', verifyToken, stockController.findAll);
router.get('/:id', verifyToken, stockController.findOne);
router.put('/:id', verifyToken, stockController.update);
router.delete('/:id', verifyToken, stockController.delete);

module.exports = router; 