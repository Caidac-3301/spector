import { Request, Response, NextFunction } from 'express';
import { Client } from 'elasticsearch';
import app from './app';
import logger from './utils/logger';

// Error Handler. Provides full stack traces and internal details in dev mode
if (app.get('env') !== 'production') {
    const errorHandler = require('errorhandler');
    app.use(errorHandler());
} else {
    // production error handler
    // no stacktraces leaked to user
    app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
        logger.error({ message: err.message, stack: err.stack });
        res.status(err.status || 500);
        res.json({
            'errors': {
                message: err.message
            }
        });
        next(err);
    });
}

export const ESClient = new Client({
    host: 'url-of-elasticsearch-instance-here'
});

// Start Express server.
const server = app.listen(app.get('port'), async () => {
    try {
        await ESClient.ping({});
        console.log(`\nAll is well`);
        console.log(`App is running at http://localhost:${app.get('port')} in ${app.get('env')} mode`);
        console.log(`Press CTRL-C to stop\n`);
    } catch (err) {
        logger.error({ message: err.message, stack: err.stack });
    }
});

export default server;
