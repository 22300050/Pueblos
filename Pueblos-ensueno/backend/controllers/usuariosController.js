const pool = require('../db/connection');

exports.obtenerUsuarios = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM pue_usuario');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
