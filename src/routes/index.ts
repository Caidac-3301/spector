import { Router, Request, Response } from 'express';
import cloudWatchRoutes from './cloudwatch';
import settingsRoutes from './settings';

const router = Router();

router.use('/fetch', cloudWatchRoutes);
router.use('/settings', settingsRoutes);
router.use('/about-us', (req: Request, res: Response) => {
    res.render('static/about-us', { title: 'About Spector' });
});

export default router;
