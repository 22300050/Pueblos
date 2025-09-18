import pool from '../db/connection.js';
import path from 'path';

export const obtenerUsuarios = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM pue_usuario');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualiza la columna 'avatar' de la tabla pue_usuario (o crea la columna manualmente si es necesario)
export const subirAvatar = async (req, res) => {
  try {
    // 1. Obtener id desde params
    const userId = req.params.id;

    // 2. Validar que multer haya proporcionado un archivo
    if (!req.file) {
      return res.status(400).json({ message: 'No se envió ningún archivo' });
    }

    // 3. Construir la ruta pública
    const avatarPath = `/uploads/${req.file.filename}`;

    // 4. Actualizar la base de datos: se asume columna 'foto' en la tabla 'usuario' o 'pue_usuario'
    // Intentamos actualizar en la tabla 'usuario' primero; si falla, se puede adaptar.
    const sql = 'UPDATE pue_usuario SET foto = ? WHERE usu_id = ?';
    const [result] = await pool.query(sql, [avatarPath, userId]);

    // 5. Comprobar si se actualizó algún registro
    // En mysql2, result.affectedRows indica número de filas afectadas
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // 5. Responder con el mensaje y la ruta
    return res.status(200).json({ message: 'Avatar subido correctamente', avatar: avatarPath });
  } catch (error) {
    // 6. Manejo de errores
    console.error('Error al subir el avatar:', error);
    return res.status(500).json({ message: 'Error al subir el avatar' });
  }
};

export default { obtenerUsuarios, subirAvatar };
