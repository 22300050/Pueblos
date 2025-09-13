import pool from '../db/connection.js';
import bcrypt from 'bcryptjs'; // Updated import for bcryptjs
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  const { nombre, apellidos, fechaNacimiento, telefono, email, password } = req.body;

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [result] = await pool.query(
      'INSERT INTO usuario (nombre, apellidos, fecha_nacimiento, telefono, email, password) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, apellidos, fechaNacimiento, telefono, email, hashedPassword]
    );

    console.log('Nuevo usuario registrado:', result);
    res.status(201).json({ message: 'Usuario registrado exitosamente', userId: result.insertId });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'El correo electrónico ya está en uso.' });
    }
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

 try {
    // 1. Busca al usuario por su correo electrónico en la tabla 'usuario'
    const [rows] = await pool.query('SELECT * FROM usuario WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Inicio de sesión exitoso.',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
      },
    });

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};