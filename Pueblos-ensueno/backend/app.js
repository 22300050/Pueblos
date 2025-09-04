import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import chatRoutes from "./routes/chat.js";
// Si tienes este módulo de registro, pásalo a ESM e impórtalo así:
// import registroRoutes from "./routes/registro.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas IA (Gemini)
app.use("/api/chat", chatRoutes);

// Si necesitas mantener la parte de registro, descomenta:
// app.use("/api/registro", registroRoutes);

// 👇 IMPORTANTE: aquí NO va app.listen. Solo exportamos el app.
export default app;
