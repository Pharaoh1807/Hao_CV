import express from 'express';
import { getCV, updateCV } from '../controllers/cvController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getCV);
router.put('/', protect, updateCV);

export default router;
