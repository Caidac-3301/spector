import { CloudWatchLogs } from 'aws-sdk';
import { NextFunction, Request, Response, Router } from 'express';
import { ESClient } from '..';
import { isConfigured } from '../middlewares';

const router = Router();

const fetchLogGroups = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cloudWatchLogs = new CloudWatchLogs();
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });

        const params: CloudWatchLogs.DescribeLogGroupsRequest = {
            logGroupNamePrefix: '/aws/lambda/'
        };
        const start = new Date().getTime();
        const paginationCalls = async () => {
            const { logGroups = [], nextToken } = await cloudWatchLogs.describeLogGroups(params).promise();
            for (const log of logGroups) {
                const bleachedName = log.logGroupName && log.logGroupName.split('/').pop() || '';
                res.write(`${bleachedName} created\n`);
                await ESClient.create({
                    index: bleachedName.toLowerCase(),
                    type: '_doc',
                    id: bleachedName,
                    body: {
                        arn: log.arn,
                        logGroupName: log.logGroupName,
                        storedBytes: log.storedBytes,
                        creationTime: log.creationTime,
                        metricFilterCount: log.metricFilterCount,
                    }
                });
            }
            if (nextToken) {
                params.nextToken = nextToken;
                await paginationCalls();
            }
        };
        await paginationCalls();

        const end = new Date().getTime();
        res.write(`Fetching Completed in ${(end - start) / 1000} secs (${(end - start) / 60000} mins).\n`);
        res.end();
    } catch (error) {
        next(error);
    }
};


/**
 * Define `/fetch` routes here:
 */

router.get('/', isConfigured, fetchLogGroups);

export default router;
