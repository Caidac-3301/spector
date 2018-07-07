import { CloudWatchLogs, SharedIniFileCredentials } from 'aws-sdk';
import { Request, Response } from "express";
import logger from '../utils/logger';

const { AWS_REGION, AWS_PROFILE } = process.env;

const cloudWatchLogs = new CloudWatchLogs({
    credentials: new SharedIniFileCredentials({ profile: AWS_PROFILE }),
    region: AWS_REGION
});

export const describeLogGroups = async (req: Request, res: Response) => {
    try {
        const data = await cloudWatchLogs.describeLogGroups().promise();
        console.log(data);
        res.json(data);
    } catch (error) {
        logger.error(error)
    }
};
