import { Router } from 'express';
import settingsRoutes from './settings';
import cloudWatchRoutes from './cloudwatch';

const router = Router();

router.use('/fetch', cloudWatchRoutes);
router.use('/settings', settingsRoutes)

export default router;
