// import { CloudWatchLogs, SharedIniFileCredentials } from 'aws-sdk';
import { Router } from 'express';
import cloudWatchRoutes from './cloudwatch';

const router = Router();

router.use('/fetch', cloudWatchRoutes);

export default router;
