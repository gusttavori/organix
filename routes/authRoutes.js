const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.registrar);  // Rota para registrar usuário
router.post('/login', authController.login);  // Rota para login de usuário

module.exports = router;