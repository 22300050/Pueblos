import 'dotenv/config'; // Changed this line for ES modules
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chat.js';
import usuariosRoutes from './routes/usuarios.js';
import path from 'path';
import { fileURLToPath } from 'url';
const app = express();

app.use(cors());
app.use(express.json());
// Servir archivos estáticos de uploads para que el frontend pueda mostrar avatares
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/usuarios', usuariosRoutes);
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${port}`);
});