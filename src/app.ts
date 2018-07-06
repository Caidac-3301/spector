import * as bodyParser from 'body-parser';
import * as express from 'express';
import logger from './utils/logger';

// Create Express server
const app = express();

// Express configuration
app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ping
app.get('/ping', (req, res) => {
    logger.info(`Ping received successfully at ${new Date().toString()}`);
    res.send('<h1>Pong</h1>');
});

export default app;
