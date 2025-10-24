import pool from '../config/db.js';
import axios from 'axios';

// --- Buscar en YouTube (Proxy) ---
export const searchYouTube = async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ message: 'Se requiere un término de búsqueda (q).' });
  }

  try {
    const youtubeUrl = 'https://www.googleapis.com/youtube/v3/search';
    const response = await axios.get(youtubeUrl, {
      params: {
        part: 'snippet',
        q: query,
        key: process.env.YOUTUBE_API_KEY,
        maxResults: 15, // Puedes ajustar esto
        type: 'video',
      },
    });

    // Mapear los resultados para que sean más limpios
    const videos = response.data.items.map(item => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.default.url
    }));

    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar en YouTube.', error: error.message });
  }
};

// --- Obtener todos los favoritos del usuario ---
export const getFavorites = async (req, res) => {
  const userId = req.userId; // Obtenido del middleware (token)

  try {
    const favorites = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 ORDER BY added_at DESC',
      [userId]
    );
    res.json(favorites.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener favoritos.', error: error.message });
  }
};

// --- Añadir un video a favoritos ---
export const addFavorite = async (req, res) => {
  const userId = req.userId;
  const { videoId, title, thumbnailUrl } = req.body;

  if (!videoId || !title) {
    return res.status(400).json({ message: 'Faltan datos (videoId, title).' });
  }

  try {
    const newFavorite = await pool.query(
      'INSERT INTO favorites (user_id, video_id, title, thumbnail_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, videoId, title, thumbnailUrl]
    );
    res.status(201).json(newFavorite.rows[0]);
  } catch (error) {
     // Manejar error si ya existe (UNIQUE constraint)
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Este video ya está en tus favoritos.' });
    }
    res.status(500).json({ message: 'Error al añadir favorito.', error: error.message });
  }
};

// --- Eliminar un video de favoritos ---
export const removeFavorite = async (req, res) => {
  const userId = req.userId;
  const { videoId } = req.params; // Obtenido de la URL (ej. /api/favorites/XYZ123)

  try {
    const deleteResult = await pool.query(
      'DELETE FROM favorites WHERE user_id = $1 AND video_id = $2',
      [userId, videoId]
    );

    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ message: 'Favorito no encontrado.' });
    }

    res.status(204).send(); // 204 = No Content (éxito, pero no devuelve nada)
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar favorito.', error: error.message });
  }
};