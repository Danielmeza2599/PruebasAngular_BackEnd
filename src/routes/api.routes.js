import { Router } from 'express';
import {
  searchYouTube,
  getFavorites,
  addFavorite,
  removeFavorite,
} from '../controllers/api.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

// Todas las rutas en este archivo requieren un token válido
router.use(verifyToken);

// GET /api/youtube/search?q=angular
router.get('/youtube/search', searchYouTube);

// GET /api/favorites
router.get('/favorites', getFavorites);

// POST /api/favorites
router.post('/favorites', addFavorite);

// DELETE /api/favorites/:videoId
router.delete('/favorites/:videoId', removeFavorite);

export default router;