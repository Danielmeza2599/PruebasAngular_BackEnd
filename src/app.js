import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importar rutas
import authRoutes from './routes/auth.routes.js';
import apiRoutes from './routes/api.routes.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permite peticiones de otros dominios (Angular)
app.use(express.json()); // Permite a Express entender JSON

// Rutas
app.get('/', (req, res) => {
  res.send('API de MEZA Technology funcionando');
});

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de la aplicación (protegidas)
app.use('/api', apiRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});