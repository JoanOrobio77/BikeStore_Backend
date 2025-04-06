const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rol.controller');
const verifyToken = require('../middleware/auth.middleware');

// Rutas para roles
router.post('/', verifyToken, rolController.create);
router.get('/', verifyToken, rolController.findAll);
router.get('/:id', verifyToken, rolController.findOne);
router.put('/:id', verifyToken, rolController.update);
router.delete('/:id', verifyToken, rolController.delete);

module.exports = router; 