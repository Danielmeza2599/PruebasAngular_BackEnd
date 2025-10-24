import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  // Obtener el token del header 'Authorization'
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(403).json({ message: 'No se proporcionó un token.' });
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Adjuntar el ID del usuario al objeto 'req'
    req.userId = decoded.userId; 
    
    next(); // Continuar a la siguiente función (el controlador)
  } catch (error) {
    return res.status(401).json({ message: 'Token no válido o expirado.' });
  }
};