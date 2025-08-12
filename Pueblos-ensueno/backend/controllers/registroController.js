const pool = require('../db/connection');

exports.crearUsuarioCompleto = async (req, res) => {
  const {
    usuario, contrasenia,
    nombre, apellidos, fecha_nacimiento, telefono, correo,
    estado_id, municipio_id
  } = req.body;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [loginResult] = await connection.query(
      'INSERT INTO pue_login (log_usuario, log_contrasenia) VALUES (?, ?)',
      [usuario, contrasenia]
    );
    const loginId = loginResult.insertId;

    const [registroResult] = await connection.query(
      'INSERT INTO pue_registro (reg_nombre, reg_apellidos, reg_fecha_nacimiento, reg_telefono, reg_correo, reg_contrasena) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, apellidos, fecha_nacimiento, telefono, correo, contrasenia]
    );
    const registroId = registroResult.insertId;

    const [interesResult] = await connection.query(
      'INSERT INTO pue_intereses (int_fkestados, int_fkmunicipios) VALUES (?, ?)',
      [estado_id, municipio_id]
    );
    const interesId = interesResult.insertId;

    const [usuarioIntResult] = await connection.query(
      'INSERT INTO pue_usuario_intereses (usuint_fkintereses) VALUES (?)',
      [interesId]
    );
    const usuarioInteresId = usuarioIntResult.insertId;

    await connection.query(
      'INSERT INTO pue_usuario (usu_fkregistro, usu_fklogin, usu_fkusuarios_intereses) VALUES (?, ?, ?)',
      [registroId, loginId, usuarioInteresId]
    );

    await connection.commit();
    res.json({ success: true, mensaje: "Usuario creado con éxito" });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
};
