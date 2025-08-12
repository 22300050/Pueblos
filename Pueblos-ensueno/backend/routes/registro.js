const express = require('express');
const router = express.Router();
const controller = require('../controllers/registroController');

router.post('/', controller.crearUsuarioCompleto);

module.exports = router;
