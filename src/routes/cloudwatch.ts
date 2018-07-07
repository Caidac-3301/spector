import { CloudWatchLogs, SharedIniFileCredentials } from 'aws-sdk';
import { NextFunction, Request, Response, Router } from "express";

const router = Router();
const { AWS_REGION, AWS_PROFILE } = process.env;

const cloudWatchLogs = new CloudWatchLogs({
    credentials: new SharedIniFileCredentials({ profile: AWS_PROFILE }),
    region: AWS_REGION
});

const describeLogGroups = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await cloudWatchLogs.describeLogGroups().promise();
        res.json(data);
    } catch (error) {
        next(error);
    }
};


/**
 * Define `/fetch` routes here:
 */

router.get('/', describeLogGroups);

export default router;
