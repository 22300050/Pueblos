import 'dotenv/config'; // Changed this line for ES modules
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chat.js';
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);  
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${port}`);
});