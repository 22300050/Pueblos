import express from 'express';
import { obtenerUsuarios, subirAvatar } from '../controllers/usuariosController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', obtenerUsuarios);

// Ruta para subir avatar: form-data field name = 'avatar'
router.post('/:id/avatar', upload.single('avatar'), subirAvatar);

export default router;
