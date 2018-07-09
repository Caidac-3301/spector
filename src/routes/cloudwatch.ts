import { CloudWatchLogs, SharedIniFileCredentials } from 'aws-sdk';
import { NextFunction, Request, Response, Router } from 'express';

const router = Router();
const { AWS_REGION, AWS_PROFILE } = process.env;

const cloudWatchLogs = new CloudWatchLogs({
    credentials: new SharedIniFileCredentials({ profile: AWS_PROFILE }),
    region: AWS_REGION
});

const fetchLogGroups = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data: any[] = [];
        const params: CloudWatchLogs.DescribeLogGroupsRequest = {
            logGroupNamePrefix: '/aws/lambda/'
        }
        const paginationCalls = async () => {
            const { logGroups = [], nextToken } = await cloudWatchLogs.describeLogGroups(params).promise();
            logGroups.forEach(log => data.push(log as any));
            if (nextToken) {
                params.nextToken = nextToken;
                await paginationCalls();
            };
        };
        await paginationCalls();

        res.json({ success: true, message: `${data.length} entries found and updated in Database` });
    } catch (error) {
        next(error);
    }
};


/**
 * Define `/fetch` routes here:
 */

router.get('/', fetchLogGroups);

export default router;
