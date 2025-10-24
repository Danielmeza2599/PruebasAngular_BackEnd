import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';

// --- Registrar un nuevo usuario ---
export const register = async (req, res) => {
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    confirmPassword,
    recaptchaToken, // Token de ReCaptcha del frontend
  } = req.body;

  // 1. Validaciones básicas
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Las contraseñas no coinciden.' });
  }

  // 2. Validar ReCaptcha
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

    const recaptchaResponse = await axios.post(verifyUrl);

    if (!recaptchaResponse.data.success) {
      return res.status(400).json({ message: 'Validación de ReCaptcha fallida.' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error validando ReCaptcha.', error: error.message });
  }

  // 3. Hashear contraseña y guardar usuario
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      'INSERT INTO users (first_name, last_name, username, email, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING id, username',
      [firstName, lastName, username, email, passwordHash]
    );

    res.status(201).json({
      message: 'Usuario registrado con éxito.',
      user: newUser.rows[0],
    });
  } catch (error) {
    // Manejar error de 'UNIQUE constraint' (email o username ya existen)
    if (error.code === '23505') {
      return res.status(409).json({ message: 'El nombre de usuario o email ya existe.' });
    }
    res.status(500).json({ message: 'Error al registrar el usuario.', error: error.message });
  }
};

// --- Iniciar sesión ---
export const login = async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    // 1. Buscar al usuario
    const userResult = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $1',
      [usernameOrEmail]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const user = userResult.rows[0];

    // 2. Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // 3. Crear y firmar el JWT
    const token = jwt.sign(
      { userId: user.id }, // Payload (lo que guardamos en el token)
      process.env.JWT_SECRET,
      { expiresIn: '8h' } // El token expira en 8 horas
    );
    
    // 4. Enviar respuesta
    res.json({
      message: 'Inicio de sesión exitoso.',
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor.', error: error.message });
  }
};