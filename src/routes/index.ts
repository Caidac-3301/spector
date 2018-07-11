import { Router } from 'express';
import cloudWatchRoutes from './cloudwatch';
import settingsRoutes from './settings';

const router = Router();

router.use('/fetch', cloudWatchRoutes);
router.use('/settings', settingsRoutes);

export default router;
